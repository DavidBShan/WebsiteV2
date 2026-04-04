import fs from "node:fs";
import path from "node:path";

export type LifeMedia = {
  kind: "image" | "video";
  name: string;
  posterSrc?: string;
  src: string;
};

const LIFE_DIR = path.join(process.cwd(), "public", "life-images");
const LIFE_WEB_DIR = path.join(LIFE_DIR, "web");

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

const getPreferredVideoFile = (
  slug: string,
  webLookup: Map<string, string>,
): string | null => {
  const candidates = [".mp4", ".m4v", ".mov", ".webm"];

  for (const extension of candidates) {
    const match = webLookup.get(`${slug}${extension}`);
    if (match) {
      return match;
    }
  }

  return null;
};

const getDisplayVideoName = (
  slug: string,
  chosenName: string,
  webLookup: Map<string, string>,
) =>
  webLookup.get(`${slug}.mov`) ??
  webLookup.get(`${slug}.mp4`) ??
  webLookup.get(`${slug}.m4v`) ??
  webLookup.get(`${slug}.webm`) ??
  chosenName;

export function getLifeMedia(): LifeMedia[] {
  const rootFiles = fs
    .readdirSync(LIFE_DIR)
    .filter((fileName) => fileName !== "web" && isFile(LIFE_DIR, fileName))
    .sort(compareNames);
  const webFiles = fs.existsSync(LIFE_WEB_DIR)
    ? fs
        .readdirSync(LIFE_WEB_DIR)
        .filter((fileName) => isFile(LIFE_WEB_DIR, fileName))
        .sort(compareNames)
    : [];

  const rootSlugs = new Set(rootFiles.map(toSlug));
  const webLookup = new Map(
    webFiles.map((fileName) => [fileName.toLowerCase(), fileName]),
  );
  const media: LifeMedia[] = [];

  for (const fileName of rootFiles) {
    const extension = path.extname(fileName).toLowerCase();

    if (heicExtensions.has(extension)) {
      const convertedName = `${toSlug(fileName)}.jpg`;

      if (isFile(LIFE_WEB_DIR, convertedName)) {
        media.push({
          kind: "image",
          name: fileName,
          src: encodePublicPath("life-images", "web", convertedName),
        });
      }

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

    if (videoExtensions.has(extension)) {
      const slug = toSlug(fileName);
      const preferredName = getPreferredVideoFile(slug, webLookup) ?? fileName;
      const posterName = webLookup.get(`${slug}-poster.jpg`);

      media.push({
        kind: "video",
        name: fileName,
        posterSrc: posterName
          ? encodePublicPath("life-images", "web", posterName)
          : undefined,
        src:
          preferredName === fileName
            ? encodePublicPath("life-images", fileName)
            : encodePublicPath("life-images", "web", preferredName),
      });
    }
  }

  for (const fileName of webFiles) {
    const lowerName = fileName.toLowerCase();

    if (lowerName.endsWith("-poster.jpg")) {
      continue;
    }

    const extension = path.extname(lowerName);
    const slug = toSlug(fileName);

    if (rootSlugs.has(slug)) {
      continue;
    }

    if (imageExtensions.has(extension)) {
      media.push({
        kind: "image",
        name: fileName,
        src: encodePublicPath("life-images", "web", fileName),
      });
      continue;
    }

    if (videoExtensions.has(extension)) {
      const preferredName = getPreferredVideoFile(slug, webLookup);

      if (!preferredName || preferredName !== fileName) {
        continue;
      }

      const posterName = webLookup.get(`${slug}-poster.jpg`);

      media.push({
        kind: "video",
        name: getDisplayVideoName(slug, fileName, webLookup),
        posterSrc: posterName
          ? encodePublicPath("life-images", "web", posterName)
          : undefined,
        src: encodePublicPath("life-images", "web", preferredName),
      });
    }
  }

  return media;
}
