import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadPublicFileToApimg } from "@/lib/storage/apimg";

vi.mock("server-only", () => ({}));

const uploadUrl = "https://apimg.com.br/v1/upload";
const apiKey = "unit-test-apimg-key";

const configured = {
  APIMG_UPLOAD_URL: uploadUrl,
  APIMG_API_KEY: apiKey,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("APIMG server upload", () => {
  it("fails closed when APIMG_UPLOAD_URL is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      uploadPublicFileToApimg(new Blob(["a"]), {
        env: { APIMG_API_KEY: apiKey },
      }),
    ).rejects.toThrow("APIMG_NOT_CONFIGURED");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed when APIMG_API_KEY is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      uploadPublicFileToApimg(new Blob(["a"]), {
        env: { APIMG_UPLOAD_URL: uploadUrl },
      }),
    ).rejects.toThrow("APIMG_NOT_CONFIGURED");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts only the file field and the server-side API key", async () => {
    const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(async () =>
      jsonResponse({ url: "https://cdn.example/a.png", public_id: "a" }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const file = new File([Uint8Array.from([1, 2])], "capa.png", { type: "image/png" });

    await uploadPublicFileToApimg(file, { env: configured });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [target, init] = fetchMock.mock.calls[0];
    if (!init) {
      throw new Error("missing request init");
    }
    expect(target).toBe(uploadUrl);
    expect(init.method).toBe("POST");
    const headers = new Headers(init.headers);
    expect(headers.get("x-api-key")).toBe(apiKey);
    expect(headers.get("content-type")).toBeNull();
    expect(init.body).toBeInstanceOf(FormData);
    const form = init.body as FormData;
    expect([...form.keys()]).toEqual(["file"]);
    expect(form.has("folder")).toBe(false);
    expect(form.has("apiKey")).toBe(false);
  });

  it("normalizes url and public_id", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({
          url: "https://cdn.example/foto.jpg",
          public_id: "public-1",
          format: "jpg",
          bytes: 42,
        }),
      ),
    );

    await expect(uploadPublicFileToApimg(new Blob(["a"]), { env: configured })).resolves.toEqual({
      url: "https://cdn.example/foto.jpg",
      publicId: "public-1",
      format: "jpg",
      bytes: 42,
    });
  });

  it("accepts publicId", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({
          url: "https://cdn.example/foto.jpg",
          publicId: "camel-1",
        }),
      ),
    );

    await expect(uploadPublicFileToApimg(new Blob(["a"]), { env: configured })).resolves.toMatchObject({
      publicId: "camel-1",
    });
  });

  it("accepts secure_url and data.secure_url", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ secure_url: "https://cdn.example/secure.jpg" })),
    );

    await expect(uploadPublicFileToApimg(new Blob(["a"]), { env: configured })).resolves.toMatchObject({
      url: "https://cdn.example/secure.jpg",
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ data: { secure_url: "https://cdn.example/nested-secure.jpg" } })),
    );

    await expect(uploadPublicFileToApimg(new Blob(["a"]), { env: configured })).resolves.toMatchObject({
      url: "https://cdn.example/nested-secure.jpg",
    });
  });

  it("accepts data.url", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({
          data: { url: "https://cdn.example/nested.png" },
        }),
      ),
    );

    await expect(uploadPublicFileToApimg(new Blob(["a"]), { env: configured })).resolves.toMatchObject({
      url: "https://cdn.example/nested.png",
      publicId: "nested.png",
    });
  });

  it("rejects a response without a URL", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ public_id: "only-id" })));

    await expect(uploadPublicFileToApimg(new Blob(["a"]), { env: configured })).rejects.toThrow(
      "APIMG_INVALID_RESPONSE",
    );
  });

  it("normalizes an HTTP 4xx detail without the raw payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({ detail: [{ msg: "tipo não suportado" }], debug: { raw: true } }, 422),
      ),
    );

    await expect(uploadPublicFileToApimg(new Blob(["a"]), { env: configured })).rejects.toThrow(
      "APIMG_UPLOAD_FAILED: tipo não suportado",
    );
  });

  it("normalizes an HTTP 5xx message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ error: { message: "serviço indisponível" } }, 503)),
    );

    await expect(uploadPublicFileToApimg(new Blob(["a"]), { env: configured })).rejects.toThrow(
      "APIMG_UPLOAD_FAILED: serviço indisponível",
    );
  });

  it("rejects invalid JSON", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("not-json", { status: 200 })));

    await expect(uploadPublicFileToApimg(new Blob(["a"]), { env: configured })).rejects.toThrow(
      "APIMG_INVALID_RESPONSE",
    );
  });

  it("never returns the API key", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({
          url: "https://cdn.example/foto.jpg",
          public_id: "public-1",
          format: "jpg",
          bytes: 4,
        }),
      ),
    );

    const result = await uploadPublicFileToApimg(new Blob(["a"]), { env: configured });

    expect(JSON.stringify(result)).not.toContain(apiKey);
    expect(result).not.toHaveProperty("apiKey");
  });

  it("never serializes the API key in an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({ message: `recusado ${apiKey}`, detail: apiKey }, 400),
      ),
    );

    const error = await uploadPublicFileToApimg(new Blob(["a"]), { env: configured }).then(
      () => null,
      (caught: unknown) => caught,
    );

    expect(error).toBeInstanceOf(Error);
    const thrown = error as Error;
    const serialized = JSON.stringify(thrown, Object.getOwnPropertyNames(thrown));
    expect(thrown.message).not.toContain(apiKey);
    expect(thrown.stack ?? "").not.toContain(apiKey);
    expect(serialized).not.toContain(apiKey);
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
