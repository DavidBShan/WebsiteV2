// captions for the photos and videos on /life. this is the only file to edit
// when writing captions - the hover overlay is already wired up.
//
// each key is the file name the photo or video was uploaded with, extension
// included. capitalisation does not matter.
//
//   export const lifeCaptions: Record<string, string> = {
//     "IMG_4821.jpg": "Big Sur, the morning the fog finally lifted",
//     "skate-park.mp4": "First and last time I landed this",
//   };
//
// to fill this in, run `bun run dev` and open /life. a small toolbar under
// the heading says how many photos are captioned and copies a ready-made list
// of every photo, in the order they appear on the page:
//
//   click "Copy caption list", paste it over the block below, then write the
//   captions into the empty strings while looking at the page.
//
// to caption a single photo instead, hover it and click the file name shown
// over the image: that copies just its line, ready to paste. both helpers are
// development-only and never appear on the live site.
//
// IMPORTANT: /life only shows media that has a caption here. a photo left out
// of this list, or given "", is hidden from the gallery entirely - so adding a
// caption is what publishes a photo, and deleting one takes it down.
//
// the dev toolbar counts every photo in the bucket, including hidden ones, so
// it always shows what is left to caption.
export const lifeCaptions: Record<string, string> = {
  "0413 (2)(1).png": "Stargazing at Lake Tahoe",
  "0413 (2)(2).png": "Camping trip at Tahoe",
  "0413 (2).png": "Road trip!!!",
  "0413(1).mov": "Jumping into freezing water in the middle of December",
  "1096.JPG": "Scuba Diving in China",
  "1346.jpg": "Where I was born 🏙",
  "7402.JPG": "My mom took this :)",
  "797061460.295818_58941775368665.MP4": "Wipeout :(",
  "797061964.302904_101111775369169.MP4":
    "Rough first double black of the season",
  "DSC02861.jpg": "Team Picture 1/2",
  "DSC02898.jpg": "Team Picture 2/2",
  "IMG 1038.jpg": "Sanya, China",
  "IMG_0290.jpg": "Clado New York Times Billboard",
  "IMG_0298.jpg": "Sushi 😋",
  "IMG_0326.JPG": "Giants Game ⚾",
  "IMG_0412 2.jpg": "Just starting to learn the guitar",
  "IMG_0424.jpg": "Laver Cup (Thanks, Vercel!)",
  "IMG_0466.jpg": "@ EQX Hudson Yards",
  "IMG_0490.JPG": "Trying Bison at Aspen",
  "IMG_0504.jpg": "Look, Mom, I'm on a New York Times billboard (W Every.io)",
  "IMG_0565.MOV": "Working toward a 225 lb bench press",
  "IMG_0636.JPG": "Fav food 🥘🥘🥘",
  "IMG_0675.jpg": "My Danny Ocean moment",
  "IMG_0680.jpg": "Las Vegas Strip (CES 2026)",
  "IMG_0692.jpg": "Gordon Ramsay's Scallop",
  "IMG_0694.jpg": "The best beef Wellington I've ever had (@ Hell's Kitchen)",
  "IMG_0698.jpg": "In the Eiffel Tower from Walmart",
  "IMG_0699.jpg": "My go-to appetizer",
  "IMG_0783 2.jpg": "UMich",
  "IMG_0831.jpg": "Après-ski meal",
  "IMG_0833.jpg": "Norwegian meal at a French restaurant",
  "IMG_0836.jpg": "Pic I got while dying on the slopes",
  "IMG_0861.jpg": "The one good photo of me that I actually have",
  "IMG_0875.jpg": "Anything for the bulk",
  "IMG_0928.jpg": "Cessna 152 landing at Oakland International Airport",
  "IMG_0931.jpg": "Dollar oysters",
  "IMG_0934.jpg": "First time trying veal",
  "IMG_0948.jpg": "IYKYK",
  "IMG_0973.JPG": "KBBQ @ NYC",
  "IMG_1018.jpg": "The Cirque at Snowbird (Powder Day)",
  "IMG_1020.jpg": "Prom",
  "IMG_1021.jpg": "Senior Camping Trip",
  "IMG_1084.jpg": "Crayfish in Shanghai",
  "IMG_1208.jpg": "WC 2026 Switzerland vs Argentina",
  "IMG_4129 2.jpg": "Tomahawk at Niku Steakhouse",
  "IMG_6476.JPEG": "Freesolo BBQ",
  "IMG_7356.jpeg": "Campsite",
  "IMG_7675.JPEG": "Golden Gate Golf Course",
  "timelapse.MOV": "When you try filming a launch video",
};

const lifeCaptionsByLowerName = new Map(
  Object.entries(lifeCaptions).map(([name, caption]) => [
    name.toLowerCase(),
    caption,
  ]),
);

export function getLifeCaption(name: string) {
  return lifeCaptionsByLowerName.get(name.toLowerCase()) ?? "";
}
