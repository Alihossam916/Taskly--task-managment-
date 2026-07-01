import { useId } from "react";

import Select from "react-select";

// react hook form
import { Controller, SubmitHandler, useFormContext } from "react-hook-form";

// schemas
import { UpdateTaskFormData } from "@/src/lib/schemas/updateTaskSchema";

// constants
import { statuses } from "@/src/constants/taskStatuses";

interface TaskStatusProp {
  onSubmit: SubmitHandler<UpdateTaskFormData>;
  isLoading: boolean;
}

const statusColors: Record<string, string> = {
  IN_PROGRESS: "var(--color-primary)",
  DONE: "var(--color-success)",
  BLOCKED: "var(--color-error)",
};

const TaskStatusSelect = ({ onSubmit, isLoading }: TaskStatusProp) => {
  const { handleSubmit, control } = useFormContext<UpdateTaskFormData>();
  const selectInstanceId = useId();

  const statusOptions = statuses.map((s) => ({
    value: s,
    label: s.replace(/_/g, " "),
  }));

  return (
    <Controller
      name="status"
      control={control}
      render={({ field }) => {
        const currentStatus = field.value ?? "";
        const hasStatusColor = currentStatus in statusColors;
        const bgColor = statusColors[currentStatus] || "var(--color-slate-1)";
        const isLightBg = currentStatus === "DONE" || !hasStatusColor;

        return (
          <Select
            isDisabled={isLoading}
            inputId="status"
            instanceId={selectInstanceId}
            options={statusOptions}
            isSearchable={false}
            value={
              statusOptions.find((opt) => opt.value === field.value) ?? null
            }
            onChange={(option) => {
              const newValue = option ? option.value : "";
              const currentValue = field.value;
              field.onChange(newValue);
              if (newValue !== currentValue) {
                handleSubmit(onSubmit)();
              }
            }}
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
                "&:hover": {
                  color: isLightBg ? "var(--color-slate-3)" : "white",
                },
              }),
              indicatorSeparator: () => ({ display: "none" }),
              menu: (base) => ({ ...base, zIndex: 60 }),
            }}
          />
        );
      }}
    />
  );
};

export default TaskStatusSelect;
