import { Fragment, useState } from "react";
import { useTheme } from "next-themes";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme == "dark" ? "light" : "dark");
  }

  return (
    <header>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between py-6"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 text-3xl tracking-wide font-extrabold">
          SVG to PNG
        </div>

        <div className="flex flex-1 justify-end items-center">
          <a href="https://github.com/forbrace/svg-to-png">
            <svg
              className="block mx-auto"
              height="32"
              aria-hidden="true"
              viewBox="0 0 16 16"
              version="1.1"
              width="32"
              data-view-component="true"
            >
              <path
                d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
                fill="currentColor"
              ></path>
            </svg>
          </a>
          <div className="flex items-center ml-4 relative">
            <label
              htmlFor="theme"
              className="flex justify-between items-center w-12 h-6 rounded-2xl px-2 relative label bg-black dark:bg-white cursor-pointer text-white dark:text-black"
              tabIndex={0}
              onClick={toggleTheme}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.key === " " && event.preventDefault();
                  toggleTheme();
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>

              <span
                className={`w-4 h-4 absolute bg-white dark:bg-black left-1 dark:left-auto dark:right-1 top-1 transition-all rounded-full`}
              />
            </label>
          </div>
        </div>
      </nav>
    </header>
  );
}
