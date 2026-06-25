import Link from "next/link";

const EmptyTasks = ({
  projectId,
  title = "No tasks found for this project",
  description = "Get started by creating your first task",
}: {
  projectId: string;
  title?: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 mt-10">
      <div className="size-16 bg-surface-low rounded-full flex items-center justify-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
            stroke="#4F5F7B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="headline-lg text-slate-3 mb-2">{title}</h3>
        <p className="body-md text-slate-2">
          {description}
        </p>
      </div>
      <Link
        href={`/project/${projectId}/tasks/new`}
        className="bg-primary text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium"
      >
        Add new task
      </Link>
    </div>
  );
};

export default EmptyTasks;
