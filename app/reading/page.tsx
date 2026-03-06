"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const currentlyReading = [
  { title: "Meditations", author: "Marcus Aurelius" },
  { title: "In Buddha's Words", author: "Bhikkhu Bodhi" },
  { title: "The Republic", author: "Plato" },
  { title: "The Hunchback of Notre Dame", author: "Victor Hugo" },
  { title: "Steve Jobs", author: "Walter Isaacson" },
];

const finished = [
  { title: "The Three-Body Problem", author: "Liu Cixin" },
  { title: "Designing Data Intensive Applications", author: "Martin Kleppmann" },
  { title: "The Alchemist", author: "Paulo Coelho" },
  { title: "1984", author: "George Orwell" },
  { title: "Fahrenheit 451", author: "Ray Bradbury" },
  { title: "How to Win Friends and Influence People", author: "Dale Carnegie" },
  { title: "Shoe Dog", author: "Phil Knight" },
  { title: "The Prince", author: "Niccolo Machiavelli" },
  { title: "Tao Te Ching", author: "Lao Tzu" },
  { title: "Principles", author: "Ray Dalio" },
  { title: "Zero To One", author: "Peter Thiel" },
  { title: "Atomic Habits", author: "James Clear" },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky" },
  { title: "Man's Search For Meaning", author: "Viktor Frankl" },
  { title: "The Picture of Dorian Gray", author: "Oscar Wilde" },
  { title: "Superfreakonimics", author: "Steven Levitt & Stephen Dubner" },
  { title: "Three Muskateers", author: "Alexandre Dumas" },
  { title: "Outliers", author: "Malcolm Gladwell" },
  { title: "Freakonomics", author: "Steven Levitt & Stephen Dubner" },
  { title: "Sapiens", author: "Yuval Noah Harari" },
  { title: "The Mom Test", author: "Rob Fitzpatrick" },
  { title: "Hitch Hiker's Guide to the Galaxy", author: "Douglas Adams" },
  { title: "Lean Startup", author: "Eric Ries" },
  { title: "Poor Charlie's Almanack", author: "Charlie Munger" },
  { title: "Don Quixote", author: "Miguel de Cervantes" },
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson" },
  { title: "The Count of Monte Cristo", author: "Alexandre Dumas" },
  { title: "Les Misérables", author: "Victor Hugo" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { title: "The Old Man and the Sea", author: "Ernest Hemingway" },
  { title: "Can't Hurt Me", author: "David Goggins" },
  { title: "12 Rules for Life", author: "Jordan Peterson" },
  { title: "Beyond Good and Evil", author: "Friedrich Nietzsche" },
  { title: "Brave New World", author: "Aldous Huxley" },
];

export default function Reading() {
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

  const textColor = isDarkMode ? "#9ca3af" : "#4b5563";
  const headingColor = isDarkMode ? "#e5e7eb" : "#1f2937";
  const subheadingColor = isDarkMode ? "#d1d5db" : "#374151";

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

          {/* Title */}
          <div className="animate-fade-in delay-0">
            <h1
              className="text-3xl sm:text-4xl font-black"
              style={{
                color: headingColor,
                marginBottom: "1.5rem",
              }}
            >
              Reading
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-12">
            {/* Currently Reading */}
            <section className="animate-fade-in delay-400">
              <h2
                className="text-lg sm:text-xl font-bold"
                style={{ color: subheadingColor, marginBottom: "0.75rem" }}
              >
                Currently Reading
              </h2>
              <ul
                className="space-y-3"
                style={{ color: textColor }}
              >
                {currentlyReading.map((book) => (
                  <li key={book.title}>
                    <div className="text-sm sm:text-base">{book.title}</div>
                    <div
                      className="text-xs"
                      style={{ color: isDarkMode ? "#6b7280" : "#9ca3af" }}
                    >
                      {book.author}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Finished */}
            <section className="animate-fade-in delay-700">
              <h2
                className="text-lg sm:text-xl font-bold"
                style={{ color: subheadingColor, marginBottom: "0.75rem" }}
              >
                Finished
              </h2>
              <p
                className="text-xs italic"
                style={{
                  color: isDarkMode ? "#6b7280" : "#9ca3af",
                  marginTop: "-0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                In no particular order
              </p>
              <ul
                className="space-y-3"
                style={{ color: textColor }}
              >
                {finished.map((book, i) => (
                  <li key={book.title}>
                    <div className="text-sm sm:text-base">
                      <span
                        className="font-mono text-xs"
                        style={{
                          color: isDarkMode ? "#6b7280" : "#9ca3af",
                          marginRight: "0.75rem",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {book.title}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: isDarkMode ? "#6b7280" : "#9ca3af",
                        marginLeft: "2rem",
                      }}
                    >
                      {book.author}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
