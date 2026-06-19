import { ClassNameProp } from "@/src/types/propType";

const FilterIcon = ({ className }: ClassNameProp) => {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      <path d="M7 12V10H11V12H7ZM3 7V5H15V7H3ZM0 2V0H18V2H0Z" />
    </svg>
  );
};

export default FilterIcon;
