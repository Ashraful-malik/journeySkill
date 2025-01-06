"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      {theme === "light" ? (
        <>
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-2 p-2 rounded-lg ${
              theme === "dark" ? "bg-accent text-white" : "hover:bg-muted"
            }`}
            aria-label="Switch to dark theme"
          >
            <Moon />
            Dark Theme
          </button>
        </>
      ) : (
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 p-2 rounded-lg ${
            theme === "light" ? "bg-accent text-white" : "hover:bg-muted"
          }`}
          aria-label="Switch to light theme"
        >
          <Sun />
          Light Theme
        </button>
      )}
    </div>
  );
};

export default ThemeSwitcher;
