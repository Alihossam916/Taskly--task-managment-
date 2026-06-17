"use client";
import { useEffect, useState, useId } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import Select from "react-select";

// validation libraries
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// schemas
import { AddEpicFormData } from "@/src/lib/schemas/addEpicSchema";
import { addEpicSchema } from "@/src/lib/schemas/addEpicSchema";

// types
import { Epic } from "@/src/types/projectType";
import { Member } from "@/src/types/projectType";

// libs
import { formatDate } from "@/src/lib/utils/formatDate";
import { getInitials } from "@/src/lib/utils/initials";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";
import { editEpicApi } from "@/src/lib/api/projects/editEpic";

// components
import Button from "../../ui/button";
import Input from "../../ui/input";
import Textarea from "../../ui/textarea";

// icons
import EpicIdIcon from "../../icons/epicIdIcon";
import DateIcon from "../../icons/dateIcon";
import UnassignedIcon from "../../icons/unassignedIcon";
import EmptyTasksIcon from "../../icons/emptyTasksIcon";
import ValidationErrorIcon from "../../icons/validationErrorIcon";

interface EpicDetailsModalProps {
  epic: Epic;
  projectId: string;
  onClose: () => void;
}

interface MemberOption {
  value: string | null;
  label: string;
  initials: string;
  isUnassigned: boolean;
}

