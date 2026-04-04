import fs from "node:fs";
import path from "node:path";

export type LifeMedia = {
  kind: "image" | "video";
  name: string;
  posterSrc?: string;
  src: string;
};

const LIFE_DIR = path.join(process.cwd(), "public", "life-images");

const imageExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);
const heicExtensions = new Set([".heic", ".heif"]);
const videoExtensions = new Set([".m4v", ".mov", ".mp4", ".webm"]);
const preferredVideoExtensions = [".mp4", ".m4v", ".mov", ".webm"];

const compareNames = (left: string, right: string) =>
  left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: "base",
  });

const encodePublicPath = (...parts: string[]) =>
  `/${parts.map((part) => encodeURIComponent(part)).join("/")}`;

const isFile = (directory: string, fileName: string) =>
  fs.existsSync(path.join(directory, fileName)) &&
  fs.statSync(path.join(directory, fileName)).isFile();

const stripExtension = (fileName: string) => fileName.replace(/\.[^.]+$/, "");

const toSlug = (fileName: string) =>
  stripExtension(fileName).toLowerCase().replaceAll(" ", "-");

export function getLifeMedia(): LifeMedia[] {
  const files = fs
    .readdirSync(LIFE_DIR)
    .filter((fileName) => isFile(LIFE_DIR, fileName))
    .sort(compareNames);

  const lookup = new Map(
    files.map((fileName) => [fileName.toLowerCase(), fileName]),
  );
  const seenVideoSlugs = new Set<string>();
  const media: LifeMedia[] = [];

  for (const fileName of files) {
    const lowerName = fileName.toLowerCase();
    const extension = path.extname(lowerName);

    if (lowerName.endsWith("-poster.jpg") || heicExtensions.has(extension)) {
      continue;
    }

    if (imageExtensions.has(extension)) {
      media.push({
        kind: "image",
        name: fileName,
        src: encodePublicPath("life-images", fileName),
      });
      continue;
    }

    if (!videoExtensions.has(extension)) {
      continue;
    }

    const slug = toSlug(fileName);

    if (seenVideoSlugs.has(slug)) {
      continue;
    }

    const preferredName =
      preferredVideoExtensions
        .map((candidateExtension) => lookup.get(`${slug}${candidateExtension}`))
        .find(Boolean) ?? fileName;

    if (preferredName !== fileName) {
      continue;
    }

    seenVideoSlugs.add(slug);

    const posterName = lookup.get(`${slug}-poster.jpg`);
    const originalName =
      lookup.get(`${slug}.mov`) ??
      lookup.get(`${slug}.mp4`) ??
      lookup.get(`${slug}.m4v`) ??
      lookup.get(`${slug}.webm`) ??
      fileName;

    media.push({
      kind: "video",
      name: originalName,
      posterSrc: posterName
        ? encodePublicPath("life-images", posterName)
        : undefined,
      src: encodePublicPath("life-images", preferredName),
    });
  }

  return media;
}
