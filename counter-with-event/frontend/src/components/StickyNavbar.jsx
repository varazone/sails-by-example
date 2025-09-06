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
import { Link, useLocation } from "react-router-dom";
import Connector from "./Connector";
// import ThemeSwitcher from "./ThemeSwitcher";
import ThemeChanger from "./ThemeChanger";
import WalletSelector from "./WalletSelector";
// import { Menu } from "lucide-react";
import { Bug, Gift, Globe, Globe2, Hash, Menu, MessageSquare, Sailboat } from "lucide-react";

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
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

const StickyNavbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <div className="navbar bg-base-500 sticky top-0 z-10 md:flex md:flex-row w-full">
      <div className="flex-none">
        <button
          className="btn btn-square btn-ghost md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
      </div>
      <div className="flex-1 hidden sm:block">
        <Link to="/" className="btn btn-ghost">
          <div className="bg-black/75 rounded-lg p-1">
            <Sailboat size={32} className="text-white" />
          </div>
          <br />
          <p className="normal-case text-xl">
            Scaffold-Sails
          </p>
        </Link>
      </div>
      <div className="flex-1 hidden md:flex md:flex-row justify-center">
        <Link
          to="/debug"
          className={`btn btn-ghost ${
            isActive("/debug") ? "btn-active" : ""
          }`}
        >
          <Bug size={20} />
          <span className="hidden lg:inline">Debug</span>
        </Link>
      </div>
      <div className="flex-1 hidden md:flex md:flex-row md:gap-2">
        <Link
          to="/chat"
          className={`btn btn-ghost ${
            isActive("/chat") ? "btn-active" : ""
          }`}
        >
          <MessageSquare size={20} />
          <span className="hidden lg:inline">Chat</span>
        </Link>
        <Link
          to="/counter"
          className={`btn btn-ghost ${
            isActive("/counter") ? "btn-active" : ""
          }`}
        >
          <Hash size={20} />
          <span className="hidden lg:inline">Counter</span>
        </Link>
        <Link
          to="/dns"
          className={`btn btn-ghost ${isActive("/dns") ? "btn-active" : ""}`}
        >
          <Globe2 size={20} />
          <span className="hidden lg:inline">DNS</span>
        </Link>
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
