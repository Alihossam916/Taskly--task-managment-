import { useEffect, useState, useId } from "react";

import Select from "react-select";

// react hook form
import { Controller, useFormContext } from "react-hook-form";

// schemas
import { AddTaskFormData } from "@/src/lib/schemas/addTaskSchema";

// libs
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

// types
import { Member } from "@/src/types/projectType";

const TaskAssigneeSelect = ({ projectId }: { projectId: string }) => {
  const { control } = useFormContext<AddTaskFormData>();
  const [members, setMembers] = useState<Member[]>([]);
  const selectInstanceId = useId();

  const memberOptions = members.map((member) => ({
    value: member.user_id,
    label: member.metadata.name,
  }));

  useEffect(() => {
    // Fetch members
    const fetchMembers = async () => {
      try {
        const data = await getProjectMembers(projectId);
        if (data) setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, [projectId]);

  return (
    <div className="flex flex-col gap-2 w-full sm:w-1/2">
      <label
        htmlFor="assignee"
        className="flex w-3/5 items-start uppercase label-sm text-slate-2"
      >
        assignee
      </label>
      <div className="w-full space-y-2">
        <Controller
          name="assignee_id"
          control={control}
          render={({ field }) => (
            <Select
              inputId="assignee"
              instanceId={selectInstanceId}
              options={memberOptions}
              placeholder="Select Team Member"
              value={
                memberOptions.find((opt) => opt.value === field.value) ?? null
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

export default TaskAssigneeSelect;
