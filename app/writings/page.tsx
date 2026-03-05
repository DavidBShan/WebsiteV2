"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Writings() {
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
      <div className="max-w-4xl w-full">
        <div className="flex flex-col gap-6">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity animate-fade-in delay-0"
            style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}
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
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </Link>

          {/* Title */}
          <div className="animate-fade-in delay-0">
            <h1
              className="text-3xl sm:text-4xl font-black"
              style={{
                color: isDarkMode ? "#e5e7eb" : "#374151",
                marginBottom: "1.5rem",
              }}
            >
              Writings
            </h1>
          </div>

          {/* Blog posts */}
          <section className="animate-fade-in delay-400">
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <li>
                <Link
                  href="/writings/building-sota-people-search"
                  className="block group"
                >
                  <div
                    className="text-xs font-mono"
                    style={{
                      color: isDarkMode ? "#6b7280" : "#9ca3af",
                      marginBottom: "0.25rem",
                    }}
                  >
                    October 29, 2025
                  </div>
                  <h2
                    className="text-lg sm:text-xl font-bold group-hover:opacity-70 transition-opacity"
                    style={{
                      color: isDarkMode ? "#e5e7eb" : "#1f2937",
                    }}
                  >
                    Building SOTA People Search
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: isDarkMode ? "#9ca3af" : "#4b5563",
                      marginTop: "0.5rem",
                    }}
                  >
                    Scaling from per-school databases of ~10k profiles to a unified architecture indexing 800M+ people and 30M companies worldwide.
                  </p>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
