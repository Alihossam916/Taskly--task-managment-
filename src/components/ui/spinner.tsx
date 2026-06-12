import { ClassNameProp } from "@/src/types/propType";

export default function Spinner({ className }: ClassNameProp) {
  return (
    <div
      className={`size-6 animate-spin rounded-full border-4 border-white border-t-transparent ${className}`}
    ></div>
  );
}
