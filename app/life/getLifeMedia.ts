import { list } from "@vercel/blob";
import { imageSize } from "image-size";

export type LifeMedia = {
  height?: number;
  kind: "image" | "video";
  name: string;
  posterSrc?: string;
  src: string;
  width?: number;
};

type MediaFile = {
  name: string;
  src: string;
};

type MediaDimensions = {
  height: number;
  width: number;
};

const LIFE_PREFIX = "life-images/";
const IMAGE_DIMENSION_RANGE_BYTES = 1024 * 1024;
const MEDIA_DIMENSION_CONCURRENCY = 8;

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

const mediaDimensionsCache = new Map<
  string,
  Promise<MediaDimensions | undefined>
>();

const normalizeDimensions = ({
  height,
  orientation,
  width,
}: {
  height?: number;
  orientation?: number;
  width?: number;
}): MediaDimensions | undefined => {
  if (!height || !width) {
    return undefined;
  }

  if (orientation && orientation >= 5 && orientation <= 8) {
    return {
      height: width,
      width: height,
    };
  }

  return {
    height,
    width,
  };
};

const fetchImageBytes = async (src: string, rangeBytes?: number) => {
  const response = await fetch(src, {
    cache: "force-cache",
    headers:
      typeof rangeBytes === "number"
        ? {
            Range: `bytes=0-${rangeBytes - 1}`,
          }
        : undefined,
  });

  if (!response.ok) {
    return undefined;
  }

  return new Uint8Array(await response.arrayBuffer());
};

const readImageDimensions = async (src: string) => {
  const partialBytes = await fetchImageBytes(src, IMAGE_DIMENSION_RANGE_BYTES);

  if (partialBytes) {
    try {
      return normalizeDimensions(imageSize(partialBytes));
    } catch {
      // Some formats need more than the first range, so fall through.
    }
  }

  const fullBytes = await fetchImageBytes(src);

  if (!fullBytes) {
    return undefined;
  }

  try {
    return normalizeDimensions(imageSize(fullBytes));
  } catch {
    return undefined;
  }
};

const getImageDimensions = (src: string) => {
  const cachedDimensions = mediaDimensionsCache.get(src);

  if (cachedDimensions) {
    return cachedDimensions;
  }

  const dimensionsPromise = readImageDimensions(src);
  mediaDimensionsCache.set(src, dimensionsPromise);
  return dimensionsPromise;
};

const mapWithConcurrency = async <T, U>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<U>,
) => {
  const results: U[] = [];
  let nextIndex = 0;

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const itemIndex = nextIndex;
        nextIndex += 1;
        results[itemIndex] = await mapper(items[itemIndex], itemIndex);
      }
    },
  );

  await Promise.all(workers);
  return results;
};

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

const addMediaDimensions = (media: LifeMedia[]) =>
  mapWithConcurrency(media, MEDIA_DIMENSION_CONCURRENCY, async (item) => {
    const dimensionsSrc =
      item.kind === "video" && item.posterSrc ? item.posterSrc : item.src;

    if (item.kind === "video" && !item.posterSrc) {
      return item;
    }

    const dimensions = await getImageDimensions(dimensionsSrc);

    if (!dimensions) {
      return item;
    }

    return {
      ...item,
      height: dimensions.height,
      width: dimensions.width,
    };
  });

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

  return addMediaDimensions(
    shapeMedia(
      files
        .filter((file) => file.name.length > 0)
        .sort((left, right) => compareNames(left.name, right.name)),
    ),
  );
}
