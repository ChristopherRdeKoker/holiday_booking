import { describe, expect, it } from "vitest";
import { homes } from "@/data/homes";
import { findPhotoCredit, photoCredits, photoUrl } from "@/data/photoCredits";
import { PHOTO_WIDTHS } from "@/lib/schemas/photoSchema";
import creditsDoc from "../../CREDITS.md?raw";

const photoFiles = Object.keys(import.meta.glob("/public/photos/*")).map((filePath) => filePath.replace("/public/photos/", ""));
const ALLOWED_LICENCES = new Set(["CC0 1.0", "Public Domain Mark 1.0"]);

describe("photoCredits", () => {
  it("gives every home exactly one photo and no photo to a home that does not exist", () => {
    const homeIds = new Set(homes.map((home) => home.id));
    const creditIds = new Set(photoCredits.map((credit) => credit.homeId));
    const homesWithoutPhoto = [...homeIds].filter((homeId) => !creditIds.has(homeId));
    const photosWithoutHome = [...creditIds].filter((homeId) => !homeIds.has(homeId));

    expect(homesWithoutPhoto).toEqual([]);
    expect(photosWithoutHome).toEqual([]);
    expect(photoCredits).toHaveLength(12);
  });

  it("fills in every credit field and only uses open licences", () => {
    for (const credit of photoCredits) {
      for (const value of Object.values(credit)) {
        expect(String(value).trim().length).toBeGreaterThan(0);
      }
      expect(ALLOWED_LICENCES.has(credit.licence)).toBe(true);
      expect(credit.sourcePageUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    }
  });

  it("has both image sizes on disk for every photo", () => {
    for (const credit of photoCredits) {
      for (const widthPx of PHOTO_WIDTHS) {
        expect(photoFiles).toContain(`${credit.homeId}-${widthPx}.webp`);
      }
    }
  });

  it("ships no photo file that has no credit", () => {
    const creditIds = new Set(photoCredits.map((credit) => credit.homeId));
    const uncredited = photoFiles.filter((file) => !creditIds.has(file.replace(/-(600|1200)\.webp$/, "")));

    expect(uncredited).toEqual([]);
    expect(photoFiles).toHaveLength(24);
  });

  it("lists every photo in CREDITS.md", () => {
    for (const credit of photoCredits) {
      expect(creditsDoc).toContain(credit.sourcePageUrl);
      expect(creditsDoc).toContain(credit.originalFileUrl);
      expect(creditsDoc).toContain(credit.transformation);
    }
  });

  it("builds photo URLs under the app base path", () => {
    expect(photoUrl("knysna-lagoon-house", 600)).toBe("/apps/stays/photos/knysna-lagoon-house-600.webp");
  });

  it("fails loudly for a home with no photo", () => {
    expect(() => findPhotoCredit("no-such-home")).toThrow('No photo credit for home "no-such-home"');
  });
});
