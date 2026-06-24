"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// components
import TaskDetailsModal from "./taskDetailsModal";
import Pagination from "../../ui/pagination";
import EmptyTasks from "./emptyTasks";
import TasksListSkeleton from "./tasksListSkeleton";

// libs
import { getAllTasksApi } from "@/src/lib/api/projects/getAllTasks";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

// utils
import { getInitials } from "@/src/lib/utils/initials";
import { formatDate } from "@/src/lib/utils/formatDate";

// types
import { Task, Member, TaskViewProps } from "@/src/types/projectType";

// icons
import EditIcon from "../../icons/editIcon";

// redux
import { useDispatch } from "react-redux";
import { openTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";

// hooks
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";

const TasksListView = ({
  projectId,
  currentPage,
  limit,
  offset,
}: TaskViewProps) => {
  const [tasks, setTasks] = useState<Task[] | null>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const dispatch = useDispatch();
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setInitialLoading(true);
      const [tasksData, membersData] = await Promise.all([
        getAllTasksApi(projectId, limit, offset),
        getProjectMembers(projectId),
      ]);
      const { tasks, total } = tasksData || {
        currentTasks: [],
        total: 0,
      };

      setTasks(tasks || null);
      setMembers(membersData ?? []);
      setTotalTasks(total);
      setInitialLoading(false);
    }
    fetchData();
  }, [projectId, limit, offset]);

  const { items: displayedTasks } = useInfiniteScroll<Task>(
    tasks ?? [],
    totalTasks,
    currentPage,
    limit,
    async (l, o) => {
      const res = await getAllTasksApi(projectId, l, o);
      if (!res) return null;
      return { items: res.tasks, total: res.total };
    },
  );

  if (initialLoading) {
    return <TasksListSkeleton />;
  }

  if (totalTasks === 0) {
    return (
      <div className="hidden sm:block">
        <EmptyTasks projectId={projectId} />
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
          {displayedTasks?.map((task) => {
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
      <Pagination
        basePath={`/project/${projectId}/tasks`}
        currentPage={currentPage}
        limit={limit}
        total={totalTasks}
        displayedCount={displayedTasks.length}
        itemLabel="active projects"
        mode="simple"
      />
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
