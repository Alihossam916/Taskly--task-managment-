// components
import TasksHeader from "@/src/components/common/projects/tasksHeader";
import TasksBoardView from "@/src/components/common/projects/tasksBoardView";
import TasksListView from "@/src/components/common/projects/tasksListView";
import TasksMobileView from "@/src/components/common/projects/tasksMobileView";

// lib
import { getProjectById } from "@/src/lib/api/projects/getProjectById";

interface Props {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ view?: string; page?: string }>;
}

const ProjectTasksPage = async ({ params, searchParams }: Props) => {
  const { projectId } = await params;
  const { view } = await searchParams;
  const project = await getProjectById(projectId);

  const currentPage = Number((await searchParams).page) || 1;
  const limit = 4;
  const offset = (currentPage - 1) * limit;

  return (
    <div className="mb-30 mt-5 max-w-full overflow-x-hidden">
      {/* page header */}
      <TasksHeader project={project} projectId={projectId} view={view} />
      {view === "board" || view === undefined ? (
        <TasksBoardView
          projectId={projectId}
          limit={limit}
        />
      ) : (
        <TasksListView
          projectId={projectId}
          currentPage={currentPage}
          limit={limit}
          offset={offset}
        />
      )}
      <TasksMobileView
        projectId={projectId}
        currentPage={currentPage}
        limit={limit}
        offset={offset}
      />
    </div>
  );
};

export default ProjectTasksPage;
