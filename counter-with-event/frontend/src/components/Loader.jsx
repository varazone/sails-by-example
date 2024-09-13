import React from "react";

const Loader = ({ size = "md", color = "primary" }) => {
  const sizeClasses = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  return (
    <span
      className={`loading loading-spinner ${sizeClasses[size]} text-${color}`}
    >
    </span>
  );
};

export default Loader;
