import { list } from "@vercel/blob";

export type LifeMedia = {
  kind: "image" | "video";
  name: string;
  posterSrc?: string;
  src: string;
};

type MediaFile = {
  name: string;
  src: string;
};

const LIFE_PREFIX = "life-images/";

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

const stripExtension = (fileName: string) => fileName.replace(/\.[^.]+$/, "");
const stripBlobSuffix = (fileName: string) =>
  fileName.replace(/-[A-Za-z0-9]{20,}(?=\.[^.]+$)/, "");

const toSlug = (fileName: string) =>
  stripExtension(fileName).toLowerCase().replaceAll(" ", "-");

const shapeMedia = (files: MediaFile[]) => {
  const lookup = new Map(files.map((file) => [file.name.toLowerCase(), file]));
  const seenVideoSlugs = new Set<string>();
  const media: LifeMedia[] = [];

  for (const file of files) {
    const lowerName = file.name.toLowerCase();
    const extension = lowerName.match(/\.[^.]+$/)?.[0] ?? "";

    if (lowerName.endsWith("-poster.jpg") || heicExtensions.has(extension)) {
      continue;
    }

    if (imageExtensions.has(extension)) {
      media.push({
        kind: "image",
        name: file.name,
        src: file.src,
      });
      continue;
    }

    if (!videoExtensions.has(extension)) {
      continue;
    }

    const slug = toSlug(file.name);

    if (seenVideoSlugs.has(slug)) {
      continue;
    }

    const preferredFile =
      preferredVideoExtensions
        .map((candidateExtension) => lookup.get(`${slug}${candidateExtension}`))
        .find(Boolean) ?? file;

    if (preferredFile.name !== file.name) {
      continue;
    }

    seenVideoSlugs.add(slug);

    const posterFile = lookup.get(`${slug}-poster.jpg`);
    const originalName =
      lookup.get(`${slug}.mov`)?.name ??
      lookup.get(`${slug}.mp4`)?.name ??
      lookup.get(`${slug}.m4v`)?.name ??
      lookup.get(`${slug}.webm`)?.name ??
      file.name;

    media.push({
      kind: "video",
      name: originalName,
      posterSrc: posterFile?.src,
      src: preferredFile.src,
    });
  }

  return media;
};

export async function getLifeMedia(): Promise<LifeMedia[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return [];
  }

  const files: MediaFile[] = [];
  let cursor: string | undefined;

  do {
    const response = await list({
      cursor,
      limit: 1000,
      prefix: LIFE_PREFIX,
    });

    files.push(
      ...response.blobs.map((blob) => ({
        name: stripBlobSuffix(blob.pathname.slice(LIFE_PREFIX.length)),
        src: blob.url,
      })),
    );

    cursor = response.hasMore ? response.cursor : undefined;
  } while (cursor);

  return shapeMedia(
    files
      .filter((file) => file.name.length > 0)
      .sort((left, right) => compareNames(left.name, right.name)),
  );
}
