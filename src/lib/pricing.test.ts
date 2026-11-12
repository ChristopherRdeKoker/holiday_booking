import { describe, expect, it } from "vitest";
import { formatRand, quote } from "@/lib/pricing";

describe("quote", () => {
  it("computes nights x rate + cleaning + 15% VAT", () => {
    const q = quote(185000, 3, 45000);
    expect(q.staySubtotalCents).toBe(555000);
    expect(q.exVatCents).toBe(600000);
    expect(q.vatCents).toBe(90000);
    expect(q.totalCents).toBe(690000);
  });
  it("rounds VAT once on the whole amount", () => {
    const q = quote(10003, 3, 10003);
    expect(q.exVatCents).toBe(40012);
    expect(q.vatCents).toBe(6002);
    const perLine = Math.round(10003 * 0.15) * 3 + Math.round(10003 * 0.15);
    expect(perLine).toBe(6000);
    expect(q.vatCents).not.toBe(perLine);
    expect(q.totalCents).toBe(46014);
  });
  it("rejects bad input loudly", () => {
    expect(() => quote(1000, 0, 0)).toThrow(RangeError);
    expect(() => quote(10.5, 1, 0)).toThrow(RangeError);
    expect(() => quote(1000, 2, -1)).toThrow(RangeError);
  });
});

describe("formatRand", () => {
  it("formats as South African rand", () => {
    const s = formatRand(690000).replace(/\s/g, " ");
    expect(s.startsWith("R")).toBe(true);
    expect(s).toMatch(/6.900,00$/);
  });
});
