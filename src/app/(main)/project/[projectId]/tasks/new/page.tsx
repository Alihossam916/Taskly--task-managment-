// components
import BreadCrumb from "@/src/components/ui/breadCrumb";
import AddNewTask from "@/src/components/common/projects/addNewTask";

// lib
import { getProjectById } from "@/src/lib/api/projects/getProjectById";

interface Props {
  params: Promise<{ projectId: string }>;
}

const AddTaskPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  return (
    <div className="md:px-20 mb-30 mt-5">
      <BreadCrumb
        items={[
          { label: "projects", href: "/project" },
          { label: project?.name, href: `/project/${projectId}/edit` },
          { label: "tasks", href: `/project/${projectId}/tasks` },
          { label: "new task" },
        ]}
      />
      <div className="mt-5">
        <h1 className="headline-lg text-slate-3">Create New Task</h1>
        <p className="text-slate-2">
          Initialize a new work item within the Architectural Workspace
          ecosystem.
        </p>
      </div>
      <AddNewTask projectId={projectId} />
    </div>
  );
};

export default AddTaskPage;
