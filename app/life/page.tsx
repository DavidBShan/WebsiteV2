import { getLifeMedia } from "./getLifeMedia";
import LifeGallery from "./LifeGallery";

export default function LifePage() {
  return <LifeGallery media={getLifeMedia()} />;
}
