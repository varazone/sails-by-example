import React from "react";

const Footer = () => {
  return (
    <footer className="py-4 text-center text-sm text-base-content">
      <a href="https://github.com/varazone/scaffold-sails" target="_blank" rel="noopener noreferrer" className="link link-primary">
        Fork me
      </a>
      <span className="mx-2">·</span>
      <span>
        Built with ❤️ at <a href="https://github.com/varazone" target="_blank" rel="noopener noreferrer" className="link link-primary">🏰 VaraZone</a>
      </span>
      <span className="mx-2">·</span>
      <a href="https://github.com/varazone/scaffold-sails/issues" target="_blank" rel="noopener noreferrer" className="link link-primary">
        Support
      </a>
    </footer>
  );
};

export default Footer;