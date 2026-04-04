"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LifeMedia } from "./getLifeMedia";

export default function LifeGallery({ media }: { media: LifeMedia[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
                <div className="life-gallery-columns">
                  {media.map((item, index) => (
                    <button
                      key={`${item.kind}-${item.src}`}
                      type="button"
                      className="life-gallery-item group w-full text-left"
                      onClick={() => setSelectedIndex(index)}
                    >
                      <span
                        className={`life-photo-card ${
                          item.kind === "video" ? "life-photo-card-video" : ""
                        }`}
                      >
                        {item.kind === "video" ? (
                          <video
                            className="life-media"
                            muted
                            playsInline
                            poster={item.posterSrc}
                            preload="metadata"
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
                            alt={item.name}
                            className="life-media"
                            loading={index < 8 ? "eager" : "lazy"}
                          />
                        )}
                        <span className="life-photo-meta">
                          <span className="life-photo-index">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="life-photo-name">{item.name}</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm px-4 py-6 sm:px-8"
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

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center gap-3 sm:gap-6">
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
                className="rounded-[28px] overflow-hidden"
                style={{
                  backgroundColor: "rgba(10, 10, 10, 0.45)",
                  border: `1px solid ${borderColor}`,
                }}
              >
                <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <div
                      className="text-xs font-mono"
                      style={{ color: mutedColor, marginBottom: "0.2rem" }}
                    >
                      Frame {String(selectedFrame).padStart(2, "0")}
                    </div>
                    <div
                      className="text-sm sm:text-base truncate"
                      style={{ color: "#f3f4f6" }}
                    >
                      {selectedMedia.name}
                    </div>
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

                <div className="px-3 pb-3 sm:px-5 sm:pb-5">
                  {selectedMedia.kind === "video" ? (
                    <video
                      autoPlay
                      className="block mx-auto max-h-[78vh] w-auto max-w-full rounded-[20px]"
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
                      alt={selectedMedia.name}
                      className="block mx-auto max-h-[78vh] w-auto max-w-full rounded-[20px]"
                    />
                  )}
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
