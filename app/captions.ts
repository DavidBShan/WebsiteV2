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
// a photo left out of this list, or given "", simply has no caption: it
// hovers exactly as it did before. so captions can be filled in a few at a
// time without anything looking half-finished.
export const lifeCaptions: Record<string, string> = {};

const lifeCaptionsByLowerName = new Map(
  Object.entries(lifeCaptions).map(([name, caption]) => [
    name.toLowerCase(),
    caption,
  ]),
);

export function getLifeCaption(name: string) {
  return lifeCaptionsByLowerName.get(name.toLowerCase()) ?? "";
}
