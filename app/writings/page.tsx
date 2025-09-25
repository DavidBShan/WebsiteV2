"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Writings() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = savedTheme ? savedTheme === "dark" : true;
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
        paddingRight: "24px" 
      }}
    >
      <div className="max-w-4xl w-full">
        <div className="flex flex-col gap-6">
          {/* Back link */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity animate-fade-in delay-0"
            style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}
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
                marginBottom: "1.5rem"
              }}
            >
              Writings
            </h1>
          </div>

          {/* Coming soon message */}
          <section className="animate-fade-in delay-400">
            <p className="leading-relaxed text-base sm:text-lg" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
              Coming soon...
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
