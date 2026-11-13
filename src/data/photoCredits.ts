import { z } from "zod";
import { PHOTO_WIDTHS, photoCreditSchema } from "@/lib/schemas/photoSchema";

const photoCreditRecords = [
  {
    homeId: "paternoster-fishermans-loft",
    alt: "Granite boulders and kelp in a clear turquoise cove, with open sea and distant mountains",
    subject: "Boulders Beach on False Bay, Cape Peninsula",
    author: "jeffgreenca",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Boulders_Beach,_South_Africa.jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Boulders_Beach%2C_South_Africa.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x969 rendition of the 5883x2968 original; cropped to 3:2 (1454x969 from offset 466,0); resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "clarens-sandstone-cottage",
    alt: "Green hills with rows of tall cypress trees under big white clouds, mountains on the horizon",
    subject: "St. Fort Farm near Clarens, Free State",
    author: "ErinaceousHedge",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Landscape_in_St._Fort_Farm,_Clarens,_Freestate,_South_Africa.jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Landscape_in_St._Fort_Farm%2C_Clarens%2C_Freestate%2C_South_Africa.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1440 rendition of the 8064x6048 original; cropped to 3:2 (1920x1280 from offset 0,88); resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "knysna-lagoon-house",
    alt: "A small lagoon at the foot of steep, forested hills on the Garden Route",
    subject: "The Grootrivier lagoon and pass at Nature's Valley, Garden Route",
    author: "Androstachys",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Grootrivier_Pass00.jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Grootrivier_Pass00.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1280 rendition of the 3072x2048 original; already 3:2 so not cropped; resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "franschhoek-vineyard-barn",
    alt: "Rows of bare, gnarled grapevines on wires with green cover crops between them",
    subject: "A vineyard in the Cape Winelands near Stellenbosch",
    author: "lumoplank",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Cape_Winelands_-_Stellenbosch3785.jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Cape_Winelands_-_Stellenbosch3785.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1280 rendition of the 5184x3456 original; already 3:2 so not cropped; resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "hogsback-forest-cabin",
    alt: "A small waterfall tumbling into a dark pool, framed by tree ferns",
    subject: "Jubilee Creek waterfall in the Knysna forest, Western Cape",
    author: "ilf_",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Jubilee_Creek_waterfall_(40347935034).jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Jubilee_Creek_waterfall_%2840347935034%29.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1440 rendition of the 4032x3024 original; cropped to 3:2 (1920x1280 from offset 0,80); resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "nieu-bethesda-karoo-house",
    alt: "Dry Karoo shrubland with aloes, euphorbias and grey rocks under a pale sky",
    subject: "Robertson Karoo vegetation with aloes, Western Cape",
    author: "Abu Shawka",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Typical_Robertson_Karoo_vegetation_-_with_Aloe_microstigma_Tylecodon_and_Euphorbia.jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Typical_Robertson_Karoo_vegetation_-_with_Aloe_microstigma_Tylecodon_and_Euphorbia.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1390 rendition of the 2268x1642 original; cropped to 3:2 (1920x1280 from offset 0,55); resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "hermanus-whale-watch",
    alt: "A southern right whale surfacing in blue water, its head close to the camera",
    subject: "A southern right whale in Walker Bay, Western Cape",
    author: "lumoplank",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Whales,_Walker_Bay_%26_Gansbaai_-_Gansbaai4003.jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Whales%2C_Walker_Bay_%26_Gansbaai_-_Gansbaai4003.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1280 rendition of the 4424x2950 original; already 3:2 so not cropped; resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "wilderness-beach-shack",
    alt: "A wide, empty sandy beach with breaking waves and misty headlands",
    subject: "The beach at Port St. Johns, Eastern Cape",
    author: "Colanao Khod",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Port_St._Johns_Beach,_Eastern_Cape.jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/7/72/Port_St._Johns_Beach%2C_Eastern_Cape.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1207 rendition of the 4096x2574 original; cropped to 3:2 (1810x1207 from offset 55,0); resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "sabie-waterfall-lodge",
    alt: "A green summer meadow below hills covered in pine forest",
    subject: "Hills, forest and meadow west of Sabie, Mpumalanga",
    author: "M J Hurter",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Hills,_forests_and_meadow_near_Sabie.jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Hills%2C_forests_and_meadow_near_Sabie.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1080 rendition of the 4000x2250 original; cropped to 3:2 (1620x1080 from offset 150,0); resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "st-lucia-bush-rondavel",
    alt: "A still river at sunset with bush and trees silhouetted on the far bank",
    subject: "Sunset over the Letaba River, Kruger National Park",
    author: "Mike and Lara Wolfe",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Sunset_on_the_Letaba.jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/Sunset_on_the_Letaba.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1280 rendition of the 5184x3456 original; already 3:2 so not cropped; resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "kalk-bay-harbour-flat",
    alt: "Boats moored in a calm blue bay, with houses climbing the green mountainside behind",
    subject: "Simon's Town harbour on False Bay, Cape Peninsula",
    author: "Greg Zaal and Rico Cilliers (via Poly Haven)",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Backplate_%E2%80%93_Simon%27s_Town_Harbour_IMG_0163_(Greg_Zaal_and_Rico_Cilliers_via_Poly_Haven).jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Backplate_%E2%80%93_Simon%27s_Town_Harbour_IMG_0163_%28Greg_Zaal_and_Rico_Cilliers_via_Poly_Haven%29.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1280 rendition of the 5472x3648 original; already 3:2 so not cropped; resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
  {
    homeId: "cederberg-rock-farmstead",
    alt: "Orange sandstone towers and arches against a deep blue sky",
    subject: "Sandstone formations at the Stadsaal Caves, Cederberg",
    author: "Zaian",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Stadsaal_Caves_view_5.jpg",
    originalFileUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/Stadsaal_Caves_view_5.jpg",
    fetchedOn: "2026-11-13",
    transformation: "Downloaded the Wikimedia Commons 1920x1080 rendition of the 4128x2322 original; cropped to 3:2 (1620x1080 from offset 150,0); resized to 1200x800 and 600x400 and saved as WebP (quality 40 and 50) with Pillow. No other edits.",
  },
] as const satisfies readonly z.input<typeof photoCreditSchema>[];

export const photoCredits = z.array(photoCreditSchema).parse(photoCreditRecords);

export function findPhotoCredit(homeId: string): z.infer<typeof photoCreditSchema> {
  const result = photoCredits.find((credit) => credit.homeId === homeId);
  if (!result) throw new Error(`No photo credit for home "${homeId}"`);

  return result;
}

export function photoUrl(homeId: string, widthPx: (typeof PHOTO_WIDTHS)[number]): string {
  const result = `${import.meta.env.BASE_URL}photos/${homeId}-${widthPx}.webp`;

  return result;
}
