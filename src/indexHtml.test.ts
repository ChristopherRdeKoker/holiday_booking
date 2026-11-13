import { describe, expect, it } from "vitest";
import indexHtml from "../index.html?raw";

const REQUIRED_CSP =
  "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests";

describe("index.html", () => {
  it("carries exactly one Content-Security-Policy meta with the required policy", () => {
    const metas = [...indexHtml.matchAll(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/g)];
    expect(metas).toHaveLength(1);
    expect(metas[0][1]).toBe(REQUIRED_CSP);
  });
});
