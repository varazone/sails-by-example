import React, { useEffect } from "react";
import { themeChange } from "theme-change";
import { useTranslation } from "react-i18next"; // Assuming you're using react-i18next for translations
import { SwatchBook } from "lucide-react";

const ThemeSwitcher = (
  {
    themes,
    dropdownClasses = "",
    btnClasses = "btn-ghost",
    contentClasses = "mt-16",
  },
) => {
  const { t } = useTranslation();

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div
      title="Change Theme"
      className={`dropdown dropdown-end hidden [@supports(color:oklch(0%_0_0))]:block ${dropdownClasses}`}
    >
      <div tabIndex={0} role="button" className={`btn ${btnClasses}`}>
        <svg
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-5 w-5 stroke-current md:hidden"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <span className="hidden font-normal md:inline">
          {/*t("change-theme-btn")*/}
          <SwatchBook size={18} />
        </span>
        <svg
          width="12px"
          height="12px"
          className="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </div>
      <div
        tabIndex={0}
        className={`dropdown-content bg-base-200 text-base-content rounded-box top-px h-[28.6rem] max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5 ${contentClasses}`}
      >
        <div className="grid grid-cols-1 gap-3 p-3">
          {themes.map((theme) => (
            <button
              key={theme}
              className="outline-base-content text-start outline-offset-4"
              data-set-theme={theme}
              data-act-class="[&_svg]:visible"
            >
              <span
                data-theme={theme}
                className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
              >
                <span className="grid grid-cols-5 grid-rows-3">
                  <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="invisible h-3 w-3 shrink-0"
                    >
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                    </svg>
                    <span className="flex-grow text-sm">{theme}</span>
                    <span className="flex h-full shrink-0 flex-wrap gap-1">
                      <span className="bg-primary rounded-badge w-2" />
                      <span className="bg-secondary rounded-badge w-2" />
                      <span className="bg-accent rounded-badge w-2" />
                      <span className="bg-neutral rounded-badge w-2" />
                    </span>
                  </span>
                </span>
              </span>
            </button>
          ))}
          <a
            className="outline-base-content overflow-hidden rounded-lg"
            href="/theme-generator/"
          >
            <div className="hover:bg-neutral hover:text-neutral-content w-full cursor-pointer font-sans">
              <div className="flex gap-2 p-3">
                <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 512 512"
                >
                  <path d="M96,208H48a16,16,0,0,1,0-32H96a16,16,0,0,1,0,32Z" />
                  <line x1="90.25" y1="90.25" x2="124.19" y2="124.19" />
                  <path d="M124.19,140.19a15.91,15.91,0,0,1-11.31-4.69L78.93,101.56a16,16,0,0,1,22.63-22.63l33.94,33.95a16,16,0,0,1-11.31,27.31Z" />
                  <path d="M192,112a16,16,0,0,1-16-16V48a16,16,0,0,1,32,0V96A16,16,0,0,1,192,112Z" />
                  <line x1="293.89" y1="90.25" x2="259.95" y2="124.19" />
                  <path d="M260,140.19a16,16,0,0,1-11.31-27.31l33.94-33.95a16,16,0,0,1,22.63,22.63L271.27,135.5A15.94,15.94,0,0,1,260,140.19Z" />
                  <line x1="124.19" y1="259.95" x2="90.25" y2="293.89" />
                  <path d="M90.25,309.89a16,16,0,0,1-11.32-27.31l33.95-33.94a16,16,0,0,1,22.62,22.63l-33.94,33.94A16,16,0,0,1,90.25,309.89Z" />
                  <path d="M219,151.83a26,26,0,0,0-36.77,0l-30.43,30.43a26,26,0,0,0,0,36.77L208.76,276a4,4,0,0,0,5.66,0L276,214.42a4,4,0,0,0,0-5.66Z" />
                  <path d="M472.31,405.11,304.24,237a4,4,0,0,0-5.66,0L237,298.58a4,4,0,0,0,0,5.66L405.12,472.31a26,26,0,0,0,36.76,0l30.43-30.43h0A26,26,0,0,0,472.31,405.11Z" />
                </svg>
                <div className="flex-grow text-sm font-bold">
                  {t("Make your theme")}!
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
