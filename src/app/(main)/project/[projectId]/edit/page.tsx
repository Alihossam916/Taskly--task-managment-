// icons
import AddMemberIcon from "@/src/components/icons/addMemberIcon";

// components
import Button from "@/src/components/ui/button";
import EditProjectForm from "@/src/components/common/projects/editProjectForm";
import BreadCrumb from "@/src/components/ui/breadCrumb";

// lib
import { getProjectById } from "@/src/lib/api/projects/getProjectById";

interface Props {
  params: Promise<{ projectId: string }>;
}

async function ProjectEditPage({ params }: Props) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  return (
    <div className="mb-30 mt-5">
      <BreadCrumb
        items={[
          { label: "projects", href: "/project" },
          { label: project?.name, href: `/project/${projectId}/edit` },
          { label: "edit" },
        ]}
      />
      <div className="hidden sm:flex items-center justify-between">
        <h1 className="headline-lg text-slate-3">Edit Project</h1>
        <Button className="w-fit flex items-center gap-2 rounded-xs!">
          <AddMemberIcon />
          <span>Invite Member</span>
        </Button>
      </div>
      {project && <EditProjectForm project={project} />}
    </div>
  );
}

export default ProjectEditPage;
