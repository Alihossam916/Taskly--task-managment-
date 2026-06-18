import { useEffect, useState, useId } from "react";
import Select from "react-select";

// react hook form
import { Controller, useFormContext } from "react-hook-form";

// libs
import { AddTaskFormData } from "@/src/lib/schemas/addTaskSchema";

// api
import { getAllProjectEpics } from "@/src/lib/api/projects/getAllProjectEpics";

// types
import { Epic } from "@/src/types/projectType";

const TaskEpicSelect = ({
  projectId,
  defaultEpicId,
  defaultEpicTitle,
}: {
  projectId: string;
  defaultEpicId?: string | null;
  defaultEpicTitle?: string | null;
}) => {
  const { control, setValue } = useFormContext<AddTaskFormData>();
  const selectInstanceId = useId();
  const [epics, setEpics] = useState<Epic[]>([]);

  useEffect(() => {
    async function fetchEpics() {
      try {
        const data = await getAllProjectEpics(projectId);
        if (data) {
          setEpics(data.epics);

          // Once epics are loaded, apply the default if provided and valid
          if (defaultEpicId) {
            const exists = data.epics.some(
              (epic) => epic.epic_id === defaultEpicId,
            );
            if (exists) {
              setValue("epic_id", defaultEpicId, { shouldValidate: true });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching epics:", error);
      }
    }
    fetchEpics();
  }, [projectId, defaultEpicId, setValue]);

  const epicOptions = epics.map((epic) => ({
    value: epic.id,
    label: `${epic.epic_id} ${epic.title.length > 100 ? epic.title.slice(0, 100) + "..." : epic.title}`,
  }));

  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor="epic"
        className="flex w-3/5 items-start uppercase label-sm text-slate-2"
      >
        Epic
      </label>
      <div className="w-full space-y-2">
        <Controller
          name="epic_id"
          control={control}
          render={({ field }) => (
            <Select
              inputId="epic"
              instanceId={selectInstanceId}
              options={epicOptions}
              placeholder="Select Epic Link"
              value={
                epicOptions.find((opt) => opt.value === field.value) ??
                (field.value
                  ? {
                      value: field.value,
                      label: defaultEpicTitle
                        ? `${field.value} ${defaultEpicTitle}`
                        : field.value,
                    }
                  : null)
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

export default TaskEpicSelect;
