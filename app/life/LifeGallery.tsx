"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LifeMedia } from "./getLifeMedia";

const PAGE_SIZE = 12;
const getColumnCount = (width: number) => {
  if (width >= 1280) {
    return 3;
  }

  if (width >= 768) {
    return 2;
  }

  return 1;
};

export default function LifeGallery({ media }: { media: LifeMedia[] }) {
  const [columnCount, setColumnCount] = useState(1);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
    const syncColumns = () => setColumnCount(getColumnCount(window.innerWidth));

    syncColumns();
    window.addEventListener("resize", syncColumns);

    return () => window.removeEventListener("resize", syncColumns);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current || visibleCount >= media.length) {
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
  }, [media.length, visibleCount]);

  const visibleMedia = media.slice(0, visibleCount);
  const mediaChunks = Array.from(
    { length: Math.ceil(visibleMedia.length / PAGE_SIZE) },
    (_, chunkIndex) =>
      visibleMedia.slice(chunkIndex * PAGE_SIZE, (chunkIndex + 1) * PAGE_SIZE),
  );
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
              <div className="life-gallery-stack">
                {mediaChunks.map((chunk, chunkIndex) => (
                  <div
                    key={chunk[0]?.src ?? `chunk-empty-${chunkIndex}`}
                    className="life-gallery-columns"
                  >
                    {Array.from({ length: columnCount }, (_, columnIndex) =>
                      chunk.slice(
                        columnIndex * Math.ceil(chunk.length / columnCount),
                        (columnIndex + 1) *
                          Math.ceil(chunk.length / columnCount),
                      ),
                    ).map((column, columnIndex) => (
                      <div
                        key={`${chunk[0]?.src ?? "chunk"}-column-${columnIndex}`}
                        className="life-gallery-column"
                      >
                        {column.map((item, index) => {
                          const absoluteIndex =
                            chunkIndex * PAGE_SIZE +
                            columnIndex *
                              Math.ceil(chunk.length / columnCount) +
                            index;

                          return (
                            <div
                              key={`${item.kind}-${item.src}`}
                              className="life-gallery-item group"
                            >
                              <span
                                className={`life-photo-card ${
                                  item.kind === "video"
                                    ? "life-photo-card-video"
                                    : ""
                                }`}
                              >
                                {item.kind === "video" ? (
                                  <video
                                    className="life-media pointer-events-none"
                                    muted
                                    playsInline
                                    poster={item.posterSrc}
                                    preload="none"
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
                                ) : (
                                  <img
                                    src={item.src}
                                    alt={`Life frame ${absoluteIndex + 1}`}
                                    className="life-media"
                                    loading={
                                      absoluteIndex < 8 ? "eager" : "lazy"
                                    }
                                  />
                                )}
                                <span className="life-photo-meta">
                                  <span className="life-photo-index">
                                    {String(absoluteIndex + 1).padStart(2, "0")}
                                  </span>
                                </span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {visibleCount < media.length ? (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="rounded-full border px-4 py-2 text-sm hover-link"
                    style={{
                      borderColor: "var(--color-border)",
                      color: textColor,
                    }}
                    onClick={() =>
                      setVisibleCount((current) =>
                        Math.min(current + PAGE_SIZE, media.length),
                      )
                    }
                  >
                    Load more
                  </button>
                </div>
              ) : null}

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
