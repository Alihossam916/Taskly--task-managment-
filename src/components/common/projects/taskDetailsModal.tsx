"use client";
import { useEffect, useState } from "react";

// components
import Button from "../../ui/button";
import TaskDetailsSelector from "./taskDetailsSelector";

// redux
import { useDispatch, useSelector } from "react-redux";
import { closeTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";

// types
import { Epic, Member, Task } from "@/src/types/projectType";

// icons
import CopyLinkIcon from "../../icons/copyLinkIcon";

// libs
import { getTaskDetails } from "@/src/lib/api/projects/getTaskDetails";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";
import { getEpicDetails } from "@/src/lib/api/projects/getEpicDetails";

// utils
import { getInitials } from "@/src/lib/utils/initials";
import { formatDate } from "@/src/lib/utils/formatDate";

const TaskDetailsModal = () => {
  const { taskDetailsOpen, selectedTaskId, selectedProjectId, taskEpicId } =
    useSelector((state: any) => state.taskModal);
  const dispatch = useDispatch();
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [epicDetails, setEpicDetails] = useState<Epic | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [task, members] = await Promise.all([
          getTaskDetails(selectedTaskId, selectedProjectId),
          getProjectMembers(selectedProjectId),
        ]);
        setTaskDetails(task);
        setMembers(members);

        if (taskEpicId) {
          const epic = await getEpicDetails(selectedProjectId, taskEpicId);
          setEpicDetails(epic[0]);
        }
      } catch (error) {
        console.error("Failed to fetch modal data:", error);
      }
    }
    fetchData();
  }, [selectedProjectId, selectedTaskId, taskEpicId]);

  if (!taskDetailsOpen || !selectedTaskId) return null;

  const taskAssignee = members?.find(
    (member) => member.user_id === taskDetails?.assignee?.id,
  );

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
                    <h5 className="body-md text-slate-2">
                      {epicDetails?.epic_id} (Core UI Overhaul)
                    </h5>
                  </div>
                </div>
                <h3 className="headline-lg text-slate-3">
                  {taskDetails?.title &&
                    taskDetails.title.charAt(0).toUpperCase() +
                      taskDetails.title.slice(1)}
                </h3>
              </section>
              <section className="space-y-2">
                <h4 className="label-sm text-slate-2/70 uppercase">
                  description
                </h4>
                <p className="body-md text-slate-3">
                  {taskDetails?.description &&
                    taskDetails?.description?.charAt(0).toUpperCase() +
                      taskDetails?.description?.slice(1)}
                </p>
              </section>
            </div>
          </div>
          <section className="flex items-center justify-between bg-surface-low py-4 px-6">
            <div>
              <Button
                variant="ghost"
                className="hover:bg-surface-low flex items-center gap-2"
              >
                <CopyLinkIcon className="text-slate-2 size-4" />
                Copy link
              </Button>
            </div>
            <button
              onClick={() => dispatch(closeTaskDetails())}
              className="py-1 px-4 bg-primary-container/20 text-slate-3 hover:bg-primary-container/50 cursor-pointer transition-colors duration-200"
            >
              Close
            </button>
          </section>
        </article>
        <aside className="w-2/5 bg-surface-low p-6 space-y-10">
          <div className="space-y-4">
            <h5 className="label-sm text-slate-2 text-sm uppercase">status</h5>
            <TaskDetailsSelector taskDetails={taskDetails} />
          </div>
          <div className="space-y-4">
            <h5 className="label-sm text-slate-2 text-sm uppercase">
              assignee
            </h5>
            <div className="bg-white p-4 flex items-center gap-3 rounded-md">
              <p className="size-8 p-2 bg-primary-container text-white flex items-center justify-center rounded-full font-bold">
                {getInitials(taskAssignee?.metadata.name) || "UN"}
              </p>
              <div>
                <p className="body-md font-semibold text-slate-3">
                  {taskAssignee?.metadata.name}
                </p>
                <p className="label-sm font-medium text-slate-2">
                  {taskAssignee?.metadata.job}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h5 className="label-sm text-slate-2 text-sm uppercase">
              reporter
            </h5>
            <div className="p-4 flex items-center gap-3 rounded-md">
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="body-md text-slate-2 text-sm capitalize">
                due date
              </h5>
              <p>{formatDate(taskDetails?.due_date)}</p>
            </div>
            <div className="flex items-center justify-between">
              <h5 className="body-md text-slate-2 text-sm capitalize">
                created at
              </h5>
              <p>{formatDate(taskDetails?.created_at)}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
