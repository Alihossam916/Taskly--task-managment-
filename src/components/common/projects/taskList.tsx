"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

import { toast } from "react-toastify";

// components
import Button from "../../ui/button";

// icons
import EmptyTasksIcon from "../../icons/emptyTasksIcon";
import CircleUnChecked from "../../icons/circleUnChecked";
import EditIcon from "../../icons/editIcon";
import DateIcon from "../../icons/dateIcon";

// types
import { Epic, Task, Member } from "@/src/types/projectType";
import { getTasksByEpicApi } from "@/src/lib/api/projects/getTasksByEpic";

// libs
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

// utils
import { formatDate } from "@/src/lib/utils/formatDate";
import { getInitials } from "@/src/lib/utils/initials";
import CircledPlus from "../../icons/circledPlus";
import Spinner from "../../ui/spinner";

interface TaskListProp {
  projectId: string;
  epic: Epic | null;
}

const TaskList = ({ projectId, epic }: TaskListProp) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    async function fetchTasksByEpic() {
      if (!epic) return;

      const response = await getTasksByEpicApi(epic.id);
      if (!response) {
        toast.error("Failed to load tasks");
      }
      setTasks(response ?? []);
    }
    async function fetchMembers() {
      const response = await getProjectMembers(projectId);
      setMembers(response ?? []);
    }

    fetchTasksByEpic();
    fetchMembers();
  }, [epic, projectId]);

  return (
    <div className="mt-10">
      {tasks.length ? (
        <section className="flex flex-col items-center gap-4 sm:gap-2">
          <div className="flex justify-between items-center w-full">
            <h4 className="capitalize title-md">tasks</h4>
            <p className="uppercase sm:hidden text-slate-2 label-sm bg-surface-highest py-1 px-3 rounded-r-full rounded-l-full">
              {tasks.length} tasks
            </p>
            <Link
              href={`/project/${projectId}/tasks/new?epic_id=${epic?.id}&epic_title=${epic?.title}`}
              className="hidden sm:block"
            >
              <Button variant="secondary" className="capitalize">
                + add tasks
              </Button>
            </Link>
          </div>

          {tasks.map((task) => {
            const taskAssignee = members.find(
              (member) => member.user_id === task.assignee?.id,
            );
            return (
              <Suspense
                key={task.task_id}
                fallback={<Spinner className="border-slate-3" />}
              >
                <div className="flex items-center justify-between w-full py-4 px-2 sm:px-10 rounded-lg border border-slate-1 shadow-md sm:shadow-none">
                  <div className="flex items-center gap-4">
                    <CircleUnChecked className="hidden sm:block" />
                    <div className="flex flex-col gap-2">
                      <h4 className="title-md text-slate-3">
                        {task.title.charAt(0).toUpperCase() +
                          task.title.slice(1)}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary-container w-fit p-2 rounded-full text-white">
                          {getInitials(taskAssignee?.metadata.name)}
                        </div>
                        <p className="capitalize">
                          {taskAssignee?.metadata.name || "unassigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4 sm:gap-0">
                    <EditIcon className="sm:hidden size-3 text-slate-2" />
                    <p className="uppercase label-sm text-slate-3/40 hidden sm:block">
                      due date
                    </p>
                    <p className="text-slate-3/70 flex items-center gap-2">
                      <DateIcon className="sm:hidden" />
                      {formatDate(task.due_date)}
                    </p>
                  </div>
                </div>
              </Suspense>
            );
          })}
          <Link
            href={`/project/${projectId}/tasks/new?epic_id=${epic?.id}&epic_title=${epic?.title}`}
            className="flex items-center justify-center text-slate-2 gap-4 p-4 border border-slate-1 border-dashed w-full sm:hidden"
          >
            <CircledPlus />
            <span className="uppercase">add new task</span>
          </Link>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="capitalize title-md">tasks</h4>
            <Link
              href={`/project/${projectId}/tasks/new?epic_id=${epic?.id}&epic_title=${epic?.title}`}
            >
              <Button variant="secondary" className="capitalize">
                + add tasks
              </Button>
            </Link>
          </div>
          <div className="bg-surface-low flex flex-col items-center gap-6 rounded-lg p-10">
            <EmptyTasksIcon className="text-primary sm:text-slate-1 bg-surface-highest rounded-xl p-3 size-11" />
            <p className="title-md text-center">
              No tasks have been added to this epic yet
            </p>
            <Link
              href={`/project/${projectId}/tasks/new?epic_id=${epic?.id}&epic_title=${epic?.title}`}
            >
              <Button className="capitalize">+ add tasks</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default TaskList;
