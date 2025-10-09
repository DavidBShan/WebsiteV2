"use client";

import { useState, useEffect } from "react";

const BIRTH_DATE = new Date("2007-03-02");

interface AgeProgressProps {
  isDarkMode: boolean;
}

export default function AgeProgress({ isDarkMode }: AgeProgressProps) {
  const [currentAge, setCurrentAge] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateAge = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Calculate current age
      let age = currentYear - BIRTH_DATE.getFullYear();
      const monthDiff = now.getMonth() - BIRTH_DATE.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && now.getDate() < BIRTH_DATE.getDate())
      ) {
        age--;
      }

      let nextBirthday = new Date(
        currentYear,
        BIRTH_DATE.getMonth(),
        BIRTH_DATE.getDate(),
      );
      if (nextBirthday <= now) {
        nextBirthday = new Date(
          currentYear + 1,
          BIRTH_DATE.getMonth(),
          BIRTH_DATE.getDate(),
        );
      }

      let lastBirthday = new Date(
        currentYear,
        BIRTH_DATE.getMonth(),
        BIRTH_DATE.getDate(),
      );
      if (lastBirthday > now) {
        lastBirthday = new Date(
          currentYear - 1,
          BIRTH_DATE.getMonth(),
          BIRTH_DATE.getDate(),
        );
      }

      const totalDaysInYear =
        (nextBirthday.getTime() - lastBirthday.getTime()) /
        (1000 * 60 * 60 * 24);
      const daysPassed =
        (now.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24);
      const progressPercentage = (daysPassed / totalDaysInYear) * 100;

      setCurrentAge(age);
      setProgress(progressPercentage);
    };

    calculateAge();
    const interval = setInterval(calculateAge, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3">
      <span
        className="text-xs"
        style={{
          color: isDarkMode ? "#9ca3af" : "#6b7280",
        }}
      >
        Age {currentAge}
      </span>

      <div
        className="w-16 sm:w-24 h-[2px] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress to age ${currentAge + 1}: ${Math.round(progress)}%`}
        style={{
          backgroundColor: isDarkMode
            ? "rgba(156, 163, 175, 0.2)"
            : "rgba(75, 85, 99, 0.15)",
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: isDarkMode ? "#9ca3af" : "#6b7280",
          }}
        />
      </div>

      <span
        className="text-xs"
        style={{
          color: isDarkMode ? "#9ca3af" : "#6b7280",
        }}
      >
        Age {currentAge + 1}
      </span>
    </div>
  );
}
