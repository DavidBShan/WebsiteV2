"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
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

  return (
    <>
      <main
        className="min-h-screen flex justify-center overflow-x-hidden"
        style={{
          paddingTop: "50px",
          paddingBottom: "30px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <div className="max-w-4xl w-full">
          <div className="flex flex-col gap-6">
            <div className="animate-fade-in delay-0">
              <div className="flex flex-col">
                <div className="relative" style={{ marginBottom: "1rem" }}>
                  <h1
                    className="text-3xl sm:text-4xl font-black"
                    style={{
                      color: isDarkMode ? "#e5e7eb" : "#111827",
                    }}
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
                      <Suspense fallback={<div style={{ width: "80px", height: "80px" }} />}>
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

            <section className="animate-fade-in delay-400" style={{ marginTop: "-1.25rem", marginBottom: "-1.25rem" }}>
              <p
                className="leading-relaxed text-base sm:text-lg"
                style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
              >
                CTO @{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="href-text"
                  href="https://clado.ai"
                  aria-label="Visit Clado website"
                >
                  Clado
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
                    color: isDarkMode ? "#e5e7eb" : "#1f2937",
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
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-700 dark:text-gray-400 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                      role="presentation"
                    >
                      01
                    </div>
                    <p className="break-words">
                      Building state of the art people search at{" "}
                      {" "}<a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="href-text"
                        href="https://clado.ai"
                        aria-label="Visit Clado website"
                      >
                        Clado
                      </a>{" "}
                      .
                    </p>
                  </li>
                  <li
                    className="text-sm leading-loose animate-fade-in delay-1100"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-700 dark:text-gray-400 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                      role="presentation"
                    >
                      02
                    </div>
                    <p>
                      Researched agentic engineering at MIT with <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="href-text"
                        href="https://compbio.mit.edu/"
                        aria-label="Visit Professor Manolis Kellis at MIT"
                      >
                        Professor Manolis Kellis
                      </a>.
                    </p>
                  </li>
                  <li
                    className="text-sm leading-loose animate-fade-in delay-1300"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-700 dark:text-gray-400 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                      role="presentation"
                    >
                      03
                    </div>
                    <p>
                      Interned at{" "}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="href-text"
                        href="https://www.geotab.com/"
                        aria-label="Visit Geotab website"
                      >
                        Geotab
                      </a>
                      {" "}to build telematics software.
                    </p>
                  </li>
                </ul>
              </div>

              <div>
                <h2
                  className="text-lg sm:text-xl font-bold animate-fade-in delay-700"
                  style={{
                    marginBottom: "0.75rem",
                    color: isDarkMode ? "#e5e7eb" : "#1f2937",
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
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-700 dark:text-gray-400 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                      role="presentation"
                    >
                      01
                    </div>
                    <div>
                      <p className="mb-4">Favorite writings:</p>
                      <ol
                        className="list-decimal list-inside space-y-3"
                        style={{ marginLeft: "1rem" }}
                      >
                        <li>Man's Search For Meaning (Viktor Frankl)</li>
                        <li>The Almanack of Naval Ravikant (Eric Jorgenson)</li>
                        <li>Zero To One (Peter Thiel)</li>
                      </ol>
                    </div>
                  </li>
                  <li
                    className="text-sm leading-loose animate-fade-in delay-1100"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-700 dark:text-gray-400 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                      role="presentation"
                    >
                      02
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
                    className="text-sm leading-loose animate-fade-in delay-1300"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-700 dark:text-gray-400 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                      role="presentation"
                    >
                      03
                    </div>
                    <p>Currently learning golf, guitar, and singing</p>
                  </li>
                  <li
                    className="text-sm leading-loose animate-fade-in delay-1500"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-700 dark:text-gray-400 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                      role="presentation"
                    >
                      04
                    </div>
                    <div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Team Ontario Table Tennis</li>
                        <li>Haliburton 26K, Toronto Waterfront Marathon, and 50K Ultramarathon</li>
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
                    color: isDarkMode ? "#e5e7eb" : "#1f2937",
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
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-700 dark:text-gray-400 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                      role="presentation"
                    >
                      01
                    </div>
                    <div>
                      <p>
                        Exploring browser agents and observability in
                        the context of machine learning.
                      </p>
                    </div>
                  </li>
                  <li
                    className="text-sm leading-loose animate-fade-in delay-1100"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-700 dark:text-gray-400 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                      role="presentation"
                    >
                      02
                    </div>
                    <div>
                      <p className="mb-4">I also do a bit of angel investing on the side:</p>
                      <ul className="space-y-2" style={{ marginLeft: "1rem" }}>
                        <li>
                          <span className="font-medium">i. Matrix Biotech (Pre-seed)</span>
                          <div className="text-xs mt-1" style={{ marginLeft: "0.75rem" }}>
                            At-home DNA health testing
                          </div>
                        </li>
                      </ul>
                      </div>
                  </li>
                </ul>
              </div>
            </section>

            <footer
              className="border-t pt-6 mt-12 animate-fade-in delay-1600"
              style={{ borderColor: isDarkMode ? "#1f2937" : "#e5e7eb" }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
                  style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                >
                  <a
                    href="https://twitter.com/davidbshan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Visit David Shan on Twitter"
                  >
                    Twitter
                  </a>
                  <a
                    href="https://www.linkedin.com/in/davidbshan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Visit David Shan on LinkedIn"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/davidbshan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Visit David Shan on GitHub"
                  >
                    GitHub
                  </a>
                  <a
                    href="mailto:david@clado.ai"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Email David Shan"
                  >
                    Email
                  </a>
                  <a
                    href="https://letterboxd.com/ChickenMcSwag/films/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Visit David Shan on Letterboxd"
                  >
                    Letterboxd
                  </a>
                  <Link
                    href="/writings"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Read David Shan's writings"
                  >
                    Writings
                  </Link>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="View David Shan's resume"
                  >
                    Resume
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
}
