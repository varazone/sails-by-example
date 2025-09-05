/*
import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const StickyNavbar = () => {
  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 shadow-md">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Gear dApp Template</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><a>Home</a></li>
          <li><a>About</a></li>
          <li><a>Contact</a></li>
        </ul>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default StickyNavbar;
*/
import React, { useState } from "react";
import Connector from "./Connector";
// import ThemeSwitcher from "./ThemeSwitcher";
import ThemeChanger from "./ThemeChanger";
import WalletSelector from "./WalletSelector";
// import { Menu } from "lucide-react";
import { Globe, Menu, Sailboat } from "lucide-react";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

const StickyNavbar = ({ toggleSidebar }) => {
  return (
    <div className="navbar bg-base-500 sticky top-0 z-10">
      <div className="flex-none">
        <button
          className="btn btn-square btn-ghost md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
      </div>
      <div className="flex-1 hidden sm:block">
        <a
          href="https://github.com/varazone/scaffold-sails"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          <Sailboat size={32} />
          <br />
          <p className="normal-case text-xl">
            Scaffold-Sails
          </p>
        </a>
      </div>
      <div className="hidden md:flex md:block">
        <Connector />
        <WalletSelector />
        <ThemeChanger themes={themes} />
      </div>
    </div>
  );
};

export default StickyNavbar;
