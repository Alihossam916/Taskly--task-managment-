import { useEffect, useState, useId } from "react";

import Select from "react-select";

// react hook form
import { Controller, SubmitHandler, useFormContext } from "react-hook-form";

// schemas
import { AddEpicFormData } from "@/src/lib/schemas/addEpicSchema";

// libs
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

// utils
import { getInitials } from "@/src/lib/utils/initials";

// types
import { Member } from "@/src/types/projectType";

// icons
import UnassignedIcon from "@/src/components/icons/unassignedIcon";

interface EpicDescriptionProp {
  onSubmit: SubmitHandler<{
    title: string;
    description: string | null;
    deadline: string | null;
    assignee_id?: string | null | undefined;
  }>;
  isLoading: boolean;
  projectId: string;
}

interface MemberOption {
  value: string | null;
  label: string;
  initials: string;
  isUnassigned: boolean;
}

const EpicAssigneeSelect = ({
  onSubmit,
  isLoading,
  projectId,
}: EpicDescriptionProp) => {
  const { handleSubmit, control } = useFormContext<AddEpicFormData>();

  const [members, setMembers] = useState<Member[]>([]);
  const selectInstanceId = useId();

  const memberOptions = [
    {
      value: "unassigned",
      label: "Unassigned",
      initials: "UN",
      isUnassigned: true,
    },
    ...members.map((m) => ({
      value: m.user_id,
      label: m.metadata.name,
      initials: getInitials(m.metadata.name) || "??", // Ensure this property exists
      isUnassigned: false,
    })),
  ];

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
    <>
      <Controller
        name="assignee_id"
        control={control}
        render={({ field }) => (
          <Select
            isDisabled={isLoading}
            inputId="assignee"
            instanceId={selectInstanceId}
            options={memberOptions}
            // Finding the current value
            value={
              memberOptions.find((opt) => opt.value === field.value) ||
              memberOptions[0]
            }
            onBlur={field.onBlur}
            name={field.name}
            // Custom rendering for Options (Avatar + Name)
            formatOptionLabel={(option: MemberOption) => (
              <div className="flex items-center gap-2">
                {/* Avatar / Initials Circle */}
                <div className="size-7 rounded-full bg-primary-container/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                  {option.isUnassigned ? <UnassignedIcon /> : option.initials}
                </div>
                {/* User Name */}
                <span className="body-md text-slate-3">{option.label}</span>
              </div>
            )}
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
    </>
  );
};

export default EpicAssigneeSelect;
