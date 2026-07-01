"use client";
import { useEffect, useState, useRef, type TouchEvent } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { closeTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";

// types
import { Task } from "@/src/types/projectType";

// components
import Badge from "../../ui/badge";
import TaskDetailsMobileSkeleton from "./taskDetailsMobileSkeleton";
import TaskAssigneeSelect from "./updateTask/taskAssigneeSelect";
import TaskEpicSelect from "./updateTask/taskEpicSelect";
import TaskStatusSelect from "./updateTask/taskStatusSelect";

// libs
import { getTaskDetails } from "@/src/lib/api/projects/getTaskDetails";
import { updateTaskApi } from "@/src/lib/api/projects/updateTask";

// utils
import { getInitials } from "@/src/lib/utils/initials";
import { formatDate, toDateInputValue } from "@/src/lib/utils/formatDate";

// icons
import ArrowedClockIcon from "../../icons/arrowedClockIcon";

// validation
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateTaskFormData,
  updateTaskSchema,
} from "@/src/lib/schemas/updateTaskSchema";
import { toast } from "react-toastify";

const toFormValues = (task: Task | null): UpdateTaskFormData => ({
  title: task?.title ?? "",
  description: task?.description ?? "",
  assignee_id: task?.assignee?.id ?? "unassigned",
  due_date: toDateInputValue(task?.due_date),
  epic_id: task?.epic?.id ?? task?.epic_id ?? null,
  status: task?.status ?? "",
});

