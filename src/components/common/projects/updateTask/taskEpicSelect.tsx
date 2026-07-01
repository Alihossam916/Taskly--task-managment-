import { useEffect, useState, useId } from "react";

import Select from "react-select";

// react hook form
import { Controller, SubmitHandler, useFormContext } from "react-hook-form";

// schemas
import { UpdateTaskFormData } from "@/src/lib/schemas/updateTaskSchema";

// api
import { getAllProjectEpics } from "@/src/lib/api/projects/getAllProjectEpics";

// types
import { Epic } from "@/src/types/projectType";

interface TaskEpicProp {
  onSubmit: SubmitHandler<UpdateTaskFormData>;
  isLoading: boolean;
  projectId: string;
}

const TaskEpicSelect = ({ onSubmit, isLoading, projectId }: TaskEpicProp) => {
  const { handleSubmit, control, setValue } =
    useFormContext<UpdateTaskFormData>();

  const [epics, setEpics] = useState<Epic[]>([]);
  const selectInstanceId = useId();

  const epicOptions = epics.map((epic) => ({
    value: epic.id,
    label: `${epic.epic_id}`,
  }));

  useEffect(() => {
    async function fetchEpics() {
      try {
        const data = await getAllProjectEpics(projectId);
        if (data) {
          setEpics(data.epics);
        }
      } catch (error) {
        console.error("Error fetching epics:", error);
      }
    }
    fetchEpics();
  }, [projectId]);

  return (
    <Controller
      name="epic_id"
      control={control}
      render={({ field }) => (
        <Select
          isDisabled={isLoading}
          inputId="epic"
          instanceId={selectInstanceId}
          options={epicOptions}
          placeholder="No epic"
          value={epicOptions.find((opt) => opt.value === field.value) ?? null}
          onChange={(option) => {
            const newValue = option ? option.value : null;
            const currentValue = field.value;
            field.onChange(newValue);
            if (newValue !== currentValue) {
              setValue("epic_id", newValue);
              handleSubmit(onSubmit)();
            }
          }}
          isClearable
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
              ...base,
              border: "none",
              boxShadow: "none",
              "&:hover": { border: "none" },
            }),
          }}
        />
      )}
    />
  );
};

export default TaskEpicSelect;
