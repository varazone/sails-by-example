import React, { useEffect } from "react";
import { themeChange } from "theme-change";
import { useTranslation } from "react-i18next"; // Assuming you're using react-i18next for translations
import { Check, ChevronDown, Wand } from "lucide-react";
import useLocalStorageState from "use-local-storage-state";

const ThemeChanger = (
  {
    themes,
    dropdownClasses = "",
    btnClasses = "btn-ghost",
    contentClasses = "mt-16",
  },
) => {
  const { t } = useTranslation();
  const [currentTheme, setCurrentTheme] = useLocalStorageState("theme", {
    defaultValue: () => {
      const prefersDark =
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    },
  });

  useEffect(() => {
    themeChange(false);
    // Set the initial theme from localStorage
    document.querySelector("html").setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  };

  return (
    <div
      title="Change Theme"
      className={`dropdown dropdown-end block ${dropdownClasses}`}
    >
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-ghost m-1 flex items-center justify-center ${btnClasses}`}
        aria-label="Change Theme"
      >
        <div className="bg-base-100 group-hover:border-base-content/20 border-base-content/10 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1 transition-colors">
          <div className="bg-base-content size-1 rounded-full"></div>
          <div className="bg-primary size-1 rounded-full"></div>
          <div className="bg-secondary size-1 rounded-full"></div>
          <div className="bg-accent size-1 rounded-full"></div>
        </div>
        {/*<ChevronDown size={12} className="mt-px hidden opacity-60 sm:inline-block" />*/}
      </div>
      <div
        tabIndex={0}
        className={`dropdown-content bg-base-200 text-base-content rounded-box top-px h-[30.5rem] max-h-[calc(100vh-8.6rem)] overflow-y-auto border-[length:var(--border)] border-white/5 shadow-2xl outline-[length:var(--border)] outline-black/5 ${contentClasses}`}
      >
        <ul className="menu w-56">
          <li className="menu-title text-xs">{t("Theme")}</li>
          {themes.map((theme) => (
            <li key={theme}>
              <button
                className="gap-3 px-2"
                onClick={() => handleThemeChange(theme)}
              >
                <div
                  data-theme={theme}
                  className="bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
                >
                  <div className="bg-base-content size-1 rounded-full"></div>
                  <div className="bg-primary size-1 rounded-full"></div>
                  <div className="bg-secondary size-1 rounded-full"></div>
                  <div className="bg-accent size-1 rounded-full"></div>
                </div>
                <div className="w-32 truncate">{theme}</div>
                <Check
                  size={12}
                  strokeWidth={3}
                  className={`shrink-0 ${
                    currentTheme === theme ? "" : "invisible"
                  }`}
                />
              </button>
            </li>
          ))}
          <li></li>
          <li>
            <a href="/theme-generator/">
              <Wand size={16} className="mr-2" />
              <div className="grow text-sm font-bold">
                {t("Make your theme")}!
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeChanger;
