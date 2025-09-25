"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle3D from "./components/ThemeToggle3D";
import AgeProgress from "./components/AgeProgress";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 640;
    
    if (isMobile) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = savedTheme ? savedTheme === "dark" : true;
      setIsDarkMode(prefersDark);
      
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
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
          paddingRight: "24px" 
        }}
      >
        <div className="max-w-4xl w-full">
        <div
          className="flex flex-col gap-6"
        >
          <div className="animate-fade-in delay-0">
            <div className="flex flex-col">
              <div className="relative" style={{ marginBottom: "1.5rem" }}>
                <h1
                  className="text-3xl sm:text-4xl font-black"
                  style={{ 
                    color: isDarkMode ? "#e5e7eb" : "#374151"
                  }}
                >
                  David Shan
                </h1>
                {/* Theme Toggle - positioned absolutely, hidden on mobile */}
                <div className="hidden sm:block fadeIn" style={{ 
                  position: "absolute",
                  top: "0",
                  right: "0",
                  width: "88px", 
                  height: "88px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none"
                }}>
                  <div style={{ pointerEvents: "auto" }}>
                    <ThemeToggle3D isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                  </div>
                </div>
              </div>
              <div
                className="flex flex-wrap gap-5 sm:gap-5 outline-none"
                style={{ marginBottom: "1rem", marginTop: "0.5rem" }}
              >
                <a
                  href="https://github.com/sritanmotati"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 p-1 -m-1"
                  style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 sm:w-5 sm:h-5"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/sritan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 p-1 -m-1"
                  style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 sm:w-5 sm:h-5"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a
                  href="https://twitter.com/sritanmotati"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 p-1 -m-1"
                  style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 sm:w-5 sm:h-5"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="mailto:sritan@a37.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 p-1 -m-1"
                  style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 sm:w-5 sm:h-5"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="sr-only">Email</span>
                </a>
                <Link
                  href="/writings"
                  className="hover:opacity-80 p-1 -m-1"
                  style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 sm:w-5 sm:h-5"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span className="sr-only">Writing</span>
                </Link>
                <a
                  href="https://letterboxd.com/sritan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 p-1 -m-1"
                  style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 sm:w-5 sm:h-5"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="2.18"
                      ry="2.18"
                    ></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <line x1="2" y1="7" x2="7" y2="7"></line>
                    <line x1="2" y1="17" x2="7" y2="17"></line>
                    <line x1="17" y1="17" x2="22" y2="17"></line>
                    <line x1="17" y1="7" x2="22" y2="7"></line>
                  </svg>
                  <span className="sr-only">Letterboxd</span>
                </a>
              </div>
            </div>
            
            {/* Age Progress Bar - subtle placement below social links */}
            <div style={{ marginTop: "0.75rem" }}>
              <AgeProgress isDarkMode={isDarkMode} />
            </div>
          </div>

          <section className="animate-fade-in delay-400">
            <p className="leading-relaxed text-base sm:text-lg" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
              Hey, I'm Sritan. I'm currently tackling DevOps at{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="href-text"
                href="https://a37.ai"
              >
                a37
              </a>
              . Previously studied at{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="href-text"
                href="https://fisher.wharton.upenn.edu"
              >
                Penn M&T
              </a>
              . I'm excited about AI, product engineering, and infrastructure.
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
                  color: isDarkMode ? "#e5e7eb" : "#374151"
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
                <li className="text-sm leading-relaxed animate-fade-in delay-900 w-full" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
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
                      href="https://a37.ai"
                    >
                      a37
                    </a>{" "}
                    to build{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://tryforge.ai"
                    >
                      Forge
                    </a>
                    , an AI-native workspace for DevOps.
                  </p>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1100" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    02
                  </div>
                  <p>
                    Led engineering at{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://www.forbes.com/sites/craigsmith/2023/09/05/teens-launch-125m-eye-scan-startup-to-detect-dementia/"
                    >
                      VytaL.ai
                    </a>
                    . Built lightweight gaze tracking algorithms and the
                    surrounding software and infrastructure.
                  </p>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1300" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    03
                  </div>
                  <p>
                    Joined{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://contrary.com"
                    >
                      Contrary
                    </a>{" "}
                    as a venture partner. Early-stage investing.
                  </p>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1500" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    04
                  </div>
                  <p>
                    Maintained infrastructure for{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://pennlabs.org"
                    >
                      Penn Labs
                    </a>{" "}
                    as a DevOps engineer.
                  </p>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1700" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    05
                  </div>
                  <p>
                    Worked on applied AI research across many disciplines. See
                    my{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://scholar.google.com/citations?user=QZNuPBQAAAAJ&hl=en"
                    >
                      Google Scholar
                    </a>{" "}
                    for more.
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-lg sm:text-xl font-bold animate-fade-in delay-700"
                style={{ 
                  marginBottom: "0.75rem",
                  color: isDarkMode ? "#e5e7eb" : "#374151"
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
                <li className="text-sm leading-loose animate-fade-in delay-900" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    01
                  </div>
                  <p>
                    Trained video foundation models for cataract surgery at the{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://ophai.hms.harvard.edu"
                    >
                      Harvard Ophthalmology AI Lab
                    </a>
                    .
                  </p>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1100" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    02
                  </div>
                  <p>
                    Explored few-shot omics translation with autoencoders at
                    Stanford's{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://nalab.stanford.edu"
                    >
                      Aghaeepour Lab
                    </a>
                    .
                  </p>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1300" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    03
                  </div>
                  <p>
                    Designed physics-informed AI methods for acoustics
                    simulations at the{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://www.nrl.navy.mil/itd/aic/"
                    >
                      Naval Research Laboratory
                    </a>
                    .
                  </p>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1500" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    04
                  </div>
                  <p>
                    Built methods for text-to-3D design, editing, and printing
                    with diffusion. Won 1st at{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://isef.net/project/teca019t-diffusion-based-3d-art-generation"
                    >
                      ISEF
                    </a>
                    .
                  </p>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1700" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    05
                  </div>
                  <p>
                    Automated ear infection screening with a 3D-printed mobile
                    otoscope. Presented at{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://isef.net/project/tmed042t-otitis-media-diagnosis-with-smartphones"
                    >
                      ISEF
                    </a>{" "}
                    and{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="href-text"
                      href="https://dl.acm.org/doi/10.1007/978-3-031-47076-9_16"
                    >
                      MICCAI 2023
                    </a>
                    .
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-lg sm:text-xl font-bold animate-fade-in delay-700"
                style={{ 
                  marginBottom: "0.75rem",
                  color: isDarkMode ? "#e5e7eb" : "#374151"
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
                <li className="text-sm leading-loose animate-fade-in delay-900" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    01
                  </div>
                  <div>
                    <p>Based in San Francisco, CA. Always down to chat.</p>
                  </div>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1100" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    02
                  </div>
                  <div>
                    <p className="mb-4">Some of my favorite reads.</p>
                    <ol className="list-decimal list-inside space-y-3" style={{ marginLeft: "1rem" }}>
                      <li>When Breath Becomes Air (Paul Kalanithi)</li>
                      <li>Steve Jobs (Walter Isaacson)</li>
                      <li>The Aeneid (Virgil)</li>
                      <li>One Piece (Eiichiro Oda)</li>
                    </ol>
                  </div>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1300" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    03
                  </div>
                  <div>
                    <p className="mb-4">Big fan of...</p>
                    <ol className="list-decimal list-inside space-y-3" style={{ marginLeft: "1rem" }}>
                      <li>Cleveland Cavaliers</li>
                      <li>Afrobeats and hip-hop</li>
                      <li>Pushing to prod ;)</li>
                    </ol>
                  </div>
                </li>
                <li className="text-sm leading-loose animate-fade-in delay-1500" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                  <div
                    className="text-sm italic text-gray-500 dark:text-gray-500 font-mono"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    04
                  </div>
                  <div>
                    <p>
                      Other affiliations: TJHSST (prev. ran{" "}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="href-text"
                        href="https://tjmachinelearning.com"
                      >
                        ML Club
                      </a>
                      ),{" "}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="href-text"
                        href="https://www.zfellows.com"
                      >
                        Z Fellows
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
    </>
  );
}
