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
// to find a file name, run `bun run dev` and hover a photo on /life: any
// photo without a caption shows its file name over the image while in
// development. that name is the key to paste here.
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
