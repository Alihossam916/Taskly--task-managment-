// types
import { Task } from "@/src/types/projectType";

// utils
import { getInitials } from "@/src/lib/utils/initials";
import { formatDate } from "@/src/lib/utils/formatDate";

// icons
import EditIcon from "../icons/editIcon";

// redux
import { useDispatch } from "react-redux";
import { openTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";

interface TaskListCardProp {
  task: Task;
  projectId: string;
}
const TaskListCard = ({ task, projectId }: TaskListCardProp) => {
  const dispatch = useDispatch();

  return (
    <tr
      onClick={() =>
        dispatch(
          openTaskDetails({
            taskId: task.id,
            projectId,
            epicId: task.epic_id,
          }),
        )
      }
      className="cursor-pointer"
    >
      <td className="py-4 px-4 md:px-10 text-left">
        <span className="body-md text-primary">{task.task_id}</span>
      </td>
      <td className="py-4 text-left">
        <span className="body-md font-semibold text-slate-3 truncate block max-w-xs">
          {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
        </span>
      </td>
      <td className="py-4 pr-10 text-left">
        <p
          className={`w-fit py-1 px-2 rounded-xs label-sm ${task.status === "DONE" ? `bg-success` : task.status === "BLOCKED" ? `bg-error/20 text-error` : `bg-surface-highest`}`}
        >
          {task.status}
        </p>
      </td>
      <td className="py-4 pr-10 body-md text-slate-2 text-left whitespace-nowrap">
        {task.due_date ? formatDate(task.due_date) : "—"}
      </td>
      <td className="py-4 pr-10 text-right flex gap-2 items-center">
        <span className="bg-primary-container p-2 rounded-full text-white">
          {getInitials(task.assignee?.name) || "UN"}
        </span>
        <span className="body-md text-slate-2">
          {task.assignee?.name || "Unassigned"}
        </span>
      </td>
      <td className="py-4 text-left">
        <EditIcon className="p-2 size-8 hover:bg-slate-1 text-slate-2 cursor-pointer transition-colors duration-200 rotate-90" />
      </td>
    </tr>
  );
};

export default TaskListCard;
