import { useId } from "react";

import Select from "react-select";

// react hook form
import { Controller, useFormContext } from "react-hook-form";

// schemas
import { AddTaskFormData } from "@/src/lib/schemas/addTaskSchema";


const TaskStatusSelect = () => {
  const { control } = useFormContext<AddTaskFormData>();
  const selectInstanceId = useId();

  const statusOptions = [
    { value: "TO_DO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "BLOCKED", label: "Blocked" },
    { value: "IN_REVIEW", label: "In Review" },
    { value: "READY_FOR_QA", label: "Ready for QA" },
    { value: "REOPENED", label: "Reopened" },
    { value: "READY_FOR_PRODUCTION", label: "Ready for Production" },
    { value: "DONE", label: "Done" },
  ];

  return (
    <div className="flex flex-col gap-2 w-full sm:w-1/2">
      <label
        htmlFor="status"
        className="flex w-3/5 items-start uppercase label-sm text-slate-2"
      >
        Status <span className="text-error">*</span>
      </label>
      <div className="w-full space-y-2">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              inputId="status"
              instanceId={selectInstanceId}
              options={statusOptions}
              placeholder="Select a member..."
              value={
                statusOptions.find((opt) => opt.value === field.value) ?? null
              }
              onChange={(option) => field.onChange(option ? option.value : "")}
              isClearable
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "#D7E2FF",
                  borderRadius: "0.25rem",
                  border: "none",
                  padding: "0.25rem",
                  boxShadow: state.isFocused
                    ? "0 0 0 2px var(--color-primary-container)"
                    : "none",
                  cursor: "pointer",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#6B7280",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "black",
                  fontWeight: 500,
                }),
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default TaskStatusSelect;
