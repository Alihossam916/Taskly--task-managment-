"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

// components
import TaskDetailsModal from "./taskDetailsModal";

// libs
import { getTasksByStatusApi } from "@/src/lib/api/projects/getTasksByStatus";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

// types
import { Task, Member } from "@/src/types/projectType";

// redux
import { useDispatch } from "react-redux";
import { openTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";

// icons
import CircledPlus from "../../icons/circledPlus";
import CircleCheck from "../../icons/circleCheck";
import DateIcon from "../../icons/dateIcon";
import WarningIcon from "../../icons/warningIcon";

// utils
import { formatDate } from "@/src/lib/utils/formatDate";
import { getInitials } from "@/src/lib/utils/initials";

// constants
import { statuses } from "@/src/constants/taskStatuses";

const TasksBoardView = ({ projectId }: { projectId: string }) => {
  const [tasksByStatus, setTasksByStatus] = useState<Record<string, Task[]>>(
    {},
  );
  const [members, setMembers] = useState<Member[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const results = await Promise.all(
        statuses.map((s) => getTasksByStatusApi(s, projectId)),
      );
      const grouped: Record<string, Task[]> = {};
      statuses.forEach((s, i) => {
        grouped[s] = results[i] ?? [];
      });
      setTasksByStatus(grouped);

      const membersData = await getProjectMembers(projectId);
      setMembers(membersData ?? []);
    }
    fetchData();
  }, [projectId]);

  const hasNoTasks = Object.values(tasksByStatus).every((arr) => arr.length === 0);

  if (hasNoTasks) {
    return (
      <div className="hidden sm:flex flex-col items-center justify-center gap-6 py-20">
        <div className="size-16 bg-surface-low rounded-full flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="#4F5F7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="text-center">
          <h3 className="headline-lg text-slate-3 mb-2">Task not found</h3>
          <p className="body-md text-slate-2">Get started by creating your first task</p>
        </div>
        <Link
          href={`/project/${projectId}/tasks/new`}
          className="bg-primary text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium"
        >
          Add new task
        </Link>
      </div>
    );
  }

  return (
    <section className="hidden sm:flex gap-8 overflow-x-auto min-w-0 w-full overflow-y-hidden">
      {statuses.map((status) => {
        const tasks = tasksByStatus[status] ?? [];
        return (
          <div
            key={status}
            className="w-xs flex flex-col items-center shrink-0"
          >
            <div className="flex items-center justify-between w-full p-2">
              <div className="flex items-center gap-2">
                <span
                  className={`${status === `IN_PROGRESS` ? `bg-primary-container` : status === "BLOCKED" ? `bg-error` : status === `DONE` ? `bg-success` : `bg-slate-1`} size-2 rounded-full`}
                ></span>
                <h5>{status.replace("_", " ")}</h5>
                <p
                  className={`${status === `DONE` ? `bg-success/20 text-success` : status === "BLOCKED" ? `bg-error/20 text-error` : `bg-primary-container/20 text-slate-3 `} label-sm flex items-center justify-center p-1 size-5`}
                >
                  {tasks.length}
                </p>
              </div>
              <Link
                href={`/project/${projectId}/tasks/new?status=${status}`}
                className="text-xl hover:bg-slate-1 transition-colors duration-200 p-2"
              >
                +
              </Link>
            </div>
            <Link
              href={`/project/${projectId}/tasks/new?status=${status}`}
              className="flex items-center justify-center text-slate-2 gap-4 p-4 border border-slate-1 border-dashed w-full"
            >
              <CircledPlus />
              <span className="uppercase">add new task</span>
            </Link>
            <div className="flex flex-col gap-4 mt-4 w-full">
              {tasks.map((task) => {
                const assignee = members.find(
                  (m) => m.user_id === task.assignee?.id,
                );
                return (
                  <div
                    key={task.task_id}
                    onClick={() =>
                      dispatch(
                        openTaskDetails({
                          taskId: task.id,
                          projectId,
                          epicId: task.epic_id,
                        }),
                      )
                    }
                    className={`flex flex-col gap-4 rounded-lg p-6 w-full hover:shadow-md transition-shadow duration-200 cursor-pointer ${status === `IN_PROGRESS` ? `border-l-4 border-primary` : status === `BLOCKED` ? `bg-error/5 border border-error/20` : status === `DONE` ? `bg-success/10` : `bg-white`}`}
                  >
                    <h4 className="text-sm font-medium text-slate-3 mb-2">
                      {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
                    </h4>
                    <div className="flex items-center justify-between">
                      {status === "BLOCKED" ? (
                        <span className="flex items-center gap-2 label-sm text-error uppercase">
                          <WarningIcon />
                          Delayed
                        </span>
                      ) : status === "DONE" ? (
                        <span className="flex items-center gap-2 label-sm text-success uppercase">
                          <CircleCheck className="text-green-500" />
                          DONE
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 label-sm text-slate-2/60 uppercase">
                          <DateIcon />
                          {formatDate(task.due_date) || "no due date"}
                        </span>
                      )}
                      <div className="bg-primary-container size-6 p-2 text-xs rounded-full text-white flex items-center justify-center font-bold">
                        {getInitials(assignee?.metadata.name) || "UN"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <TaskDetailsModal />
    </section>
  );
};

export default TasksBoardView;
