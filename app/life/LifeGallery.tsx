"use client";

import Link from "next/link";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { LifeMedia } from "./getLifeMedia";

const PAGE_SIZE = 12;
const EAGER_MEDIA_COUNT = 8;
const MEDIUM_GALLERY_WIDTH = 768;
const LARGE_GALLERY_WIDTH = 1280;
const GALLERY_COLUMN_KEYS = [
  "life-gallery-column-primary",
  "life-gallery-column-secondary",
  "life-gallery-column-tertiary",
] as const;
const DEFAULT_MEDIA_HEIGHT_RATIO = 0.75;

type MediaLoadStatus = "loading" | "ready" | "error";

type LifeMediaColumnItem = {
  index: number;
  item: LifeMedia;
  mediaKey: string;
};

type LifeMediaColumn = {
  estimatedHeight: number;
  items: LifeMediaColumnItem[];
  key: string;
};

type LifeMediaCardProps = {
  index: number;
  item: LifeMedia;
  mediaKey: string;
  onMeasured: (mediaKey: string, heightRatio: number) => void;
  onSettled: (mediaKey: string) => void;
};

function getMediaKey(item: LifeMedia) {
  return `${item.kind}-${item.src}`;
}

function getMediaHeightRatio(
  item: LifeMedia,
  mediaHeightRatios: Map<string, number>,
) {
  if (item.width && item.height) {
    return item.height / item.width;
  }

  return mediaHeightRatios.get(getMediaKey(item)) ?? DEFAULT_MEDIA_HEIGHT_RATIO;
}

function getMediaSize(item: LifeMedia) {
  if (!item.width || !item.height) {
    return undefined;
  }

  return {
    height: item.height,
    width: item.width,
  };
}

function getMediaAspectRatioStyle(item: LifeMedia): CSSProperties | undefined {
  const size = getMediaSize(item);

  if (!size) {
    return undefined;
  }

  return {
    aspectRatio: `${size.width} / ${size.height}`,
  };
}

function getLifeGalleryColumnCount() {
  if (window.innerWidth >= LARGE_GALLERY_WIDTH) {
    return 3;
  }

  if (window.innerWidth >= MEDIUM_GALLERY_WIDTH) {
    return 2;
  }

  return 1;
}

function getLifeMediaColumns(
  items: LifeMedia[],
  columnCount: number,
  mediaHeightRatios: Map<string, number>,
) {
  const columns: LifeMediaColumn[] = Array.from(
    { length: columnCount },
    (_, columnIndex) => ({
      estimatedHeight: 0,
      items: [],
      key: GALLERY_COLUMN_KEYS[columnIndex] ?? `life-gallery-column-extra`,
    }),
  );

  items.forEach((item, index) => {
    const mediaKey = getMediaKey(item);
    const shortestColumn = columns.reduce((shortest, column) =>
      column.estimatedHeight < shortest.estimatedHeight ? column : shortest,
    );

    shortestColumn.items.push({
      index,
      item,
      mediaKey,
    });
    shortestColumn.estimatedHeight += getMediaHeightRatio(
      item,
      mediaHeightRatios,
    );
  });

  return columns;
}

function useLifeGalleryColumnCount() {
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    const updateColumnCount = () => {
      setColumnCount((currentCount) => {
        const nextCount = getLifeGalleryColumnCount();

        return currentCount === nextCount ? currentCount : nextCount;
      });
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);

    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  return columnCount;
}

function LifePhotoMeta({ index }: { index: number }) {
  return (
    <span className="life-photo-meta">
      <span className="life-photo-index">
        {String(index + 1).padStart(2, "0")}
      </span>
    </span>
  );
}

