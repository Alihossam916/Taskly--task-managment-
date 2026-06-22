"use client";
import { useEffect, useState } from "react";

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

const TasksMobileView = ({ projectId }: { projectId: string }) => {
  const [tasks, setTasks] = useState<Task[] | null>([]);
  const [members, setMembers] = useState<Member[]>([]);

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

  return (
    <div className="flex flex-col items-center gap-4 w-full sm:hidden mt-10">
      {tasks?.map((task) => {
        const assignee = members.find((m) => m.user_id === task.assignee?.id);

        return (
          <div key={task.task_id} className="w-full bg-white p-4 space-y-4">
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
    </div>
  );
};

export default TasksMobileView;
