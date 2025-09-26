"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle3D from "./components/ThemeToggle3D";
import AgeProgress from "./components/AgeProgress";

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
          paddingTop: "30px",
          paddingBottom: "30px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <div className="max-w-4xl w-full">
          <div className="flex flex-col gap-6">
            <div className="animate-fade-in delay-0">
              <div className="flex flex-col">
                <div className="relative" style={{ marginBottom: "1.5rem" }}>
                  <h1
                    className="text-3xl sm:text-4xl font-black"
                    style={{
                      color: isDarkMode ? "#e5e7eb" : "#374151",
                    }}
                  >
                    David Shan
                  </h1>
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
                      <ThemeToggle3D
                        isDarkMode={isDarkMode}
                        toggleTheme={toggleTheme}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Progress Bar - subtle placement below social links */}
              <div style={{ marginTop: "0.75rem" }}>
                <AgeProgress isDarkMode={isDarkMode} />
              </div>
            </div>

            <section className="animate-fade-in delay-400">
              <p
                className="leading-relaxed text-base sm:text-lg"
                style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
              >
                Currently CTO @{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="href-text"
                  href="https://clado.ai"
                >
                  Clado
                </a>
                . I'm excited about AI, infrastructure, and deep tech.
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
                    color: isDarkMode ? "#e5e7eb" : "#374151",
                  }}
                >
                  Experience
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
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                    >
                      01
                    </div>
                    <p className="break-words">
                      Co-founded{" "}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="href-text"
                        href="https://clado.ai"
                      >
                        Clado
                      </a>{" "}
                      to build state of the art people search.
                    </p>
                  </li>
                  <li
                    className="text-sm leading-loose animate-fade-in delay-1100"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                    >
                      02
                    </div>
                    <p>
                      Led the agentic engineering team to develop MANTIS at{" "}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="href-text"
                        href="https://compbio.mit.edu/"
                      >
                        Kellis Lab
                      </a>{" "}
                      at MIT.
                    </p>
                  </li>
                  <li
                    className="text-sm leading-loose animate-fade-in delay-1300"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
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
                      >
                        Geotab
                      </a>
                      to build telematics software.
                    </p>
                  </li>
                  <li
                    className="text-sm leading-loose animate-fade-in delay-1500"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                    >
                      04
                    </div>
                    <p>
                      Developed Rigid Ramp Walker and Ruler Trick Simulations
                      using{" "}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="href-text"
                        href="https://mujoco.org/"
                      >
                        Mujoco
                      </a>{" "}
                      and 4th-Degree Runge Kutta's method.
                    </p>
                  </li>
                  <li
                    className="text-sm leading-loose animate-fade-in delay-1700"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                    >
                      05
                    </div>
                    <p>
                      Published Big Data Research Papers to the STEM Fellowship
                      Journal (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="href-text"
                        href="https://drive.google.com/file/d/1ev65mlwrfEN0kpjZVgCr-RcP9_9XaS-K/view"
                      >
                        Manuscript 1
                      </a>
                      ,{" "}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="href-text"
                        href="https://drive.google.com/file/d/17VzJ2ki5vfzq2MjZK_dueFeCMcsKuCvk/view"
                      >
                        Manuscript 2
                      </a>
                      ).
                    </p>
                  </li>
                </ul>
              </div>

              <div>
                <h2
                  className="text-lg sm:text-xl font-bold animate-fade-in delay-700"
                  style={{
                    marginBottom: "0.75rem",
                    color: isDarkMode ? "#e5e7eb" : "#374151",
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
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
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
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
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
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
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
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                    >
                      04
                    </div>
                    <div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Team Ontario Table Tennis competitor</li>
                        <li>Completed Haliburton 26K & 50K Ultramarathon</li>
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
                    color: isDarkMode ? "#e5e7eb" : "#374151",
                  }}
                >
                  Other
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
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                    >
                      01
                    </div>
                    <div>
                      <p>
                        Currently exploring browser agents and observability in
                        the context of machine learning.
                      </p>
                    </div>
                  </li>
                  <li
                    className="text-sm leading-loose animate-fade-in delay-1100"
                    style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  >
                    <div
                      className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                      style={{ marginBottom: "0.25rem" }}
                    >
                      02
                    </div>
                    <div>
                      <p>
                        Really excited about RL environments and DevOps for agent
                        builders.
                      </p>
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
                  >
                    Twitter
                  </a>
                  <a
                    href="https://www.linkedin.com/in/davidbshan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/davidbshan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    GitHub
                  </a>
                  <a
                    href="mailto:david@clado.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    Email
                  </a>
                  <a
                    href="https://letterboxd.com/ChickenMcSwag/films/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    Letterboxd
                  </a>
                  <Link
                    href="/writings"
                    className="hover:opacity-70 transition-opacity"
                  >
                    Writings
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
}
