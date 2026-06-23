"use client";
import { useEffect, useState } from "react";

// components
import TaskDetailsMobile from "./taskDetailsMobile";
import Link from "next/link";

// types
import { Member, Task } from "@/src/types/projectType";

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

const TasksMobileView = ({ projectId }: { projectId: string }) => {
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
    }
    fetchData();
  }, [projectId]);

  const hasNoTasks = !tasks || tasks.length === 0;

  if (hasNoTasks) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 mt-10 sm:hidden">
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
    <div className="flex flex-col items-center gap-4 w-full sm:hidden mt-10">
      {tasks?.map((task) => {
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
      <TaskDetailsMobile />
    </div>
  );
};

export default TasksMobileView;
