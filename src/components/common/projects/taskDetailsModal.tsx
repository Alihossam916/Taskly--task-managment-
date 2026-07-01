"use client";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";

// components
import Button from "../../ui/button";
import TaskDetailsModalSkeleton from "./taskDetailsModalSkeleton";
import TaskTitleInput from "./updateTask/taskTitleInput";
import TaskDescription from "./updateTask/taskDescription";
import TaskStatusSelect from "./updateTask/taskStatusSelect";
import TaskAssigneeSelect from "./updateTask/taskAssigneeSelect";
import TaskDueDate from "./updateTask/taskDueDateInput";
import TaskEpicSelect from "./updateTask/taskEpicSelect";

// validation libraries
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// redux
import { useDispatch, useSelector } from "react-redux";
import { closeTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";

// types
import { Task } from "@/src/types/projectType";

// icons
import CopyLinkIcon from "../../icons/copyLinkIcon";

// libs
import { getTaskDetails } from "@/src/lib/api/projects/getTaskDetails";
import { updateTaskApi } from "@/src/lib/api/projects/updateTask";

// utils
import { getInitials } from "@/src/lib/utils/initials";
import { formatDate } from "@/src/lib/utils/formatDate";
import { toDateInputValue } from "@/src/lib/utils/formatDate";

// validation
import { UpdateTaskFormData } from "@/src/lib/schemas/updateTaskSchema";
import { updateTaskSchema } from "@/src/lib/schemas/updateTaskSchema";

const toFormValues = (task: Task | null): UpdateTaskFormData => ({
  title: task?.title ?? "",
  description: task?.description ?? "No description provided",
  assignee_id: task?.assignee?.id ?? null,
  due_date: toDateInputValue(task?.due_date),
  epic_id: task?.epic?.id ?? null,
  status: task?.status ?? "",
});

const TaskDetailsModal = ({ onTaskUpdated }: { onTaskUpdated: () => void }) => {
  const { taskDetailsOpen, selectedTaskId, selectedProjectId, taskEpicId } =
    useSelector((state: any) => state.taskModal);

  const dispatch = useDispatch();
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: toFormValues(null),
  });

  const { reset, getValues } = methods;

  useEffect(() => {
    if (!taskDetailsOpen || !selectedTaskId || !selectedProjectId) return;

    let active = true;

    async function fetchData() {
      setIsFetching(true);
      try {
        const task = await getTaskDetails(selectedTaskId, selectedProjectId);
        if (!active) return;
        setTaskDetails(task);
        if (task) reset(toFormValues(task));
      } catch (error) {
        console.error("Failed to fetch modal data:", error);
      } finally {
        if (active) setIsFetching(false);
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [taskDetailsOpen, selectedProjectId, selectedTaskId, taskEpicId, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeTaskDetails());
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const onSubmit: SubmitHandler<UpdateTaskFormData> = async (data) => {
    if (!taskDetails?.id) return;

    const snapshot = getValues();
    setIsSaving(true);

    try {
      const success = await updateTaskApi(taskDetails.id, data);
      if (!success) {
        throw new Error("Update failed");
      }
      onTaskUpdated();
      toast.success("Task updated successfully!");
    } catch {
      reset(snapshot);
      toast.error("Failed to update task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!taskDetailsOpen || !selectedTaskId) return null;

  return (
    <div
      onClick={() => {
        dispatch(closeTaskDetails());
      }}
      className="fixed inset-0 z-50 hidden sm:flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full min-w-2xl w-4xl bg-white flex"
      >
        {isFetching ? (
          <TaskDetailsModalSkeleton />
        ) : (
          <FormProvider {...methods}>
            <form className="flex flex-1">
              <article className="flex flex-col justify-between w-3/5">
                <div className="w-full p-6">
                  <div className="space-y-10">
                    <section>
                      <div className="flex items-center gap-2">
                        <h5 className="label-sm bg-primary-container/20 text-primary-container px-2">
                          {taskDetails?.task_id}
                        </h5>
                        <div className="flex items-center gap-2">
                          <svg
                            width="12"
                            height="13"
                            viewBox="0 0 12 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 12.7L0 8.03333L1.1 7.2L6 11L10.9 7.2L12 8.03333L6 12.7ZM6 9.33333L0 4.66667L6 0L12 4.66667L6 9.33333ZM6 7.63333L9.83333 4.66667L6 1.7L2.16667 4.66667L6 7.63333Z"
                              fill="#434654"
                            />
                          </svg>
                          <TaskEpicSelect
                            onSubmit={onSubmit}
                            isLoading={isSaving}
                            projectId={selectedProjectId}
                          />
                        </div>
                      </div>

                      <TaskTitleInput
                        onSubmit={onSubmit}
                        isLoading={isSaving}
                      />
                    </section>

                    <section className="space-y-2">
                      <h4 className="label-sm text-slate-2/70 uppercase">
                        description
                      </h4>
                      <TaskDescription
                        onSubmit={onSubmit}
                        isLoading={isSaving}
                      />
                    </section>
                  </div>
                </div>

                <section className="flex items-center justify-between bg-surface-low py-4 px-6">
                  <div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="hover:bg-surface-low flex items-center gap-2"
                    >
                      <CopyLinkIcon className="text-slate-2 size-4" />
                      Copy link
                    </Button>
                  </div>

                  <button
                    type="button"
                    onClick={() => dispatch(closeTaskDetails())}
                    className="py-1 px-4 bg-primary-container/20 text-slate-3 hover:bg-primary-container/50 cursor-pointer transition-colors duration-200"
                  >
                    Close
                  </button>
                </section>
              </article>

              <aside className="w-2/5 bg-surface-low p-6 space-y-10">
                <div className="space-y-4">
                  <h5 className="label-sm text-slate-2 text-sm uppercase">
                    status
                  </h5>
                  <TaskStatusSelect onSubmit={onSubmit} isLoading={isSaving} />
                </div>

                <div className="space-y-4">
                  <h5 className="label-sm text-slate-2 text-sm uppercase">
                    assignee
                  </h5>
                  <TaskAssigneeSelect
                    onSubmit={onSubmit}
                    isLoading={isSaving}
                    projectId={selectedProjectId}
                  />
                </div>

                <div className="space-y-4">
                  <h5 className="label-sm text-slate-2 text-sm uppercase">
                    reporter
                  </h5>
                  <div className="flex items-center gap-3 rounded-md">
                    <p className="size-8 p-2 bg-primary-container text-white flex items-center justify-center rounded-full font-bold">
                      {getInitials(taskDetails?.created_by.name) || "UN"}
                    </p>
                    <div>
                      <p className="body-md font-semibold text-slate-3">
                        {taskDetails?.created_by.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <h5 className="body-md text-slate-2 text-sm uppercase w-full">
                    due date
                  </h5>
                  <TaskDueDate onSubmit={onSubmit} isLoading={isSaving} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-3 text-slate-3">
                    <h5 className="body-md text-slate-2 text-sm uppercase w-1/2">
                      created at
                    </h5>
                    <span className="body-md font-medium">
                      {formatDate(taskDetails?.created_at)}
                    </span>
                  </div>
                </div>
              </aside>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
