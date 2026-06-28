// utils
import { getInitials } from "@/src/lib/utils/initials";
import { formatDate } from "@/src/lib/utils/formatDate";

// icons
import EditIcon from "../icons/editIcon";

// redux
import { useDispatch } from "react-redux";
import { openTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";
import { Task } from "@/src/types/projectType";

interface TaskMobileCardProp {
  task: Task;
  projectId: string;
}

const TaskMobileCard = ({ task, projectId }: TaskMobileCardProp) => {
  const dispatch = useDispatch();

  return (
    <div
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
            {getInitials(task.assignee?.name) || "UN"}
          </span>
          <div>
            <p className="uppercase label-sm text-slate-2/70">due date</p>
            <p className="uppercase label-sm text-slate-3">
              {formatDate(task.due_date) || "No due date"}
            </p>
          </div>
        </div>
        <EditIcon className="text-slate-2/70 p-2 size-8" />
      </div>
    </div>
  );
};

export default TaskMobileCard;
