import { ClassNameProp } from "@/src/types/propType";

const BoardViewIcon = ({ className }: ClassNameProp) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      <path
        d="M0 6V0H6V6H0ZM0 13.5V7.5H6V13.5H0ZM7.5 6V0H13.5V6H7.5ZM7.5 13.5V7.5H13.5V13.5H7.5ZM1.5 4.5H4.5V1.5H1.5V4.5ZM9 4.5H12V1.5H9V4.5ZM9 12H12V9H9V12ZM1.5 12H4.5V9H1.5V12Z"
        fill="#041B3C"
      />
    </svg>
  );
};

export default BoardViewIcon;
