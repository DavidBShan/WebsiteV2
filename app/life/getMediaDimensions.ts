// the gallery packs media into columns by height, so it needs each item's
// aspect ratio before it renders. blob listings do not carry dimensions, so
// they are read here, at build time, from the first bytes of each file.
//
// images: image-size parses the header of every format the gallery accepts.
// videos: the mp4/quicktime `tkhd` box carries the track dimensions and the
// display matrix, so portrait clips written as rotated landscape are reported
// the way they actually render.

import { imageSize } from "image-size";

export type MediaDimensions = {
  height: number;
  width: number;
};

// enough for every image header the gallery has met, and for the box walk to
// find `moov` without pulling whole videos across the network.
const IMAGE_HEADER_BYTES = 64 * 1024;
const BOX_HEADER_BYTES = 16;
const MAX_TOP_LEVEL_BOXES = 64;
const MAX_MOOV_BYTES = 4 * 1024 * 1024;

// exif orientations 5-8 turn the image a quarter turn, so the stored width and
// height describe the file rather than the picture the browser paints.
const EXIF_ORIENTATION_QUARTER_TURN = 5;

const FIXED_POINT_DIVISOR = 65536;
const CONTAINER_BOX_TYPES = new Set(["moov", "trak", "mdia"]);

async function fetchRange(src: string, start: number, end: number) {
  const response = await fetch(src, {
    headers: { Range: `bytes=${start}-${end}` },
  });

  if (!response.ok) {
    throw new Error(`range request failed with ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function readImageDimensions(src: string) {
  const header = await fetchRange(src, 0, IMAGE_HEADER_BYTES - 1);
  const { height, orientation, width } = imageSize(header);

  if (!width || !height) {
    return undefined;
  }

  return orientation && orientation >= EXIF_ORIENTATION_QUARTER_TURN
    ? { height: width, width: height }
    : { height, width };
}

type BoxHeader = {
  contentStart: number;
  size: number;
  type: string;
};

function readBoxHeader(buffer: Buffer, offset: number): BoxHeader | undefined {
  if (offset + 8 > buffer.length) {
    return undefined;
  }

  const declaredSize = buffer.readUInt32BE(offset);
  const type = buffer.toString("latin1", offset + 4, offset + 8);

  // size 1 means the real size is a 64-bit value in the eight bytes that follow.
  if (declaredSize === 1) {
    if (offset + 16 > buffer.length) {
      return undefined;
    }

    return {
      contentStart: offset + 16,
      size: Number(buffer.readBigUInt64BE(offset + 8)),
      type,
    };
  }

  return { contentStart: offset + 8, size: declaredSize, type };
}

// `tkhd` holds the display matrix followed by the track's width and height, all
// as 16.16 fixed point. a quarter-turn matrix means the track is stored rotated.
function readTrackDimensions(
  buffer: Buffer,
  boxStart: number,
): MediaDimensions | undefined {
  const version = buffer[boxStart + 8];
  const timestampBytes = version === 1 ? 32 : 20;
  // size and type (8) + version and flags (4) + timestamps + reserved (8)
  // + layer, alternate group, volume and reserved (8)
  const matrixStart = boxStart + 8 + 4 + timestampBytes + 8 + 8;

  if (matrixStart + 44 > buffer.length) {
    return undefined;
  }

  const width = buffer.readUInt32BE(matrixStart + 36) / FIXED_POINT_DIVISOR;
  const height = buffer.readUInt32BE(matrixStart + 40) / FIXED_POINT_DIVISOR;

  if (width < 1 || height < 1) {
    return undefined;
  }

  const rotationCosine = buffer.readInt32BE(matrixStart) / FIXED_POINT_DIVISOR;
  const rotationSine =
    buffer.readInt32BE(matrixStart + 4) / FIXED_POINT_DIVISOR;
  const isQuarterTurn =
    Math.abs(rotationCosine) < 0.01 && Math.abs(rotationSine) > 0.5;

  return isQuarterTurn ? { height: width, width: height } : { height, width };
}

function findTrackDimensions(
  buffer: Buffer,
  start: number,
  end: number,
): MediaDimensions | undefined {
  let offset = start;

  while (offset + 8 <= end) {
    const box = readBoxHeader(buffer, offset);

    if (!box) {
      return undefined;
    }

    const size = box.size === 0 ? end - offset : box.size;

    if (size < box.contentStart - offset || offset + size > end) {
      return undefined;
    }

    if (box.type === "tkhd") {
      const dimensions = readTrackDimensions(buffer, offset);

      if (dimensions) {
        return dimensions;
      }
    }

    if (CONTAINER_BOX_TYPES.has(box.type)) {
      const dimensions = findTrackDimensions(
        buffer,
        box.contentStart,
        offset + size,
      );

      if (dimensions) {
        return dimensions;
      }
    }

    offset += size;
  }

  return undefined;
}

// phone cameras write `moov` after the media data, so its offset is found by
// stepping over the top-level boxes, reading only each box header.
async function readVideoDimensions(src: string) {
  const probe = await fetch(src, { headers: { Range: "bytes=0-1" } });
  const totalBytes = Number(
    probe.headers.get("content-range")?.split("/")[1] ?? "",
  );

  if (!Number.isFinite(totalBytes) || totalBytes <= 0) {
    return undefined;
  }

  let offset = 0;

  for (let boxIndex = 0; boxIndex < MAX_TOP_LEVEL_BOXES; boxIndex += 1) {
    if (offset >= totalBytes) {
      return undefined;
    }

    const header = await fetchRange(
      src,
      offset,
      Math.min(offset + BOX_HEADER_BYTES - 1, totalBytes - 1),
    );
    const box = readBoxHeader(header, 0);

    if (!box) {
      return undefined;
    }

    const size = box.size === 0 ? totalBytes - offset : box.size;

    if (size < 8) {
      return undefined;
    }

    if (box.type === "moov") {
      if (size > MAX_MOOV_BYTES) {
        return undefined;
      }

      const moov = await fetchRange(src, offset, offset + size - 1);

      // `box` was read from a header-sized buffer, so contentStart is already
      // the offset of the first child within the box itself.
      return findTrackDimensions(moov, box.contentStart, moov.length);
    }

    offset += size;
  }

  return undefined;
}

// a failed probe is not worth failing a build over: the gallery falls back to
// its default ratio, which is what it used for every item before this existed.
export async function getMediaDimensions(
  src: string,
  kind: "image" | "video",
): Promise<MediaDimensions | undefined> {
  try {
    return kind === "video"
      ? await readVideoDimensions(src)
      : await readImageDimensions(src);
  } catch {
    return undefined;
  }
}
