"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

// components
import TaskDetailsModal from "./taskDetailsModal";
import EmptyTasks from "./emptyTasks";
import TasksBoardSkeleton from "./tasksBoardSkeleton";
import StatusColumn from "./statusColumn";

// drag and drop
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

// libs
import { getAllTasksApi } from "@/src/lib/api/projects/getAllTasks";
import { updateTaskStatusApi } from "@/src/lib/api/projects/updateTaskStatus";

// notifications
import { toast } from "react-toastify";

// types
import { Task } from "@/src/types/projectType";

// constants
import { statuses } from "@/src/constants/taskStatuses";

type TasksByStatus = Record<string, Task[]>;

const INITIAL_PAGE = 1;

const TasksBoardView = ({
  projectId,
  limit,
}: {
  projectId: string;
  limit: number;
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [pages, setPages] = useState<Record<string, number>>({});
  const [hasMoreMap, setHasMoreMap] = useState<Record<string, boolean>>({});
  const [loadingMoreMap, setLoadingMoreMap] = useState<Record<string, boolean>>(
    {},
  );
  const [loadMoreErrorMap, setLoadMoreErrorMap] = useState<
    Record<string, boolean>
  >({});

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    async function fetchData() {
      setInitialLoading(true);
      setHasError(false);
      try {
        const statusResults = await Promise.all(
          statuses.map((s) =>
            getAllTasksApi(projectId, limit, 0, q || undefined, s),
          ),
        );

        const grouped: TasksByStatus = {};
        const initialPages: Record<string, number> = {};
        const initialHasMore: Record<string, boolean> = {};

        statuses.forEach((s, i) => {
          const result = statusResults[i];
          grouped[s] = result?.tasks || [];
          initialPages[s] = INITIAL_PAGE;
          initialHasMore[s] = true;
        });

        setTasksByStatus(grouped);
        setPages(initialPages);
        setHasMoreMap(initialHasMore);
      } catch {
        setHasError(true);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchData();
  }, [projectId, limit, q, retryTrigger, refreshTrigger]);

  const loadMoreForStatus = useCallback(
    async (status: string) => {
      if (loadingMoreMap[status] || !hasMoreMap[status]) return;
      setLoadingMoreMap((prev) => ({ ...prev, [status]: true }));
      setLoadMoreErrorMap((prev) => ({ ...prev, [status]: false }));
      try {
        const currentPage = pages[status] || 1;
        const nextPage = currentPage + 1;
        const offset = (nextPage - 1) * limit;

        const result = await getAllTasksApi(
          projectId,
          limit,
          offset,
          q || undefined,
          status,
        );

        setTasksByStatus((prev) => ({
          ...prev,
          [status]: [...(prev[status] || []), ...(result?.tasks || [])],
        }));
        setPages((prev) => ({ ...prev, [status]: nextPage }));
        setHasMoreMap((prev) => ({
          ...prev,
          [status]: (result?.tasks?.length || 0) > 0,
        }));
      } catch {
        setLoadMoreErrorMap((prev) => ({ ...prev, [status]: true }));
      } finally {
        setLoadingMoreMap((prev) => ({ ...prev, [status]: false }));
      }
    },
    [loadingMoreMap, hasMoreMap, pages, limit, projectId, q],
  );

  const allTasks = Object.values(tasksByStatus).flat();
  const totalCount = allTasks.length;
  const hasNoTasks = totalCount === 0 && !initialLoading;

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    const draggedTask = tasksByStatus[sourceStatus]?.find(
      (t) => t.task_id === draggableId,
    );
    if (!draggedTask) return;

    const originalStatus = draggedTask.status;

    setTasksByStatus((prev) => {
      const updated = { ...prev };
      updated[sourceStatus] = (prev[sourceStatus] || []).filter(
        (t) => t.task_id !== draggableId,
      );
      updated[destStatus] = [
        ...(prev[destStatus] || []),
        { ...draggedTask, status: destStatus },
      ];
      return updated;
    });

    const res = await updateTaskStatusApi(draggedTask.id, destStatus);
    if (!res) {
      setTasksByStatus((prev) => {
        const updated = { ...prev };
        updated[destStatus] = (prev[destStatus] || []).filter(
          (t) => t.task_id !== draggableId,
        );
        updated[sourceStatus] = [
          ...(prev[sourceStatus] || []),
          { ...draggedTask, status: originalStatus },
        ];
        return updated;
      });
      toast.error("Failed to update task status");
    }
  };

  const handleTaskUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
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
                      loading={loadingMoreMap[status] ?? false}
                      hasMore={hasMoreMap[status] ?? true}
                      loadMoreError={loadMoreErrorMap[status] ?? false}
                      onLoadMore={() => loadMoreForStatus(status)}
                      onRetry={() => loadMoreForStatus(status)}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
          <TaskDetailsModal onTaskUpdated={handleTaskUpdated}/>
        </section>
      </DragDropContext>
    </div>
  );
};

export default TasksBoardView;
