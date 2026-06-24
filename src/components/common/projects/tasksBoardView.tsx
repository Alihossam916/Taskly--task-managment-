"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

// components
import TaskDetailsModal from "./taskDetailsModal";
import EmptyTasks from "./emptyTasks";
import InfiniteScrollLoader from "../../ui/infiniteScrollLoader";

// libs
import { getAllTasksApi } from "@/src/lib/api/projects/getAllTasks";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

// hooks
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";

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
  const [tasks, setTasks] = useState<Task[] | null>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const [tasksData, membersData] = await Promise.all([
        getAllTasksApi(projectId, 5, 0),
        getProjectMembers(projectId),
      ]);
      const { tasks, total } = tasksData || { tasks: [], total: 0 };
      setTasks(tasks || null);
      setMembers(membersData ?? []);
      setTotalTasks(total);
    }
    fetchData();
  }, [projectId]);

  const {
    items: displayedTasks,
    loading,
    hasMore,
    loadMore,
  } = useInfiniteScroll<Task>(tasks ?? [], totalTasks, 1, 5, async (l, o) => {
    const res = await getAllTasksApi(projectId, l, o);
    if (!res) return null;
    return { items: res.tasks, total: res.total };
  });

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

  if (hasNoTasks) {
    return (
      <div className="hidden sm:block">
        <EmptyTasks projectId={projectId} />
      </div>
    );
  }

  return (
    <div className="hidden sm:block">
      <section className="flex gap-8 overflow-x-auto min-w-0 w-full overflow-y-hidden">
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
                        {task.title.charAt(0).toUpperCase() +
                          task.title.slice(1)}
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
      <InfiniteScrollLoader
        loading={loading}
        hasMore={hasMore}
        hasItems={displayedTasks.length > 0}
        onLoadMore={loadMore}
        label="tasks"
        mobileOnly={false}
      />
    </div>
  );
};

export default TasksBoardView;
