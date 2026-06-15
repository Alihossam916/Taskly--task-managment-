"use client";
import { useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import Select from "react-select";

// components
import Input from "../../ui/input";
import Button from "../../ui/button";
import Textarea from "../../ui/textarea";
import Spinner from "../../ui/spinner";

// api
import { addEpicApi } from "@/src/lib/api/projects/addEpic";

// validation libraries
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// schemas
import { AddEpicFormData } from "@/src/lib/schemas/addEpicSchema";
import { addEpicSchema } from "@/src/lib/schemas/addEpicSchema";

// icons
import ValidationErrorIcon from "../../icons/validationErrorIcon";

// types
import { Member } from "@/src/types/projectType";

interface AddEpicProp {
  members: Member[];
  projectId: string;
}

const AddNewEpic = ({ members, projectId }: AddEpicProp) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const selectInstanceId = useId();
  const project_id = projectId;

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<AddEpicFormData>({ resolver: zodResolver(addEpicSchema) });

  const description = watch("description");

  const memberOptions = members.map((member) => ({
    value: member.user_id,
    label: member.metadata.name,
  }));

  // form submition logic
  const onSubmit: SubmitHandler<AddEpicFormData> = async (data) => {
    const payload = {
      title: data.title,
      description: data.description ?? null,
      assignee_id: data.assignee_id ?? null,
      project_id,
      deadline: data.deadline ?? null,
    };
    setIsLoading(true);
    try {
      await addEpicApi(payload, project_id);
      toast.success("Epic created successfully!");
      reset();
      router.push(`/project/${projectId}/epics`);
    } catch {
      toast.error(`Failed to create epic: ${errors}`);
    } finally {
      setIsLoading(false); // resets the loading state after response
    }
  };

  return (
    <div className="sm:bg-white w-full mx-auto rounded-lg my-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 sm:p-8">
        <div className="space-y-10">
          {/* title field */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <label
              htmlFor="title"
              className="flex w-3/5 items-start uppercase label-sm text-slate-2"
            >
              title <span className="text-error">*</span>
            </label>
            <div className="w-full space-y-2">
              <Input
                {...register("title")}
                id="title"
                type="text"
                placeholder="Enter project title"
                variant={errors.title ? "error" : "primary"}
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
          </div>
          {/* description field */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <label
              htmlFor="email"
              className="flex flex-col w-3/5 items-start uppercase label-sm text-slate-2"
            >
              <span>description</span>
              <span className="text-slate-1 capitalize">optional</span>
            </label>
            <div className="w-full">
              <Textarea
                {...register("description")}
                id="email"
                placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                variant={errors.description ? "error" : "primary"}
                className="w-full"
              />
              <div className="flex flex-col sm:flex-row justify-between items-center">
                {errors.description && (
                  <div className="flex items-center gap-2">
                    <ValidationErrorIcon />
                    <span className="text-red-600 text-sm">
                      {errors.description.message}
                    </span>
                  </div>
                )}
                <p className="hidden sm:block text-slate-2 ml-auto">
                  {description?.length} / 500 characters
                </p>
              </div>
            </div>
          </div>
          {/* assignee and deadline fields */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-10 w-full">
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
                      placeholder="Select a member..."
                      value={
                        memberOptions.find(
                          (opt) => opt.value === field.value,
                        ) ?? null
                      }
                      onChange={(option) =>
                        field.onChange(option ? option.value : "")
                      }
                      isClearable
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#D7E2FF",
                          borderRadius: "0.75rem",
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
                />{" "}
                {errors.assignee_id && (
                  <div className="flex items-center gap-2">
                    <ValidationErrorIcon />
                    <span className="text-red-600 text-sm">
                      {errors.assignee_id.message}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <label
                htmlFor="deadline"
                className="flex w-3/5 items-start uppercase label-sm text-slate-2"
              >
                deadline
              </label>
              <div className="w-full space-y-2">
                <Input
                  {...register("deadline")}
                  id="deadline"
                  type="date"
                  placeholder="Enter project title"
                  onClick={(e) => e.currentTarget.showPicker()}
                  variant={errors.deadline ? "error" : "primary"}
                />
                {errors.deadline && (
                  <div className="flex items-center gap-2">
                    <ValidationErrorIcon />
                    <span className="text-red-600 text-sm">
                      {errors.deadline.message}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-8 justify-end items-center">
          <Link href={"/project"} className="w-full sm:w-fit">
            <Button
              variant="ghost"
              className="hover:bg-slate-1 w-full sm:w-fit"
            >
              Cancel
            </Button>
          </Link>
          <Button
            disabled={isLoading}
            className={`capitalize w-full sm:w-48 rounded-xs! flex items-center justify-center gap-2 text-center ${isLoading && `opacity-70 cursor-not-allowed!`}`}
          >
            {isLoading && <Spinner />}
            <span>create epic</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNewEpic;
