/*
import React from 'react';
import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher = () => {
  const toggleTheme = () => {
    const html = document.querySelector('html');
    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const html = document.querySelector('html');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }, []);

  return (
    <label className="swap swap-rotate">
      <input type="checkbox" onClick={toggleTheme} />
      <Sun className="swap-on w-6 h-6" />
      <Moon className="swap-off w-6 h-6" />
    </label>
  );
};

export default ThemeSwitcher;
*/
import React from "react";
import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import useLocalStorageState from "use-local-storage-state";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useLocalStorageState("theme", {
    defaultValue: () => {
      const prefersDark =
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    },
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        onChange={toggleTheme}
        checked={theme === "dark"}
      />
      <Sun className="swap-on w-6 h-6" />
      <Moon className="swap-off w-6 h-6" />
    </label>
  );
};

export default ThemeSwitcher;
