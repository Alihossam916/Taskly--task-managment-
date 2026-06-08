import React from "react";
import { ClassNameProp } from "@/src/types/propType";

const ProjectsIcon = ({ className }: ClassNameProp) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-slate-3 hover:text-primary-container focus:text-primary-container active:text-primary-container transition-color duration-200 ${className}`}
    >
      <path
        d="M0 8V0H8V8H0ZM0 18V10H8V18H0ZM10 8V0H18V8H10ZM10 18V10H18V18H10Z"
        fill="currentColor"
        fillOpacity={0.7}
      />
    </svg>
  );
};

export default ProjectsIcon;
