import { ClassNameProp } from "@/src/types/propType";

const WarningIcon = ({ className }: ClassNameProp) => {
  return (
    <svg
      width="11"
      height="10"
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      <path
        d="M0 9.5L5.5 0L11 9.5H0ZM1.725 8.5H9.275L5.5 2L1.725 8.5ZM5.5 8C5.64167 8 5.76042 7.95208 5.85625 7.85625C5.95208 7.76042 6 7.64167 6 7.5C6 7.35833 5.95208 7.23958 5.85625 7.14375C5.76042 7.04792 5.64167 7 5.5 7C5.35833 7 5.23958 7.04792 5.14375 7.14375C5.04792 7.23958 5 7.35833 5 7.5C5 7.64167 5.04792 7.76042 5.14375 7.85625C5.23958 7.95208 5.35833 8 5.5 8ZM5 6.5H6V4H5V6.5Z"
        fill="#BA1A1A"
      />
    </svg>
  );
};

export default WarningIcon;
