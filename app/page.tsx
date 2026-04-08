"use client";

import Link from "next/link";
import { lazy, Suspense, useEffect, useState } from "react";
import AgeProgress from "./components/AgeProgress";

const ThemeToggle3D = lazy(() => import("./components/ThemeToggle3D"));

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = savedTheme ? savedTheme === "dark" : false;
    setIsDarkMode(prefersDark);

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    localStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const heroColor = "var(--color-hero)";
  const headingColor = "var(--color-heading)";
  const subheadingColor = "var(--color-subheading)";
  const textColor = "var(--color-text)";
  const mutedColor = "var(--color-muted)";
  const mutedStrongColor = "var(--color-muted-strong)";
  const borderColor = "var(--color-border)";

  return (
    <main
      className="min-h-screen flex justify-center overflow-x-hidden"
      style={{
        paddingTop: "100px",
        paddingBottom: "30px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <div className="max-w-4xl w-full">
        <div className="flex flex-col gap-6">
          <div className="animate-fade-in delay-0">
            <div className="flex flex-col">
              <div className="relative" style={{ marginBottom: "0.5rem" }}>
                <h1
                  className="text-3xl sm:text-4xl font-black"
                  style={{ color: heroColor }}
                >
                  David Shan
                </h1>
                {/* Age Progress Bar - subtle placement below name */}
                <div style={{ marginTop: "0.5rem" }}>
                  <AgeProgress isDarkMode={isDarkMode} />
                </div>
                {/* Theme Toggle - positioned absolutely, hidden on mobile */}
                <div
                  className="hidden sm:block fadeIn"
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    width: "88px",
                    height: "88px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ pointerEvents: "auto" }}>
                    <Suspense
                      fallback={
                        <div style={{ width: "80px", height: "80px" }} />
                      }
                    >
                      <ThemeToggle3D
                        isDarkMode={isDarkMode}
                        toggleTheme={toggleTheme}
                      />
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section
            className="animate-fade-in delay-400"
            style={{ marginTop: "-1.5rem", marginBottom: "-1.25rem" }}
          >
            <div
              className="flex items-center gap-2 text-xs font-mono"
              style={{
                color: mutedColor,
                marginBottom: "0.5rem",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: mutedStrongColor }}
                ></span>
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: subheadingColor }}
                ></span>
              </span>
              San Francisco, CA
            </div>
            <p
              className="leading-relaxed text-base sm:text-lg"
              style={{ color: textColor }}
            >
              CTO @{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="href-text"
                href="https://freesolo.co"
                aria-label="Visit Freesolo website"
              >
                Freesolo
              </a>
              . Excited about AI, infrastructure, deep tech.
            </p>
          </section>

          <section
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            style={{ marginTop: "1.5rem" }}
          >
            <div>
              <h2
                className="text-lg sm:text-xl font-bold animate-fade-in delay-700"
                style={{
                  marginBottom: "0.75rem",
                  color: headingColor,
                }}
              >
                Work
              </h2>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <li
                  className="text-sm leading-relaxed animate-fade-in delay-900 w-full"
                  style={{ color: textColor }}
                >
                  <div
                    className="text-sm italic font-mono"
                    style={{
                      marginBottom: "0.25rem",
                      color: mutedStrongColor,
                    }}
                    role="presentation"
                  >
                    01
                  </div>
                  <p className="break-words">
                    Building product native models at{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://freesolo.co"
                      aria-label="Visit Freesolo website"
                    >
                      Freesolo
                    </a>
                    .
                  </p>
                </li>
                <li
                  className="text-sm leading-loose animate-fade-in delay-1100"
                  style={{ color: textColor }}
                >
                  <div
                    className="text-sm italic font-mono"
                    style={{
                      marginBottom: "0.25rem",
                      color: mutedStrongColor,
                    }}
                    role="presentation"
                  >
                    02
                  </div>
                  <p className="break-words">
                    Built state of the art people search engine and indexed over
                    20TB of data at{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://clado.ai"
                      aria-label="Visit Clado website"
                    >
                      Clado
                    </a>
                    .
                  </p>
                </li>
                <li
                  className="text-sm leading-loose animate-fade-in delay-1300"
                  style={{ color: textColor }}
                >
                  <div
                    className="text-sm italic font-mono"
                    style={{
                      marginBottom: "0.25rem",
                      color: mutedStrongColor,
                    }}
                    role="presentation"
                  >
                    03
                  </div>
                  <p>
                    Research lead at{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://compbio.mit.edu/"
                      aria-label="Visit MIT Kellis Lab"
                    >
                      MIT's Kellis Lab
                    </a>{" "}
                    working on agents in cognitive cartography.
                  </p>
                </li>
                <li
                  className="text-sm leading-loose animate-fade-in delay-1500"
                  style={{ color: textColor }}
                >
                  <div
                    className="text-sm italic font-mono"
                    style={{
                      marginBottom: "0.25rem",
                      color: mutedStrongColor,
                    }}
                    role="presentation"
                  >
                    04
                  </div>
                  <p>
                    Youngest software developer at{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://www.geotab.com/"
                      aria-label="Visit Geotab website"
                    >
                      Geotab
                    </a>{" "}
                    building telematics software.
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-lg sm:text-xl font-bold animate-fade-in delay-700"
                style={{
                  marginBottom: "0.75rem",
                  color: headingColor,
                }}
              >
                Interests
              </h2>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <li
                  className="text-sm leading-loose animate-fade-in delay-900"
                  style={{ color: textColor }}
                >
                  <div
                    className="text-sm italic font-mono"
                    style={{
                      marginBottom: "0.25rem",
                      color: mutedStrongColor,
                    }}
                    role="presentation"
                  >
                    01
                  </div>
                  <div>
                    <p className="mb-4">Favorite movies:</p>
                    <ol
                      className="list-decimal list-inside space-y-3"
                      style={{ marginLeft: "1rem" }}
                    >
                      <li>Shawshank Redemption</li>
                      <li>Good Will Hunting</li>
                      <li>Forrest Gump</li>
                    </ol>
                  </div>
                </li>
                <li
                  className="text-sm leading-loose animate-fade-in delay-1100"
                  style={{ color: textColor }}
                >
                  <div
                    className="text-sm italic font-mono"
                    style={{
                      marginBottom: "0.25rem",
                      color: mutedStrongColor,
                    }}
                    role="presentation"
                  >
                    02
                  </div>
                  <p>Currently learning golf, tennis, guitar, and piloting</p>
                </li>
                <li
                  className="text-sm leading-loose animate-fade-in delay-1300"
                  style={{ color: textColor }}
                >
                  <div
                    className="text-sm italic font-mono"
                    style={{
                      marginBottom: "0.25rem",
                      color: mutedStrongColor,
                    }}
                    role="presentation"
                  >
                    03
                  </div>
                  <div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Team Ontario Table Tennis</li>
                      <li>
                        Haliburton 26K, Haliburton 50K, and Toronto Waterfront Marathon Finisher
                      </li>
                      <li>CSIA Level 2 Ski Instructor</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-lg sm:text-xl font-bold animate-fade-in delay-700"
                style={{
                  marginBottom: "0.75rem",
                  color: headingColor,
                }}
              >
                Misc
              </h2>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <li
                  className="text-sm leading-loose animate-fade-in delay-900"
                  style={{ color: textColor }}
                >
                  <div
                    className="text-sm italic font-mono"
                    style={{
                      marginBottom: "0.25rem",
                      color: mutedStrongColor,
                    }}
                    role="presentation"
                  >
                    01
                  </div>
                  <div>
                    <p className="mb-4">
                      I also do a bit of angel investing on the side:
                    </p>
                    <ul className="space-y-2" style={{ marginLeft: "1rem" }}>
                      <li>
                        <span className="font-medium">
                          i.{" "}
                          <a
                            href="https://www.trymatrix.bio/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-link"
                          >
                            Matrix Biotech
                          </a>{" "}
                          (Pre-seed)
                        </span>
                        <div
                          className="text-xs mt-1"
                          style={{ marginLeft: "0.75rem" }}
                        >
                          At-home DNA health testing
                        </div>
                      </li>
                      <li>
                        <span className="font-medium">
                          ii.{" "}
                          <a
                            href="https://www.imagineai.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-link"
                          >
                            Imagine AI
                          </a>{" "}
                          (Seed)
                        </span>
                        <div
                          className="text-xs mt-1"
                          style={{ marginLeft: "0.75rem" }}
                        >
                          Your AI Clone for B2B Content
                        </div>
                      </li>
                      <li>
                        <span className="font-medium">
                          iii.{" "}
                          <a
                            href="https://traverse.so/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-link"
                          >
                            Traverse
                          </a>{" "}
                          (Seed)
                        </span>
                        <div
                          className="text-xs mt-1"
                          style={{ marginLeft: "0.75rem" }}
                        >
                          RL environments for frontier AI labs
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
                <li
                  className="text-sm leading-loose animate-fade-in delay-1100"
                  style={{ color: textColor }}
                >
                  <div
                    className="text-sm italic font-mono"
                    style={{
                      marginBottom: "0.25rem",
                      color: mutedStrongColor,
                    }}
                    role="presentation"
                  >
                    02
                  </div>
                  <div>
                    <p className="mb-4">Some cool stuff I built in the past:</p>
                    <ul className="space-y-2" style={{ marginLeft: "1rem" }}>
                      <li>
                        <span className="font-medium">
                          i.{" "}
                          <a
                            href="https://github.com/DavidBShan/City-Development-Index"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-link"
                          >
                            LSTM-based city development prediction using
                            geospatial data
                          </a>
                        </span>
                      </li>
                      <li>
                        <span className="font-medium">
                          ii.{" "}
                          <a
                            href="https://github.com/DavidBShan/Competitive-Programming2022-2024"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-link"
                          >
                            Some competitive programming solutions
                          </a>
                        </span>
                      </li>
                      <li>
                        <span className="font-medium">
                          iii.{" "}
                          <a
                            href="https://github.com/DavidBShan/Heart-Disease-Detector"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-link"
                          >
                            Embedded hardware for heart disease detection
                          </a>
                        </span>
                      </li>
                      <li>
                        <span className="font-medium">
                          iv.{" "}
                          <a
                            href="https://drive.google.com/file/d/17VzJ2ki5vfzq2MjZK_dueFeCMcsKuCvk/view"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-link"
                          >
                            Using semantic segmentation to predict wildfires
                          </a>
                        </span>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <footer
            className="border-t pt-6 mt-12 animate-fade-in delay-1600"
            style={{ borderColor: borderColor }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div
                className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
                style={{ color: textColor }}
              >
                <a
                  href="https://twitter.com/davidbshan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-link"
                  aria-label="Visit David Shan on Twitter"
                >
                  Twitter
                </a>
                <a
                  href="https://www.linkedin.com/in/davidbshan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-link"
                  aria-label="Visit David Shan on LinkedIn"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/davidbshan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-link"
                  aria-label="Visit David Shan on GitHub"
                >
                  GitHub
                </a>
                <a
                  href="mailto:david@clado.ai"
                  className="hover-link"
                  aria-label="Email David Shan"
                >
                  Email
                </a>
                <a
                  href="https://letterboxd.com/ChickenMcSwag/films/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-link"
                  aria-label="Visit David Shan on Letterboxd"
                >
                  Letterboxd
                </a>
                <Link
                  href="/writings"
                  className="hover-link"
                  aria-label="Read David Shan's writings"
                >
                  Writings
                </Link>
                <Link
                  href="/reading"
                  className="hover-link"
                  aria-label="View David Shan's reading list"
                >
                  Reading
                </Link>
                <Link
                  href="/life"
                  className="hover-link"
                  aria-label="View David Shan's life gallery"
                >
                  Life
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
