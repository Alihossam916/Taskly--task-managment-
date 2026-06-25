"use client";
import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// components
import TaskDetailsMobile from "./taskDetailsMobile";
import InfiniteScrollLoader from "../../ui/infiniteScrollLoader";
import TasksMobileSkeleton from "./tasksMobileSkeleton";
import TaskMobileCard from "../../ui/taskMobileCard";
import EmptyTasks from "./emptyTasks";

// types
import { Member, Task, TaskViewProps } from "@/src/types/projectType";

// libs
import { getAllTasksApi } from "@/src/lib/api/projects/getAllTasks";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

// hooks
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";

const TasksMobileView = ({
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
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [loadMoreError, setLoadMoreError] = useState(false);

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
        const { tasks, total } = tasksData || {
          tasks: [],
          total: 0,
        };

        if (!tasksData) {
          setHasError(true);
          setTasks([]);
          setTotalTasks(0);
        } else {
          setTasks(tasks || null);
          setTotalTasks(total);
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
  }, [projectId, limit, offset, q, retryTrigger]);

  const {
    items: displayedTasks,
    loading,
    hasMore,
    loadMore: loadMoreTasks,
  } = useInfiniteScroll<Task>(
    tasks ?? [],
    totalTasks,
    currentPage,
    limit,
    async (l, o) => {
      const res = await getAllTasksApi(projectId, l, o, q || undefined);
      if (!res) {
        setLoadMoreError(true);
        return null;
      }
      setLoadMoreError(false);
      return { items: res.tasks, total: res.total };
    },
  );

  if (initialLoading) {
    return (
      <div className="sm:hidden">
        <TasksMobileSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="sm:hidden text-center py-20">
        <p className="text-error body-md font-semibold mb-4">
          Failed to search tasks
        </p>
        <button
          onClick={() => setRetryTrigger((prev) => prev + 1)}
          className="rounded-xs! text-sm py-2 px-4 bg-primary text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (totalTasks === 0) {
    return (
      <div className="sm:hidden">
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
    <div className="flex flex-col items-center gap-4 w-full sm:hidden mt-10">
      {displayedTasks?.map((task) => {
        const assignee = members.find((m) => m.user_id === task.assignee?.id);

        return (
          <Fragment key={task.task_id}>
            <TaskMobileCard
              task={task}
              assignee={assignee}
              projectId={projectId}
            />
          </Fragment>
        );
      })}
      <InfiniteScrollLoader
        loading={loading}
        hasMore={hasMore}
        hasItems={displayedTasks.length > 0}
        onLoadMore={loadMoreTasks}
        label={"tasks"}
      />
      {loadMoreError && (
        <div className="flex flex-col items-center gap-2 py-4 w-full">
          <p className="text-error body-sm font-semibold">
            Failed to load more tasks
          </p>
          <button
            onClick={() => {
              setLoadMoreError(false);
              loadMoreTasks();
            }}
            className="rounded-xs! text-sm py-2 px-4 bg-primary text-white"
          >
            Retry
          </button>
        </div>
      )}

      <TaskDetailsMobile />
    </div>
  );
};

export default TasksMobileView;
