import { describe, expect, it } from "vitest";
import {
  isNotInformed,
  isPresent,
  presenceFromCheckbox,
  presenceToCheckbox,
} from "@/lib/clinical/presence";

describe("presence semantics", () => {
  it("maps unchecked to not informed, never absent", () => {
    expect(presenceFromCheckbox(false)).toBeNull();
    expect(presenceFromCheckbox(true)).toBe(true);
  });

  it("treats null and false differently from present", () => {
    expect(isPresent(true)).toBe(true);
    expect(isPresent(null)).toBe(false);
    expect(isPresent(false)).toBe(false);
    expect(isNotInformed(null)).toBe(true);
    expect(isNotInformed(true)).toBe(false);
  });

  it("checkbox view only lights when present", () => {
    expect(presenceToCheckbox(true)).toBe(true);
    expect(presenceToCheckbox(null)).toBe(false);
    expect(presenceToCheckbox(false)).toBe(false);
  });
});
