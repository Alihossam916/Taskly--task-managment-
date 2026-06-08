import React from "react";
import { ClassNameProp } from "@/src/types/propType";

const ExpandIcon = ({ className }: ClassNameProp) => {
  return (
    <svg
      width="12"
      height="20"
      viewBox="0 0 12 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      <path
        d="M1.78301 6.16699e-06L11.7787 10.0043L1.77442 20L0.000178955 18.2242L8.22871 10.0028L0.00725113 1.77424L1.78301 6.16699e-06Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ExpandIcon;
