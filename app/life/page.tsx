import { getLifeMedia } from "./getLifeMedia";
import LifeGallery from "./LifeGallery";

export default async function LifePage() {
  return <LifeGallery media={await getLifeMedia()} />;
}