const EpicDetailsModal = ({
  epic,
  projectId,
  onClose,
}: EpicDetailsModalProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState({
    assignee: false,
    deadline: false,
  });
  const router = useRouter();
  const selectInstanceId = useId();

  //   initials
  const assigneeInitials = getInitials(epic.assignee?.name);
  const creatorInitials = getInitials(epic.created_by.name);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<AddEpicFormData>({
    resolver: zodResolver(addEpicSchema),
    defaultValues: {
      title: epic.title,
      description: epic.description || "No description provided",
      assignee_id: epic.assignee?.sub || "unassigned",
      deadline: epic.deadline || "",
    },
  });

  useEffect(() => {
    // Prevent scrolling
    document.body.style.overflow = "hidden";

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
  // refreshes the default values of the inputs after updating
  useEffect(() => {
    reset({
      title: epic.title,
      description: epic.description || "No description provided",
      assignee_id: epic.assignee?.sub || "unassigned",
      deadline: epic.deadline || "",
    });
  }, [epic, reset]);

  const memberOptions = [
    {
      value: "",
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

  // form submition logic
  const onSubmit: SubmitHandler<AddEpicFormData> = async (data) => {
    const payload = {
      epicId: epic.id,
      title: data.title,
      description: data.description ?? null,
      assignee_id: !data.assignee_id ? "unassigned" : data.assignee_id,
      deadline: data.deadline ?? null,
    };
    setIsLoading(true);
    try {
      await editEpicApi(payload);
      toast.success("Epic updated successfully!");
      setEditMode({
        assignee: false,
        deadline: false,
      });
      router.refresh();
    } catch {
      toast.error(`Failed to update epic. Please try again.`);
    } finally {
      setIsLoading(false); // resets the loading state after response
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        className="relative w-full max-w-3xl bg-white rounded-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Header */}
        <div className="relative p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <span className="flex gap-2 label-sm text-slate-2 rounded-xs">
              <EpicIdIcon />
              {epic.epic_id}
            </span>
            {/* Title and Description */}
            <Input
              {...register("title")}
              className="headline-lg text-2xl capitalize truncate w-full"
              variant="secondary"
              onBlur={(e) => {
                setValue("title", e.target.value); // sync value first
                handleSubmit(onSubmit)();
              }}
            />
            {errors.title && (
              <div className="flex items-center gap-2">
                <ValidationErrorIcon />
                <span className="text-red-600 text-sm">
                  {errors.title.message}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-slate-2 hover:text-error transition-colors p-2 cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <Textarea
            {...register("description")}
            className="body-md leading-relaxed w-full h-fit"
            variant="secondary"
            onBlur={(e) => {
              setValue("description", e.target.value); // sync value first
              handleSubmit(onSubmit)();
            }}
          />

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-6">
            {/* created by */}
            <div className="space-y-3">
              <p className="label-sm text-slate-1 uppercase">Created By</p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold">
                  {creatorInitials}
                </div>
                <div>
                  <h5 className="text-slate-3 body-md leading-none">
                    {epic.created_by?.name}
                  </h5>
                </div>
              </div>
            </div>

            {/* assignee */}
            <div className="space-y-3">
              <p className="label-sm text-slate-1 uppercase">Assignee</p>
              {!editMode.assignee ? (
                <div
                  onClick={() => {
                    setEditMode((prev) => ({ ...prev, assignee: true }));
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="size-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                    {assigneeInitials || <UnassignedIcon className="size-4" />}
                  </div>
                  <div>
                    <h5 className="text-slate-3 body-md leading-none">
                      {epic.assignee?.name || "Unassigned"}
                    </h5>
                  </div>
                </div>
              ) : (
                // make sure the value is added to the select as default value
                <Controller
                  name="assignee_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      inputId="assignee"
                      instanceId={selectInstanceId}
                      options={memberOptions}
                      // Finding the current value
                      value={
                        memberOptions.find(
                          (opt) => opt.value === field.value,
                        ) || memberOptions[0]
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      // Custom rendering for Options (Avatar + Name)
                      formatOptionLabel={(option: MemberOption) => (
                        <div className="flex items-center gap-2">
                          {/* Avatar / Initials Circle */}
                          <div className="size-7 rounded-full bg-primary-container/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                            {option.isUnassigned ? (
                              <UnassignedIcon />
                            ) : (
                              option.initials
                            )}
                          </div>
                          {/* User Name */}
                          <span className="body-md text-slate-3">
                            {option.label}
                          </span>
                        </div>
                      )}
                      onChange={(option) => {
                        field.onChange(option ? option.value : "");
                        handleSubmit(onSubmit)();
                      }}
                      isClearable
                      classNamePrefix="react-select"
                    />
                  )}
                />
              )}
            </div>

            {/* deadline */}
            <div className="space-y-3 sm:space-y-5">
              <p className="label-sm text-slate-1 uppercase">Deadline</p>
              {!editMode.deadline ? (
                <div
                  onClick={() => {
                    setEditMode((prev) => ({ ...prev, deadline: true }));
                  }}
                  className="flex items-center gap-3 text-slate-3 cursor-pointer"
                >
                  <DateIcon className="size-5" />
                  <span className="body-md font-medium">
                    {epic.deadline
                      ? formatDate(epic.deadline)
                      : "No deadline set"}
                  </span>
                </div>
              ) : (
                <Input
                  {...register("deadline")}
                  id="deadline"
                  type="date"
                  onClick={(e) => e.currentTarget.showPicker()}
                  onChange={(e) => {
                    setValue("deadline", e.target.value);
                    handleSubmit(onSubmit)();
                  }}
                  variant={errors.deadline ? "error" : "secondary"}
                />
              )}
            </div>

            {/* created at */}
            <div className="space-y-3">
              <p className="label-sm text-slate-1 uppercase">Created At</p>
              <div className="flex items-center gap-3 text-slate-3">
                <DateIcon className="size-5" />
                <span className="body-md font-medium">
                  {formatDate(epic.created_at)}
                </span>
              </div>
            </div>
          </div>
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="capitalize title-md">tasks</h4>
              <Button variant="secondary" className="capitalize">
                + add tasks
              </Button>
            </div>
            <div className="bg-surface-low flex flex-col items-center gap-6 rounded-lg p-10">
              <EmptyTasksIcon className="text-primary sm:text-slate-1 bg-surface-highest rounded-xl p-3 size-11" />
              <p className="title-md text-center">
                No tasks have been added to this epic yet
              </p>
              <Button className="capitalize">+ add tasks</Button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default EpicDetailsModal;
