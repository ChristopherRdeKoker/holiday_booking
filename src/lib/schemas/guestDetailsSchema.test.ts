import { describe, expect, it } from "vitest";
import { guestDetailsSchema } from "@/lib/schemas/guestDetailsSchema";

describe("guestDetailsSchema", () => {
  it("accepts valid details", () => {
    expect(guestDetailsSchema.safeParse({ name: "Thandi M", email: "t@example.com", guests: "3", agree: true }).success).toBe(true);
  });
  it("rejects a bad email, a short name, zero guests and missing consent", () => {
    const parsed = guestDetailsSchema.safeParse({ name: "T", email: "nope", guests: "0", agree: false });
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(Object.keys(parsed.error.flatten().fieldErrors).sort()).toEqual(["agree", "email", "guests", "name"]);
  });
});
