import type { Metadata } from "next";
import { getLifeMedia } from "./getLifeMedia";
import LifeGallery from "./LifeGallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Life",
};

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
};

export default async function LifePage() {
  return <LifeGallery media={shuffle(await getLifeMedia())} />;
}