const TaskDetailsMobile = () => {
  const { taskDetailsOpen, selectedTaskId, selectedProjectId } = useSelector(
    (state: any) => state.taskModal,
  );
  const dispatch = useDispatch();
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const [editStatus, setEditStatus] = useState(false);
  const [editAssignee, setEditAssignee] = useState(false);
  const [editEpic, setEditEpic] = useState(false);

  const methods = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: toFormValues(null),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (taskDetails) {
      reset(toFormValues(taskDetails));
    }
  }, [taskDetails, reset]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const task = await getTaskDetails(selectedTaskId, selectedProjectId);
        setTaskDetails(task);
        if (task) {
          reset(toFormValues(task));
        }
      } catch (error) {
        console.error("Failed to fetch modal data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (taskDetailsOpen && selectedTaskId && selectedProjectId) {
      fetchData();
    }
  }, [
    selectedProjectId,
    selectedTaskId,
    taskDetailsOpen,
    reset,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeTaskDetails());
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const onSubmit: SubmitHandler<UpdateTaskFormData> = async (data) => {
    if (!taskDetails?.id) return;

    const prevTask = taskDetails;
    const prevFormValues = toFormValues(taskDetails);

    setEditStatus(false);
    setEditAssignee(false);
    setEditEpic(false);
    setIsSaving(true);

    const optimisticTask: Task = {
      ...taskDetails,
      title: data.title,
      description: data.description ?? null,
      due_date: data.due_date ?? null,
      status: data.status,
      epic_id: data.epic_id ?? null,
      assignee:
        data.assignee_id === "unassigned" ? undefined : taskDetails.assignee,
    };

    setTaskDetails(optimisticTask);
    reset({
      ...data,
      description: data.description ?? "",
    });

    try {
      const res = await updateTaskApi(taskDetails.id, data);
      if (!res) {
        throw new Error("Task update failed");
      }

      const freshTask = await getTaskDetails(selectedTaskId, selectedProjectId);
      if (freshTask) {
        setTaskDetails(freshTask);
        reset(toFormValues(freshTask));
      }
      toast.success("Task updated successfully!");
    } catch {
      setTaskDetails(prevTask);
      reset(prevFormValues);
      toast.error("Failed to update task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) setTranslateY(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateY > 150) {
      dispatch(closeTaskDetails());
    }
    setTranslateY(0);
  };

  if (!taskDetailsOpen || !selectedTaskId) return null;

  return (
    <div
      onClick={() => dispatch(closeTaskDetails())}
      className="fixed inset-0 z-50 sm:hidden bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ transform: `translateY(${translateY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="absolute bottom-0 left-0 right-0 bg-surface-low rounded-t-2xl max-h-[90vh] overflow-y-auto transition-transform duration-200"
      >
        <div className="sticky top-0 bg-surface-low z-10 pt-3 pb-2 px-6 flex items-center justify-between">
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-10 h-1 bg-slate-1 rounded-full mx-auto cursor-grab active:cursor-grabbing"
          />
          <button
            type="button"
            onClick={() => dispatch(closeTaskDetails())}
            className="absolute right-4 top-3 size-8 flex items-center justify-center rounded-full hover:bg-surface-low transition-colors duration-200 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.6667 3.33334L3.33341 12.6667M3.33341 3.33334L12.6667 12.6667"
                stroke="#4F5F7B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <TaskDetailsMobileSkeleton />
        ) : (
          <FormProvider {...methods}>
            <form className="px-6 pb-6 space-y-6">
              <h5 className="label-sm text-slate-2 px-2">
                {taskDetails?.task_id}
              </h5>

              <input
                {...methods.register("title")}
                onBlur={(e) => {
                  methods.setValue("title", e.target.value);
                  handleSubmit(onSubmit)();
                }}
                className="headline-lg text-slate-3 w-full bg-transparent outline-none capitalize"
              />

              <section className="flex items-center gap-4">
                {editStatus ? (
                  <div
                    className="min-w-32.5"
                    onBlur={() => setEditStatus(false)}
                  >
                    <TaskStatusSelect
                      onSubmit={onSubmit}
                      isLoading={isSaving}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditStatus(true)}
                    className="cursor-pointer"
                  >
                    <Badge
                      variant={
                        taskDetails?.status === "DONE"
                          ? "success"
                          : taskDetails?.status === "BLOCKED"
                            ? "error"
                            : taskDetails?.status === "IN_PROGRESS"
                              ? "primary"
                              : "ghost"
                      }
                      className="flex items-center gap-2 w-fit px-2"
                    >
                      <h5 className="label-sm">
                        {taskDetails?.status?.replace("_", " ")}
                      </h5>
                    </Badge>
                  </button>
                )}

                {editEpic ? (
                  <div className="min-w-30">
                    <TaskEpicSelect
                      onSubmit={onSubmit}
                      isLoading={isSaving}
                      projectId={selectedProjectId}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditEpic(true)}
                    className="cursor-pointer"
                  >
                    <Badge
                      variant="none"
                      className="flex items-center gap-2 w-24 bg-surface-highest text-slate-3"
                    >
                      <svg
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6 12.7L0 8.03333L1.1 7.2L6 11L10.9 7.2L12 8.03333L6 12.7ZM6 9.33333L0 4.66667L6 0L12 4.66667L6 9.33333ZM6 7.63333L9.83333 4.66667L6 1.7L2.16667 4.66667L6 7.63333Z" />
                      </svg>
                      <h5 className="label-sm">
                        {taskDetails?.epic?.epic_id || "No epic"}
                      </h5>
                    </Badge>
                  </button>
                )}
              </section>

              <section className="grid grid-cols-2 gap-4">
                <div className="space-y-4 p-4 bg-white rounded-md">
                  <h4 className="uppercase label-sm text-slate-2">assignee</h4>
                  {editAssignee ? (
                    <TaskAssigneeSelect
                      onSubmit={onSubmit}
                      isLoading={isSaving}
                      projectId={selectedProjectId}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditAssignee(true)}
                      className="flex items-center gap-2 w-full cursor-pointer"
                    >
                      <p className="size-8 p-2 bg-primary-container text-white flex items-center justify-center rounded-full font-bold">
                        {getInitials(taskDetails?.assignee?.name) || "UN"}
                      </p>
                      <p className="body-md font-medium text-slate-3 capitalize">
                        {taskDetails?.assignee?.name || "unassigned"}
                      </p>
                    </button>
                  )}
                </div>

                <div className="space-y-4 p-4 bg-white rounded-md">
                  <h4 className="uppercase label-sm text-slate-2">due date</h4>
                  <input
                    type="date"
                    {...methods.register("due_date")}
                    onChange={(e) => {
                      methods.setValue("due_date", e.target.value);
                      handleSubmit(onSubmit)();
                    }}
                    className="body-md font-medium text-slate-3 capitalize w-full bg-transparent outline-none"
                  />
                </div>

                <div className="space-y-4 p-4 bg-white rounded-md">
                  <h4 className="uppercase label-sm text-slate-2">
                    created by
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className="size-8 p-2 bg-primary-container text-white flex items-center justify-center rounded-full font-bold">
                      {getInitials(taskDetails?.created_by.name)}
                    </p>
                    <p className="body-md font-medium text-slate-3 capitalize">
                      {taskDetails?.created_by.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-white rounded-md">
                  <h4 className="uppercase label-sm text-slate-2">
                    created at
                  </h4>
                  <div className="flex items-center">
                    <ArrowedClockIcon className="size-8 p-2 text-slate-2" />
                    <p className="body-md font-medium text-slate-3 capitalize">
                      {formatDate(taskDetails?.created_at) || "___"}
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="label-sm text-slate-2 uppercase">description</h4>
                <textarea
                  {...methods.register("description")}
                  onBlur={(e) => {
                    methods.setValue("description", e.target.value);
                    handleSubmit(onSubmit)();
                  }}
                  className="w-full p-4 bg-white outline-none body-md text-slate-3 resize-none min-h-20"
                />
              </section>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsMobile;
