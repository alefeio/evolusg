import "server-only";

/**
 * APIMG_STORAGE_CLASSIFICATION = PUBLIC_NON_CLINICAL_ONLY
 *
 * A URL pública devolvida pela APIMG não autoriza acesso a dado clínico.
 * PRIVATE_CLINICAL_STORAGE_REQUIRED_BEFORE_PATIENT_FILE_UPLOAD
 */
export const APIMG_STORAGE_CLASSIFICATION = "PUBLIC_NON_CLINICAL_ONLY" as const;

export const PRIVATE_CLINICAL_STORAGE_REQUIRED_BEFORE_PATIENT_FILE_UPLOAD =
  "PRIVATE_CLINICAL_STORAGE_REQUIRED_BEFORE_PATIENT_FILE_UPLOAD" as const;

export type ApimgUploadResult = {
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
  originalFilename?: string;
};

type Env = Record<string, string | undefined>;

export function getApimgConfig(env: Env = process.env): {
  uploadUrl: string;
  apiKey: string;
} {
  const uploadUrl = env.APIMG_UPLOAD_URL?.trim();
  const apiKey = env.APIMG_API_KEY?.trim();

  if (!uploadUrl || !apiKey) {
    throw new Error("APIMG_NOT_CONFIGURED");
  }

  return { uploadUrl, apiKey };
}

export async function uploadPublicFileToApimg(
  file: File | Blob,
  options?: {
    filename?: string;
    env?: Env;
  },
): Promise<ApimgUploadResult> {
  const { uploadUrl, apiKey } = getApimgConfig(options?.env);
  const filename =
    options?.filename?.trim() ||
    (file instanceof File && file.name.trim() ? file.name : "upload");
  const body = new FormData();
  body.append("file", file, filename);

  let response: Response;
  try {
    response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "X-API-Key": apiKey },
      body,
      redirect: "manual",
    });
  } catch (error) {
    throw new Error(
      safeFailure("APIMG_UPLOAD_FAILED", error instanceof Error ? error.message : "", apiKey),
    );
  }

  const text = await response.text();

  if (response.status >= 300 && response.status < 400) {
    throw new Error("APIMG_UPLOAD_FAILED");
  }

  if (!response.ok) {
    throw new Error(safeFailure("APIMG_UPLOAD_FAILED", readErrorDetail(text), apiKey));
  }

  let payload: unknown;
  try {
    payload = text.trim() ? JSON.parse(text) : null;
  } catch {
    throw new Error("APIMG_INVALID_RESPONSE");
  }

  const result = normalizeUploadResult(payload);
  if (!result) {
    throw new Error("APIMG_INVALID_RESPONSE");
  }

  return result;
}

function normalizeUploadResult(payload: unknown): ApimgUploadResult | null {
  const record = asRecord(payload);
  if (!record) return null;

  if (hasFailureSignal(record)) return null;

  const url = readUrl(record);
  if (!url || !isHttpUrl(url)) return null;

  const format = readString(record, "format");
  const originalFilename =
    readString(record, "original_filename") ?? readString(record, "originalFilename");
  const bytes =
    typeof record.bytes === "number" && Number.isFinite(record.bytes)
      ? record.bytes
      : undefined;

  return {
    url,
    publicId: readString(record, "public_id") ?? readString(record, "publicId") ?? publicIdFromUrl(url),
    ...(format ? { format } : {}),
    ...(bytes !== undefined ? { bytes } : {}),
    ...(originalFilename ? { originalFilename } : {}),
  };
}

function readUrl(record: Record<string, unknown>): string | undefined {
  const direct = readString(record, "url") ?? readString(record, "secure_url");
  if (direct) return direct;

  const data = asRecord(record.data);
  if (!data) return undefined;
  return readString(data, "url") ?? readString(data, "secure_url");
}

function readErrorDetail(text: string): string {
  try {
    const payload = text.trim() ? JSON.parse(text) : null;
    return readErrorDetailFromRecord(asRecord(payload)) ?? "";
  } catch {
    return "";
  }
}

function hasFailureSignal(record: Record<string, unknown>): boolean {
  return record.detail != null || record.error != null;
}

function readErrorDetailFromRecord(record: Record<string, unknown> | null): string | undefined {
  if (!record) return undefined;

  if (Array.isArray(record.detail)) {
    const first = asRecord(record.detail[0]);
    const message = first ? readString(first, "msg") ?? readString(first, "message") : undefined;
    if (message) return message;
    if (typeof record.detail[0] === "string") return record.detail[0];
  }

  if (typeof record.detail === "string") return record.detail;
  if (typeof record.error === "string") return record.error;

  const nested = asRecord(record.error);
  return (
    (nested ? readString(nested, "message") : undefined) ??
    readString(record, "message")
  );
}

function publicIdFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/^\/+/, "");
    return path.slice(-200) || url.slice(-200);
  } catch {
    return url.slice(-200);
  }
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function safeFailure(code: string, detail: string, apiKey: string): string {
  const normalized = detail
    .split(apiKey)
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
  if (!normalized) return code;
  return `${code}: ${normalized}`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
