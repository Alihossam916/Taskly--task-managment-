import Link from "next/link";

// icons
import CircledPlus from "../../icons/circledPlus";

const TasksBoardView = ({ projectId }: { projectId: string }) => {
  const status = [
    "TO_DO",
    "IN_PROGRESS",
    "BLOCKED",
    "IN_REVIEW",
    "READY_FOR_QA",
    "REOPENED",
    "READY_FOR_PRODUCTION",
    "DONE",
  ];
  return (
    <section className="flex items-center gap-4 overflow-x-auto w-full">
      {status.map((state) => {
        return (
          <div key={state} className="w-xs flex flex-col items-center">
            <div className="flex items-center justify-between w-full p-2">
              <h5>{state.replace("_", " ")}</h5>
              <Link href={`/project/${projectId}/tasks/new?status=${state}`} className="text-xl hover:bg-slate-1 transition-colors duration-200 p-2">
                +
              </Link>
            </div>
            <Link
              href={`/project/${projectId}/tasks/new?status=${state}`}
              className="flex items-center justify-center text-slate-2 gap-4 p-4 border border-slate-1 border-dashed w-full"
            >
              <CircledPlus />
              <span className="uppercase">add new task</span>
            </Link>
          </div>
        );
      })}
    </section>
  );
};

export default TasksBoardView;
