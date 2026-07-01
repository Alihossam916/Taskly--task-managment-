import { useEffect, useState, useId } from "react";

import Select from "react-select";
import { Controller, SubmitHandler, useFormContext } from "react-hook-form";

import { UpdateTaskFormData } from "@/src/lib/schemas/updateTaskSchema";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";
import { getInitials } from "@/src/lib/utils/initials";
import { Member } from "@/src/types/projectType";
import UnassignedIcon from "@/src/components/icons/unassignedIcon";

interface TaskAssigneeProp {
  onSubmit: SubmitHandler<UpdateTaskFormData>;
  isLoading: boolean;
  projectId: string;
}

interface MemberOption {
  value: string | null;
  label: string;
  initials: string;
  isUnassigned: boolean;
}

const TaskAssigneeSelect = ({
  onSubmit,
  isLoading,
  projectId,
}: TaskAssigneeProp) => {
  const { handleSubmit, control } = useFormContext<UpdateTaskFormData>();
  const [members, setMembers] = useState<Member[]>([]);
  const selectInstanceId = useId();

  const memberOptions: MemberOption[] = [
    {
      value: "Unassigned",
      label: "Unassigned",
      initials: "UN",
      isUnassigned: true,
    },
    ...members.map((m) => ({
      value: m.user_id,
      label: m.metadata.name,
      initials: getInitials(m.metadata.name) || "??",
      isUnassigned: false,
    })),
  ];

  useEffect(() => {
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
    <Controller
      name="assignee_id"
      control={control}
      render={({ field }) => (
        <Select
          isDisabled={isLoading}
          inputId="assignee"
          instanceId={selectInstanceId}
          options={memberOptions}
          value={
            memberOptions.find((opt) => opt.value === field.value) ||
            memberOptions[0]
          }
          onBlur={field.onBlur}
          name={field.name}
          formatOptionLabel={(option: MemberOption) => (
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-primary-container/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                {option.isUnassigned ? <UnassignedIcon /> : option.initials}
              </div>
              <span className="body-md text-slate-3">{option.label}</span>
            </div>
          )}
          onChange={(option) => {
            const newValue = option ? option.value : null;
            const currentValue = field.value;
            field.onChange(newValue);

            if (newValue !== currentValue) {
              handleSubmit(onSubmit)();
            }
          }}
          styles={{
            control: (base) => ({
              ...base,
              border: "none",
              boxShadow: "none",
              "&:hover": { border: "none" },
            }),
          }}
          isClearable
          classNamePrefix="react-select"
        />
      )}
    />
  );
};

export default TaskAssigneeSelect;
