"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

// components
import TaskDetailsModal from "./taskDetailsModal";
import EmptyTasks from "./emptyTasks";
import InfiniteScrollLoader from "../../ui/infiniteScrollLoader";
import TasksBoardSkeleton from "./tasksBoardSkeleton";
import StatusColumn from "./statusColumn";

// drag and drop
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

// libs
import { getAllTasksApi } from "@/src/lib/api/projects/getAllTasks";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";
import { updateTaskStatusApi } from "@/src/lib/api/projects/updateTaskStatus";

// notifications
import { toast } from "react-toastify";

// hooks
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";

// types
import { Task, Member } from "@/src/types/projectType";

// constants
import { statuses } from "@/src/constants/taskStatuses";

const TasksBoardView = ({
  projectId,
  currentPage,
  limit,
  offset,
}: {
  projectId: string;
  currentPage: number;
  limit: number;
  offset: number;
}) => {
  const [tasks, setTasks] = useState<Task[] | null>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
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
  }, [projectId, limit, offset, q, retryTrigger]);

  const {
    items: displayedTasks,
    loading,
    hasMore,
    loadMore,
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

  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    statuses.forEach((s) => {
      grouped[s] = [];
    });
    displayedTasks.forEach((task) => {
      if (grouped[task.status]) grouped[task.status].push(task);
    });
    return grouped;
  }, [displayedTasks]);

  const hasNoTasks = displayedTasks.length === 0 && !loading;

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const draggedTask = displayedTasks.find((t) => t.task_id === draggableId);
    if (!draggedTask) return;

    const originalStatus = draggedTask.status;
    const newStatus = destination.droppableId;

    setTasks((prev) => {
      if (!prev) return prev;
      return prev.map((t) =>
        t.task_id === draggableId ? { ...t, status: newStatus } : t,
      );
    });

    const res = await updateTaskStatusApi(draggedTask.id, newStatus);
    if (!res) {
      setTasks((prev) => {
        if (!prev) return prev;
        return prev.map((t) =>
          t.task_id === draggableId ? { ...t, status: originalStatus } : t,
        );
      });
      toast.error("Failed to update task status");
    }
  };

  if (initialLoading) {
    return (
      <div className="hidden sm:block">
        <TasksBoardSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="hidden sm:block text-center py-20">
        <p className="text-error body-md font-semibold mb-4">
          Failed to search tasks
        </p>
        <button
          onClick={() => setRetryTrigger((prev) => prev + 1)}
          className="rounded-xs! text-sm py-2 px-4 bg-primary text-white hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  if (hasNoTasks) {
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
    <div className="hidden sm:block">
      <DragDropContext onDragEnd={onDragEnd}>
        <section className="flex gap-8 overflow-x-auto min-w-0 w-full overflow-y-hidden">
          {statuses.map((status) => {
            const tasks = tasksByStatus[status] ?? [];
            return (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <StatusColumn
                      status={status}
                      tasks={tasks}
                      projectId={projectId}
                      members={members}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
          <TaskDetailsModal />
        </section>
      </DragDropContext>
      <InfiniteScrollLoader
        loading={loading}
        hasMore={hasMore}
        hasItems={displayedTasks.length > 0}
        onLoadMore={loadMore}
        label="tasks"
        mobileOnly={false}
      />
      {loadMoreError && (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="text-error body-sm font-semibold">
            Failed to search tasks
          </p>
          <button
            onClick={() => {
              setLoadMoreError(false);
              loadMore();
            }}
            className="rounded-xs! text-sm py-2 px-4 bg-primary text-white hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default TasksBoardView;
