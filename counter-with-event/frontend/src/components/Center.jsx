import React from "react";

const Center = ({ children, fullScreen = false }) => {
  const containerClasses = `
    flex items-center justify-center
    ${fullScreen ? "min-h-screen" : "h-full w-full"}
  `;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

export default Center;
