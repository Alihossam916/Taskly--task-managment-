"use client";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// components
import TaskDetailsModal from "./taskDetailsModal";
import Pagination from "../../ui/pagination";
import EmptyTasks from "./emptyTasks";
import TasksListSkeleton from "./tasksListSkeleton";

// libs
import { getAllTasksApi } from "@/src/lib/api/projects/getAllTasks";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

// types
import { Task, Member, TaskViewProps } from "@/src/types/projectType";

// hooks
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";
import TaskListCard from "../../ui/taskListCard";

const TasksListView = ({
  projectId,
  currentPage,
  limit,
  offset,
}: TaskViewProps) => {
  const [tasks, setTasks] = useState<Task[] | null>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    async function fetchData() {
      setInitialLoading(true);
      setHasError(false);
      try {
        const [tasksData, membersData] = await Promise.all([
          getAllTasksApi(projectId, limit, offset, q || undefined),
          getProjectMembers(projectId),
        ]);
        if (!tasksData) {
          setHasError(true);
          setTasks([]);
          setTotalTasks(0);
        } else {
          setTasks(tasksData.tasks || null);
          setTotalTasks(tasksData.total);
        }
        setMembers(membersData ?? []);
      } catch {
        setHasError(true);
        setTasks([]);
        setTotalTasks(0);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchData();
  }, [projectId, limit, offset, q]);

  const { items: displayedTasks } = useInfiniteScroll<Task>(
    tasks ?? [],
    totalTasks,
    currentPage,
    limit,
    async (l, o) => {
      const res = await getAllTasksApi(projectId, l, o, q || undefined);
      if (!res) return null;
      return { items: res.tasks, total: res.total };
    },
  );

  if (initialLoading) {
    return <TasksListSkeleton />;
  }

  if (hasError) {
    return (
      <div className="hidden sm:block text-center py-20">
        <p className="text-error body-md font-semibold">
          Failed to search tasks
        </p>
      </div>
    );
  }

  if (totalTasks === 0) {
    return (
      <div className="hidden sm:block">
        {q ? (
          <div className="text-center py-20">
            <p className="body-md text-slate-2">
              No tasks found matching your search
            </p>
          </div>
        ) : (
          <EmptyTasks projectId={projectId} />
        )}
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
              <Fragment key={task.task_id}>
                <TaskListCard
                  task={task}
                  projectId={projectId}
                  assignee={assignee}
                />
              </Fragment>
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
