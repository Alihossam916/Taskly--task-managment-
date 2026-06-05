import React from "react";

const ProjectEpicsIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-slate-3 hover:text-primary-container focus:text-primary-container active:text-primary-container transition-color duration-200 ${className}`}
    >
      <path
        d="M13 18V15H9V5H7V8H0V0H7V3H13V0H20V8H13V5H11V13H13V10H20V18H13ZM2 2V6V2ZM15 12V16V12ZM15 2V6V2ZM15 6H18V2H15V6ZM15 16H18V12H15V16ZM2 6H5V2H2V6Z"
        fill="currentColor"
        fillOpacity="0.7"
      />
    </svg>
  );
};

export default ProjectEpicsIcon;
