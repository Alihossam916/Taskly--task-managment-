"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// components
import TaskDetailsMobile from "./taskDetailsMobile";
import InfiniteScrollLoader from "../../ui/infiniteScrollLoader";
import TasksMobileSkeleton from "./tasksMobileSkeleton";
import EmptyTasks from "./emptyTasks";

// types
import { Member, Task, TaskViewProps } from "@/src/types/projectType";

// libs
import { getAllTasksApi } from "@/src/lib/api/projects/getAllTasks";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

// utils
import { getInitials } from "@/src/lib/utils/initials";
import { formatDate } from "@/src/lib/utils/formatDate";

// icons
import EditIcon from "../../icons/editIcon";

// redux
import { useDispatch } from "react-redux";
import { openTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";

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
  const dispatch = useDispatch();
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
            className="w-full bg-white p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h5 className="label-sm text-slate-2/70">{task.task_id}</h5>
              <p
                className={`label-sm p-2 rounded-xs ${task.status === "DONE" ? `bg-success` : task.status === `BLOCKED` ? `bg-error/20 text-error` : `bg-surface-highest`}`}
              >
                {task.status.replace("_", " ")}
              </p>
            </div>
            <h3 className="title-md text-slate-3 capitalize">{task.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-primary-container text-white size-9 p-2 flex justify-center items-center rounded-full">
                  {" "}
                  {getInitials(assignee?.metadata.name) || "UN"}
                </span>
                <div>
                  <p className="uppercase label-sm text-slate-2/70">due date</p>
                  <p>{formatDate(task.due_date)}</p>
                </div>
              </div>
              <EditIcon className="text-slate-2/70 p-2 size-8" />
            </div>
          </div>
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
            Failed to search tasks
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
