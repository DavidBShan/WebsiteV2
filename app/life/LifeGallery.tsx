"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LifeMedia } from "./getLifeMedia";

const PAGE_SIZE = 12;

export default function LifeGallery({ media }: { media: LifeMedia[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
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

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null
            ? current
            : (current - 1 + media.length) % media.length,
        );
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? current : (current + 1) % media.length,
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [media.length, selectedIndex]);

  const selectedMedia = selectedIndex === null ? null : media[selectedIndex];
  const selectedFrame = selectedIndex === null ? null : selectedIndex + 1;
  const visibleMedia = media.slice(0, visibleCount);
  const mediaChunks = Array.from(
    { length: Math.ceil(visibleMedia.length / PAGE_SIZE) },
    (_, chunkIndex) =>
      visibleMedia.slice(chunkIndex * PAGE_SIZE, (chunkIndex + 1) * PAGE_SIZE),
  );
  const textColor = "var(--color-text)";
  const headingColor = "var(--color-heading)";
  const mutedColor = "var(--color-muted)";
  const borderColor = "var(--color-border)";

  return (
    <>
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
                      {chunk.map((item, index) => {
                        const absoluteIndex = chunkIndex * PAGE_SIZE + index;

                        return (
                          <button
                            key={`${item.kind}-${item.src}`}
                            type="button"
                            className="life-gallery-item group w-full text-left"
                            onClick={() => setSelectedIndex(absoluteIndex)}
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
                                  className="life-media"
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
                                  loading={absoluteIndex < 8 ? "eager" : "lazy"}
                                />
                              )}
                              <span className="life-photo-meta">
                                <span className="life-photo-index">
                                  {String(absoluteIndex + 1).padStart(2, "0")}
                                </span>
                              </span>
                            </span>
                          </button>
                        );
                      })}
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

      {selectedMedia && selectedFrame ? (
        <div
          className="fixed inset-0 z-50 life-lightbox-shell px-4 py-4 sm:px-8 sm:py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Life frame ${selectedFrame}`}
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close viewer"
            onClick={() => setSelectedIndex(null)}
          />

          <div className="relative z-10 mx-auto flex h-full max-w-[96rem] items-center gap-3 sm:gap-5">
            <button
              type="button"
              className="life-lightbox-button hidden sm:inline-flex"
              aria-label="Previous item"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIndex(
                  (selectedFrame - 2 + media.length) % media.length,
                );
              }}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className="w-full">
              <div
                className="life-lightbox-panel"
                style={{ border: `1px solid ${borderColor}` }}
              >
                <div className="life-lightbox-header">
                  <div className="min-w-0 flex-1">
                    <div className="life-lightbox-kicker">
                      Frame {String(selectedFrame).padStart(2, "0")}
                    </div>
                    <div className="life-lightbox-title">Life archive</div>
                  </div>

                  <button
                    type="button"
                    className="life-lightbox-button"
                    aria-label="Close viewer"
                    onClick={() => setSelectedIndex(null)}
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div className="life-lightbox-stage">
                  {selectedMedia.kind === "video" ? (
                    <video
                      autoPlay
                      className="life-lightbox-media"
                      controls
                      playsInline
                      poster={selectedMedia.posterSrc}
                    >
                      <source src={selectedMedia.src} />
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
                      src={selectedMedia.src}
                      alt={`Life frame ${selectedFrame}`}
                      className="life-lightbox-media"
                    />
                  )}
                </div>

                <div className="life-lightbox-footer sm:hidden">
                  <button
                    type="button"
                    className="life-lightbox-inline-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedIndex(
                        (selectedFrame - 2 + media.length) % media.length,
                      );
                    }}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="life-lightbox-inline-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedIndex(selectedFrame % media.length);
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="life-lightbox-button hidden sm:inline-flex"
              aria-label="Next item"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIndex(selectedFrame % media.length);
              }}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
