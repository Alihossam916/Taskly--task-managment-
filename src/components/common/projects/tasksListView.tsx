"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// components
import TaskDetailsModal from "./taskDetailsModal";

// libs
import { getAllTasksApi } from "@/src/lib/api/projects/getAllTasks";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

// utils
import { getInitials } from "@/src/lib/utils/initials";
import { formatDate } from "@/src/lib/utils/formatDate";

// types
import { Task, Member } from "@/src/types/projectType";

// icons
import EditIcon from "../../icons/editIcon";

// redux
import { useDispatch } from "react-redux";
import { openTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";

const TasksListView = ({ projectId }: { projectId: string }) => {
  const [tasks, setTasks] = useState<Task[] | null>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const [results, membersData] = await Promise.all([
        getAllTasksApi(projectId),
        getProjectMembers(projectId),
      ]);
      setTasks(results);
      setMembers(membersData ?? []);
      console.log(results);
    }
    fetchData();
  }, [projectId]);

  const hasNoTasks = !tasks || tasks.length === 0;

  if (hasNoTasks) {
    return (
      <div className="flex-col items-center justify-center gap-6 py-20 mt-10 hidden sm:flex">
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
    <div className="mt-10 w-full mx-auto hidden sm:block relative">
      <table className=" max-w-full mx-auto min-w-150">
        <thead className="bg-surface-low">
          <tr className="uppercase">
            <th className="label-sm text-slate-2 py-4 pl-4 md:pl-10 text-left w-1/6 whitespace-nowrap">
              Task ID
            </th>
            <th className="label-sm text-slate-2 py-4 text-left w-1/5 whitespace-nowrap">
              Title
            </th>
            <th className="label-sm text-slate-2 py-4 pr-10 text-left w-1/6 whitespace-nowrap">
              Status
            </th>
            <th className="label-sm text-slate-2 py-4 pr-10 text-left w-1/6 whitespace-nowrap">
              Due Date
            </th>
            <th className="label-sm text-slate-2 py-4 pr-10 text-left w-2/6 whitespace-nowrap">
              Assignee
            </th>
            <th className="label-sm text-slate-2 py-4 pr-10 text-right w-1/6 whitespace-nowrap"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {tasks?.map((task) => {
            const assignee = members.find(
              (m) => m.user_id === task.assignee?.id,
            );
            return (
              <tr
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
                className="cursor-pointer"
              >
                <td className="py-4 px-4 md:px-10 text-left">
                  <span className="body-md text-primary">{task.task_id}</span>
                </td>
                <td className="py-4 text-left">
                  <span className="body-md font-semibold text-slate-3 truncate block max-w-xs">
                    {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
                  </span>
                </td>
                <td className="py-4 pr-10 text-left">
                  <p
                    className={`w-fit py-1 px-2 rounded-xs label-sm ${task.status === "DONE" ? `bg-success` : task.status === "BLOCKED" ? `bg-error/20 text-error` : `bg-surface-highest`}`}
                  >
                    {task.status}
                  </p>
                </td>
                <td className="py-4 pr-10 body-md text-slate-2 text-left whitespace-nowrap">
                  {task.due_date ? formatDate(task.due_date) : "—"}
                </td>
                <td className="py-4 pr-10 text-right flex gap-2 items-center">
                  <span className="bg-primary-container p-2 rounded-full text-white">
                    {getInitials(assignee?.metadata.name) || "UN"}
                  </span>
                  <span className="body-md text-slate-2">
                    {assignee?.metadata?.name || "Unassigned"}
                  </span>
                </td>
                <td className="py-4 text-left">
                  <EditIcon className="p-2 size-8 hover:bg-slate-1 text-slate-2 cursor-pointer transition-colors duration-200 rotate-90" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mx-8 flex justify-between items-center">
        <p className="">
          showing {tasks?.length} of {tasks?.length}
        </p>
        <div className="flex items-center gap-2">
          <p>{"<"}</p>
          <p>page 1 of 5</p>
          <p>{">"}</p>
        </div>
      </div>
      <Link
        href={`/project/${projectId}/tasks/new`}
        className="fixed p-4 bg-primary size-12 bottom-15 right-5 z-50 text-white text-2xl rounded-sm flex items-center justify-center"
      >
        +
      </Link>
      <TaskDetailsModal />
    </div>
  );
};

export default TasksListView;
