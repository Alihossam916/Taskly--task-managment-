"use client";
import Link from "next/link";

// types
import { Task } from "@/src/types/projectType";

// icons
import CircledPlus from "../../icons/circledPlus";
import CircleCheck from "../../icons/circleCheck";
import DateIcon from "../../icons/dateIcon";
import WarningIcon from "../../icons/warningIcon";

// components
import InfiniteScrollLoader from "../../ui/infiniteScrollLoader";

// utils
import { formatDate } from "@/src/lib/utils/formatDate";
import { getInitials } from "@/src/lib/utils/initials";

// redux
import { useDispatch } from "react-redux";
import { openTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";

// drag and drop
import { Draggable } from "@hello-pangea/dnd";

interface StatusColumnProps {
  tasks: Task[];
  projectId: string;
  status: string;
  loading: boolean;
  hasMore: boolean;
  loadMoreError: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
}

const StatusColumn = ({
  tasks,
  projectId,
  status,
  loading,
  hasMore,
  loadMoreError,
  onLoadMore,
  onRetry,
}: StatusColumnProps) => {
  const dispatch = useDispatch();

  return (
    <div className="w-xs flex flex-col items-center shrink-0">
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
      <div className="flex flex-col gap-4 mt-4 w-full h-96 overflow-auto">
        {tasks.map((task, index) => {
          return (
            <Draggable key={task.id} draggableId={task.task_id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  onClick={() =>
                    dispatch(
                      openTaskDetails({
                        taskId: task.id,
                        projectId,
                        epicId: task.epic_id || null,
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
                      {getInitials(task.assignee?.name) || "UN"}
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          );
        })}
        <InfiniteScrollLoader
          loading={loading}
          hasMore={hasMore}
          hasItems={tasks.length > 0}
          onLoadMore={onLoadMore}
          label="tasks"
          mobileOnly={false}
        />
        {loadMoreError && (
          <div className="flex flex-col items-center gap-2 py-4">
            <p className="text-error body-sm font-semibold">
              Failed to load more tasks
            </p>
            <button
              onClick={onRetry}
              className="rounded-xs! text-sm py-2 px-4 bg-primary text-white hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusColumn;
