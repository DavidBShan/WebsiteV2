"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { lifeImages } from "./life-images";

const verticalCount = lifeImages.filter(
  (image) => image.height > image.width,
).length;
const wideCount = lifeImages.length - verticalCount;

export default function Life() {
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
            : (current - 1 + lifeImages.length) % lifeImages.length,
        );
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? current : (current + 1) % lifeImages.length,
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
  }, [selectedIndex]);

  const selectedImage =
    selectedIndex === null ? null : lifeImages[selectedIndex];
  const selectedFrame = selectedIndex === null ? null : selectedIndex + 1;
  const textColor = "var(--color-text)";
  const headingColor = "var(--color-heading)";
  const subheadingColor = "var(--color-subheading)";
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
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm hover-link animate-fade-in delay-0"
              style={{ color: textColor }}
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

            <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-8 lg:gap-12">
              <aside className="animate-fade-in delay-0 lg:sticky lg:top-8 h-fit">
                <div
                  className="inline-flex items-center gap-2 text-xs font-mono"
                  style={{
                    color: mutedColor,
                    marginBottom: "0.85rem",
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: subheadingColor }}
                    ></span>
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: subheadingColor }}
                    ></span>
                  </span>
                  Photo archive
                </div>

                <h1
                  className="text-3xl sm:text-4xl font-black"
                  style={{ color: headingColor, marginBottom: "1rem" }}
                >
                  Life
                </h1>

                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: textColor, marginBottom: "1.5rem" }}
                >
                  A running gallery of moments, places, and small things worth
                  keeping around.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:max-w-lg lg:grid-cols-1 lg:max-w-none">
                  <div className="life-stat-card">
                    <div className="life-stat-value">{lifeImages.length}</div>
                    <div className="life-stat-label">Frames</div>
                    <p className="life-stat-note">
                      One place for the full set.
                    </p>
                  </div>
                  <div className="life-stat-card">
                    <div className="life-stat-value">{wideCount}</div>
                    <div className="life-stat-label">Wide</div>
                    <p className="life-stat-note">
                      Landscapes, scenes, and group shots.
                    </p>
                  </div>
                  <div className="life-stat-card">
                    <div className="life-stat-value">{verticalCount}</div>
                    <div className="life-stat-label">Tall</div>
                    <p className="life-stat-note">
                      Portrait frames and phone captures.
                    </p>
                  </div>
                  <div className="life-stat-card">
                    <div className="life-stat-value">5 MB</div>
                    <div className="life-stat-label">Web Copy</div>
                    <p className="life-stat-note">
                      Optimized from the original archive.
                    </p>
                  </div>
                </div>

                <div
                  className="text-xs sm:text-sm"
                  style={{
                    color: mutedColor,
                    marginTop: "1rem",
                    lineHeight: 1.7,
                  }}
                >
                  Click any frame to view it larger. The originals still live in{" "}
                  <code>/public/life-images</code>.
                </div>
              </aside>

              <section className="animate-fade-in delay-400">
                <div className="life-gallery-columns">
                  {lifeImages.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      className="life-gallery-item group w-full text-left"
                      onClick={() => setSelectedIndex(index)}
                    >
                      <span className="life-photo-card">
                        <Image
                          src={image.src}
                          alt={`Life frame ${index + 1}`}
                          width={image.width}
                          height={image.height}
                          unoptimized
                          sizes="(min-width: 1280px) 31vw, (min-width: 768px) 47vw, 100vw"
                          priority={index < 4}
                          className="block w-full h-auto"
                        />
                        <span className="life-photo-meta">
                          <span className="life-photo-index">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="life-photo-name">
                            {image.original}
                          </span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {selectedImage && selectedFrame ? (
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
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIndex(
                  (selectedFrame - 2 + lifeImages.length) % lifeImages.length,
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
                      {selectedImage.original}
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
                  <Image
                    src={selectedImage.src}
                    alt={`Life frame ${selectedFrame}`}
                    width={selectedImage.width}
                    height={selectedImage.height}
                    unoptimized
                    sizes="100vw"
                    className="block mx-auto max-h-[78vh] w-auto max-w-full rounded-[20px]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="life-lightbox-button hidden sm:inline-flex"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIndex(selectedFrame % lifeImages.length);
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
