import { ClassNameProp } from "@/src/types/propType";

const CloseIcon = ({ className }: ClassNameProp) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${className}`}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
};

export default CloseIcon;
