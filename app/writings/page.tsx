"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Writings() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = savedTheme ? savedTheme === "dark" : false;

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
            className="inline-flex items-center gap-2 text-sm hover-link animate-fade-in delay-0"
            style={{ color: "var(--color-text)" }}
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

          {/* Title */}
          <div className="animate-fade-in delay-0">
            <h1
              className="text-3xl sm:text-4xl font-black"
              style={{
                color: "var(--color-subheading)",
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
                  className="block hover-link-group"
                >
                  <h2
                    className="text-lg sm:text-xl font-bold hover-link-target"
                    style={{
                      color: "var(--color-heading)",
                    }}
                  >
                    Building SOTA People Search
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "var(--color-text)",
                      marginTop: "0.5rem",
                    }}
                  >
                    Scaling from per-school databases of ~10k profiles to a
                    unified architecture indexing 800M+ people and 30M companies
                    worldwide.
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
