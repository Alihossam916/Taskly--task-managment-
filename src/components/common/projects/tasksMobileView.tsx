"use client";
import { useEffect, useState } from "react";

// components
import TaskDetailsMobile from "./taskDetailsMobile";
import InfiniteScrollLoader from "../../ui/infiniteScrollLoader";
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

  useEffect(() => {
    async function fetchData() {
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
    }
    fetchData();
  }, [projectId, limit, offset]);

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
      const res = await getAllTasksApi(projectId, l, o);
      if (!res) return null;
      return { items: res.tasks, total: res.total };
    },
  );

  if (totalTasks === 0) {
    return (
      <div className="sm:hidden">
        <EmptyTasks projectId={projectId} />
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
        label={"epics"}
      />

      <TaskDetailsMobile />
    </div>
  );
};

export default TasksMobileView;
