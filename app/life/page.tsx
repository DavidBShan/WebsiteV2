import type { Metadata } from "next";
import { getLifeCaption } from "../captions";
import { getLifeMedia } from "./getLifeMedia";
import LifeGallery from "./LifeGallery";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Life",
};

export default async function LifePage() {
  // a caption is what publishes a photo: uncaptioned media is dropped here, so
  // it is never named in the payload, let alone rendered. what survives keeps
  // the stable order getLifeMedia returns, so the gallery fills top to bottom
  // instead of reshuffling on every build.
  const allMedia = await getLifeMedia();
  const media = allMedia.filter((item) => getLifeCaption(item.name) !== "");

  // the development caption toolbar counts the uncaptioned photos too, or it
  // reports everything captioned and hides the work that is left. production
  // gets no such prop, keeping hidden file names out of the shipped html.
  return (
    <LifeGallery
      allMedia={process.env.NODE_ENV === "production" ? undefined : allMedia}
      media={media}
    />
  );
}
