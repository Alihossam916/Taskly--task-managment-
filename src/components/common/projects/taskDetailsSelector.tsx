import Select from "react-select";
// constants
import { statuses } from "@/src/constants/taskStatuses";
import { Task } from "@/src/types/projectType";

const statusColors: Record<string, string> = {
  IN_PROGRESS: "var(--color-primary)",
  DONE: "var(--color-success)",
  BLOCKED: "var(--color-error)",
};

const TaskDetailsSelector = ({ taskDetails }: { taskDetails: Task | null }) => {
  const currentStatus = taskDetails?.status ?? "";
  const hasStatusColor = currentStatus in statusColors;
  const bgColor = statusColors[currentStatus] || "var(--color-slate-1)";
  const isLightBg = currentStatus === "DONE" || !hasStatusColor;

  return (
    <Select
      options={statuses.map((s) => ({
        value: s,
        label: s.replace(/_/g, " "),
      }))}
      value={{
        value: currentStatus,
        label: currentStatus.replace(/_/g, " "),
      }}
      placeholder="Select status"
      isSearchable={false}
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: bgColor,
          borderColor: "transparent",
          boxShadow: "none",
          "&:hover": { borderColor: "transparent" },
          cursor: "pointer",
        }),
        singleValue: (base) => ({
          ...base,
          color: isLightBg ? "var(--color-slate-3)" : "white",
          fontWeight: 500,
        }),
        option: (base) => ({
          ...base,
          backgroundColor: "white",
          color: "var(--color-slate-2)",
          fontWeight: 500,
          cursor: "pointer",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: isLightBg ? "var(--color-slate-3)" : "white",
          "&:hover": { color: isLightBg ? "var(--color-slate-3)" : "white" },
        }),
        indicatorSeparator: () => ({ display: "none" }),
        menu: (base) => ({ ...base, zIndex: 60 }),
      }}
    />
  );
};

export default TaskDetailsSelector;
