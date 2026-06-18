"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "react-toastify";

// components
import Button from "../../ui/button";
import Spinner from "../../ui/spinner";
import TaskTitleInput from "./addTask/taskTitleInput";
import TaskDescription from "./addTask/taskDescription";
import TaskAssigneeSelect from "./addTask/taskAssigneeSelect";
import TaskDeadlineInput from "./addTask/taskDeadlineInput";
import TaskStatusSelect from "./addTask/taskStatusSelect";
import TaskEpicSelect from "./addTask/taskEpicSelect";

// api
import { addTaskApi } from "@/src/lib/api/projects/addTask";

// validation libraries
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// schemas
import { addTaskSchema } from "@/src/lib/schemas/addTaskSchema";
import { AddTaskFormData } from "@/src/lib/schemas/addTaskSchema";

const AddNewTask = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const project_id = projectId;

  const epic_id = searchParams.get("epic_id");
  const epic_title = searchParams.get("epic_title");

  const methods = useForm<AddTaskFormData>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      status: "TO_DO",
      epic_id,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  // form submition logic
  const onSubmit: SubmitHandler<AddTaskFormData> = async (data) => {
    const payload = {
      project_id,
      title: data.title,
      status: data.status ?? "TO_DO",
      assignee_id: data.assignee_id ?? null,
      epic_id: epic_id ? epic_id : (data.epic_id ?? null),
      due_date: data.due_date ?? null,
      description: data.description ?? null,
    };
    setIsLoading(true);
    try {
      await addTaskApi(payload, project_id);
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
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 sm:p-8">
          <div className="space-y-10">
            {/* title field */}
            <TaskTitleInput />

            {/* assignee and status fields */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-10 w-full">
              <TaskStatusSelect />
              <TaskAssigneeSelect projectId={projectId} />
            </div>

            {/* epic field */}
            <TaskEpicSelect
              projectId={projectId}
              defaultEpicId={epic_id}
              defaultEpicTitle={epic_title}
            />

            {/* deadline field */}
            <TaskDeadlineInput />

            {/* description field */}
            <TaskDescription />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-8 justify-end items-center">
            <Link href={"/project"} className="w-full sm:w-fit">
              <Button
                variant="ghost"
                className="hover:bg-slate-1 w-full sm:w-fit"
              >
                Back
              </Button>
            </Link>
            <Button
              disabled={isLoading}
              className={`capitalize w-full sm:w-48 rounded-xs! flex items-center justify-center gap-2 text-center ${isLoading && `opacity-70 cursor-not-allowed!`}`}
            >
              {isLoading && <Spinner />}
              <span>create task</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddNewTask;
