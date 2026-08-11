// every image caption on the site lives here. this is the only file to edit
// when writing captions - the hover overlay is already wired up.
//
// a caption left as "" means that image simply has no caption: no hover
// overlay, nothing to see. so it is safe to fill these in one at a time.

// images in the "building sota people search" writeup, in the order they
// appear on the page.
export const writingCaptions = {
  mvp: "",
  databaseAgent: "",
  dataPipeline: "",
  mysqlIngestion: "",
  embeddings: "",
  embeddingsArchitecture: "",
  conclusion: "",
} satisfies Record<string, string>;

// captions for the /life gallery, keyed by the file name the photo or video
// was uploaded with, extension included. matching ignores capitalisation.
//
//   export const lifeCaptions: Record<string, string> = {
//     "IMG_4821.jpg": "Big Sur, the morning the fog finally lifted",
//     "skate-park.mp4": "First and last time I landed this",
//   };
//
// to find a file name, run the site locally and hover the photo: any photo
// without a caption yet shows its file name in the hover overlay while in
// development. that name is the key to paste here.
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
