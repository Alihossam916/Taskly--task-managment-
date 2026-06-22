// components
import TasksHeader from "@/src/components/common/projects/tasksHeader";
import TasksBoardView from "@/src/components/common/projects/tasksBoardView";
import TasksListView from "@/src/components/common/projects/tasksListView";
import TasksMobileView from "@/src/components/common/projects/tasksMobileView";

// lib
import { getProjectById } from "@/src/lib/api/projects/getProjectById";

interface Props {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ view?: string }>;
}

const ProjectTasksPage = async ({ params, searchParams }: Props) => {
  const { projectId } = await params;
  const { view } = await searchParams;
  const project = await getProjectById(projectId);

  return (
    <div className="mb-30 mt-5 max-w-full overflow-x-hidden">
      {/* page header */}
      <TasksHeader project={project} projectId={projectId} />
      {view === "board" ? (
        <TasksBoardView projectId={projectId} />
      ) : (
        <TasksListView />
      )}
      <TasksMobileView projectId={projectId} />
    </div>
  );
};

export default ProjectTasksPage;
