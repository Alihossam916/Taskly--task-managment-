import React from "react";
import { ClassNameProp } from "@/src/types/propType";

const TasksIcon = ({ className }: ClassNameProp) => {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-slate-3 hover:text-primary-container focus:text-primary-container active:text-primary-container transition-color duration-200 ${className}`}
    >
      <path
        d="M3.55 15.075L0 11.525L1.4 10.125L3.525 12.25L7.775 8L9.175 9.425L3.55 15.075ZM3.55 7.075L0 3.525L1.4 2.125L3.525 4.25L7.775 0L9.175 1.425L3.55 7.075ZM11 13.075V11.075H20V13.075H11ZM11 5.075V3.075H20V5.075H11Z"
        fill="currentColor"
        fillOpacity="0.7"
      />
    </svg>
  );
};

export default TasksIcon;
