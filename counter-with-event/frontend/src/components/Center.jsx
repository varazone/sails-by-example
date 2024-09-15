import React from "react";

const Center = ({ children, className = "" }) => {
  const containerClasses = `
    w-full h-full flex items-center justify-center ${className}
  `;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

export default Center;