function getGalleryItemClassName(isReady: boolean, hasKnownSize: boolean) {
  return [
    "life-gallery-item",
    "group",
    !isReady && !hasKnownSize ? "life-gallery-item-loading" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function getPhotoCardClassName(
  isReady: boolean,
  hasKnownSize: boolean,
  extraClassName = "",
) {
  return [
    "life-photo-card",
    extraClassName,
    hasKnownSize ? "has-known-size" : "",
    isReady ? "is-loaded" : "is-loading",
  ]
    .filter(Boolean)
    .join(" ");
}

function LifeImageCard({
  index,
  item,
  mediaKey,
  onMeasured,
  onSettled,
}: LifeMediaCardProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [loadStatus, setLoadStatus] = useState<MediaLoadStatus>("loading");
  const isReady = loadStatus === "ready";
  const isEager = index < EAGER_MEDIA_COUNT;
  const size = getMediaSize(item);
  const mediaStyle = getMediaAspectRatioStyle(item);
  const markReady = useCallback(() => {
    const image = imageRef.current;

    if (image?.naturalWidth && image.naturalHeight) {
      onMeasured(mediaKey, image.naturalHeight / image.naturalWidth);
    }

    setLoadStatus("ready");
    onSettled(mediaKey);
  }, [mediaKey, onMeasured, onSettled]);
  const markError = useCallback(() => {
    setLoadStatus("error");
    onSettled(mediaKey);
  }, [mediaKey, onSettled]);

  useEffect(() => {
    const image = imageRef.current;

    if (!image?.complete) {
      return;
    }

    if (image.naturalWidth > 0) {
      markReady();
      return;
    }

    markError();
  }, [markError, markReady]);

  if (loadStatus === "error") {
    return null;
  }

  return (
    <div className={getGalleryItemClassName(isReady, Boolean(size))}>
      <span
        className={getPhotoCardClassName(isReady, Boolean(size))}
        style={mediaStyle}
      >
        <img
          ref={imageRef}
          src={item.src}
          alt={`Life frame ${index + 1}`}
          className="life-media"
          height={size?.height}
          loading="eager"
          decoding="async"
          fetchPriority={isEager ? "high" : "auto"}
          onLoad={markReady}
          onError={markError}
          width={size?.width}
        />
        {isReady ? <LifePhotoMeta index={index} /> : null}
      </span>
    </div>
  );
}

function LifeVideoCard({
  index,
  item,
  mediaKey,
  onMeasured,
  onSettled,
}: LifeMediaCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadStatus, setLoadStatus] = useState<MediaLoadStatus>("loading");
  const isReady = loadStatus === "ready";
  const size = getMediaSize(item);
  const mediaStyle = getMediaAspectRatioStyle(item);
  const measureVideo = useCallback(() => {
    const video = videoRef.current;

    if (video?.videoWidth && video.videoHeight) {
      onMeasured(mediaKey, video.videoHeight / video.videoWidth);
    }
  }, [mediaKey, onMeasured]);
  const markReady = useCallback(() => {
    measureVideo();
    setLoadStatus("ready");
    onSettled(mediaKey);
  }, [measureVideo, mediaKey, onSettled]);
  const markError = useCallback(() => {
    setLoadStatus("error");
    onSettled(mediaKey);
  }, [mediaKey, onSettled]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return;
    }

    markReady();
  }, [markReady]);

  if (loadStatus === "error") {
    return null;
  }

  return (
    <div className={getGalleryItemClassName(isReady, Boolean(size))}>
      <span
        className={getPhotoCardClassName(
          isReady,
          Boolean(size),
          "life-photo-card-video",
        )}
        style={mediaStyle}
      >
        <video
          ref={videoRef}
          className="life-media life-video-media"
          autoPlay
          height={size?.height}
          loop
          muted
          playsInline
          poster={item.posterSrc}
          preload="auto"
          onCanPlay={markReady}
          onLoadedData={markReady}
          onLoadedMetadata={measureVideo}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onEnded={() => setIsPlaying(false)}
          onError={markError}
          width={size?.width}
        >
          <source src={item.src} />
          <track
            default
            kind="captions"
            label="No captions available"
            src="/empty-captions.vtt"
            srcLang="en"
          />
        </video>
        {isReady ? (
          <button
            type="button"
            className="life-video-control"
            onClick={async () => {
              const video = videoRef.current;

              if (!video) {
                return;
              }

              if (video.paused) {
                try {
                  await video.play();
                } catch {
                  setIsPlaying(false);
                }

                return;
              }

              video.pause();
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        ) : null}
        {isReady ? <LifePhotoMeta index={index} /> : null}
      </span>
    </div>
  );
}

function LifeMediaCard({
  index,
  item,
  mediaKey,
  onMeasured,
  onSettled,
}: LifeMediaCardProps) {
  return item.kind === "video" ? (
    <LifeVideoCard
      index={index}
      item={item}
      mediaKey={mediaKey}
      onMeasured={onMeasured}
      onSettled={onSettled}
    />
  ) : (
    <LifeImageCard
      index={index}
      item={item}
      mediaKey={mediaKey}
      onMeasured={onMeasured}
      onSettled={onSettled}
    />
  );
}

export default function LifeGallery({ media }: { media: LifeMedia[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [settledMediaKeys, setSettledMediaKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [mediaHeightRatios, setMediaHeightRatios] = useState<
    Map<string, number>
  >(() => new Map());
  const columnCount = useLifeGalleryColumnCount();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const visibleMedia = media.slice(0, visibleCount);
  const mediaColumns = getLifeMediaColumns(
    visibleMedia,
    columnCount,
    mediaHeightRatios,
  );
  const hasPendingVisibleMedia = visibleMedia.some(
    (item) => !settledMediaKeys.has(getMediaKey(item)),
  );
  const markMediaMeasured = useCallback(
    (mediaKey: string, heightRatio: number) => {
      if (!Number.isFinite(heightRatio) || heightRatio <= 0) {
        return;
      }

      setMediaHeightRatios((currentRatios) => {
        const currentRatio = currentRatios.get(mediaKey);

        if (
          typeof currentRatio === "number" &&
          Math.abs(currentRatio - heightRatio) < 0.001
        ) {
          return currentRatios;
        }

        const nextRatios = new Map(currentRatios);
        nextRatios.set(mediaKey, heightRatio);
        return nextRatios;
      });
    },
    [],
  );
  const markMediaSettled = useCallback((mediaKey: string) => {
    setSettledMediaKeys((currentKeys) => {
      if (currentKeys.has(mediaKey)) {
        return currentKeys;
      }

      const nextKeys = new Set(currentKeys);
      nextKeys.add(mediaKey);
      return nextKeys;
    });
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = savedTheme ? savedTheme === "dark" : false;

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (
      !sentinelRef.current ||
      visibleCount >= media.length ||
      hasPendingVisibleMedia
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry?.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + PAGE_SIZE, media.length),
          );
        }
      },
      {
        rootMargin: "1200px 0px",
      },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasPendingVisibleMedia, media.length, visibleCount]);

  const textColor = "var(--color-text)";
  const headingColor = "var(--color-heading)";
  const mutedColor = "var(--color-muted)";

  return (
    <main
      className="min-h-screen flex justify-center overflow-x-hidden"
      style={{
        paddingTop: "30px",
        paddingBottom: "30px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <div className="max-w-7xl w-full">
        <div className="flex flex-col gap-6">
          <div className="animate-fade-in delay-0">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm hover-link"
              style={{ color: textColor, marginBottom: "0.85rem" }}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back
            </Link>

            <h1
              className="text-3xl sm:text-4xl font-black"
              style={{ color: headingColor }}
            >
              Life
            </h1>
          </div>

          {media.length > 0 ? (
            <section className="animate-fade-in delay-400">
              <div
                className="life-gallery-columns"
                style={{
                  gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                }}
              >
                {mediaColumns.map((column) => (
                  <div className="life-gallery-column" key={column.key}>
                    {column.items.map(({ index, item, mediaKey }) => (
                      <LifeMediaCard
                        index={index}
                        item={item}
                        key={mediaKey}
                        mediaKey={mediaKey}
                        onMeasured={markMediaMeasured}
                        onSettled={markMediaSettled}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div ref={sentinelRef} aria-hidden="true" />
            </section>
          ) : (
            <p
              className="animate-fade-in delay-400 text-sm"
              style={{ color: mutedColor }}
            >
              No life media found yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
