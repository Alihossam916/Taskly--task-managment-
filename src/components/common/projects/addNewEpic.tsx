"use client";
import { useState } from "react";
import Link from "next/link";

import { toast } from "react-toastify";

// components
import Input from "../../ui/input";
import Button from "../../ui/button";
import Textarea from "../../ui/textarea";
import Spinner from "../../ui/spinner";

// api
import { addEpicApi } from "@/src/lib/api/projects/addEpic";

// validation libraries
import { useForm, SubmitHandler } from "react-hook-form";
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
  const [isLoading, setIsLoading] = useState(false);
  const project_id = projectId;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AddEpicFormData>({ resolver: zodResolver(addEpicSchema) });

  const description = watch("description");

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
                required
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
                <select
                  {...register("assignee_id")}
                  id="assignee"
                  defaultValue={""}
                  className="w-full px-4 py-4 sm:py-3 font-medium rounded-xl sm:rounded-sm transition-all outline-none bg-[#D7E2FF] text-[#6B7280] focus:ring-2 focus:ring-primary-container cursor-pointer invalid:text-gray-400"
                >
                  <option value="" disabled hidden>
                    Select a member...
                  </option>
                  {members.map((member, index) => {
                    return (
                      <option key={index} value={member.user_id}>
                        {member.metadata.name}
                      </option>
                    );
                  })}
                </select>
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
