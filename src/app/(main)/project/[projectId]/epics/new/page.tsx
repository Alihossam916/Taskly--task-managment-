// components
import AddNewEpic from "@/src/components/common/projects/addNewEpic";
import BreadCrumb from "@/src/components/ui/breadCrumb";

// lib
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";
import { getProjectById } from "@/src/lib/api/projects/getProjectById";

interface Props {
  params: Promise<{ projectId: string }>;
}

const AddEpicPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const [members, project] = await Promise.all([
    getProjectMembers(projectId),
    getProjectById(projectId),
  ]);

  return (
    <div className="md:px-20 mb-30 mt-5">
      <BreadCrumb
        items={[
          { label: "projects", href: "/project" },
          { label: project?.name, href: `/project/${projectId}/edit` },
          { label: "epics", href: `/project/${projectId}/epics` },
          { label: "new epic" },
        ]}
      />
      <div className="mt-5">
        <h1 className="headline-lg text-slate-3">Create New Epic</h1>
        <p className="text-slate-2 hidden sm:block">
          Define a major project phase or high-level milestone to group <br />
          related tasks and track architectural progress.
        </p>
        <p className="text-slate-2 sm:hidden">
          Define a high-level goal and organizational <br /> structure for your
          architectural phase.
        </p>
      </div>
      <AddNewEpic members={members || []} projectId={projectId} />
    </div>
  );
};

export default AddEpicPage;
