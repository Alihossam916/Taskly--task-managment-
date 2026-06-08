"use client";
import { useState } from "react";
import { toast } from "react-toastify";

// icons
import NewProjectIcon from "../../icons/newProjectIcon";

// components
import Input from "../../ui/input";
import Button from "../../ui/button";

// api
import { addProjectApi } from "@/src/lib/api/projects/addProject";

// validation libraries
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// schemas
import { addProjectSchema } from "@/src/lib/schemas/addProjectSchema";

// types
import { AddProjectFormData } from "@/src/lib/schemas/addProjectSchema";
import Link from "next/link";
import ProTipIcon from "../../icons/proTipIcon";
import Textarea from "../../ui/textarea";
import ValidationErrorIcon from "../../icons/validationErrorIcon";

const AddNewProject = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AddProjectFormData>({ resolver: zodResolver(addProjectSchema) });

  const description = watch("description");

  // form submition logic
  const onSubmit: SubmitHandler<AddProjectFormData> = async (data) => {
    setIsLoading(true);
    try {
      await addProjectApi(data);
      toast.success("Project created successfully!");
      reset();
    } catch {
      toast.error(`Failed to create project: ${errors}`);
    } finally {
      setIsLoading(false); // resets the loading state after response
    }
  };

  return (
    <div className="sm:bg-white w-fit mx-auto rounded-lg mt-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 sm:p-8">
        <div className="flex items-center gap-4">
          <NewProjectIcon className="bg-primary-container/10 size-10 p-2 rounded-xs hidden sm:block" />
          <div className="flex flex-col">
            <h3 className="font-semibold text-2xl">Initialize New Project</h3>
            <p className="text-slate-2">
              Define the scope and foundational details of your project.
            </p>
          </div>
        </div>
        <div className="space-y-10">
          {/* name field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="uppercase label-sm text-slate-2">
              project title <span className="text-error">*</span>
            </label>
            <Input
              {...register("name")}
              id="name"
              type="text"
              placeholder="Enter project title"
              required
              variant={errors.name ? "error" : "primary"}
            />
            {errors.name && (
              <div className="flex items-center gap-2">
                <ValidationErrorIcon />
                <span className="text-red-600 text-sm">
                  {errors.name.message}
                </span>
              </div>
            )}
          </div>
          {/* email field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="uppercase label-sm text-slate-2 flex justify-between items-center"
            >
              <span>description</span>
              <span className="text-slate-1 capitalize">optional</span>
            </label>
            <Textarea
              {...register("description")}
              id="email"
              placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
              required
              variant={errors.name ? "error" : "primary"}
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
              <p className="text-slate-2 ml-auto">
                {description?.length} / 500 characters
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 justify-between items-center">
          <Link href={"/project"} className="w-full sm:w-fit">
            <Button
              variant="ghost"
              className="hover:bg-slate-1 w-full sm:w-fit"
            >
              Back
            </Button>
          </Link>
          <Button className="capitalize w-full sm:w-48 rounded-xs!">
            create project
          </Button>
        </div>
      </form>
      <p className="w-fit mx-auto flex flex-col sm:flex-row sm:items-center gap-2 bg-surface-low text-slate-2 label-sm p-4">
        <ProTipIcon className="hidden sm:block" />
        <span className="font-bold">Pro Tip:</span> You can invite project
        members and assign epics immediately after the initial creation process.
      </p>
    </div>
  );
};

export default AddNewProject;
