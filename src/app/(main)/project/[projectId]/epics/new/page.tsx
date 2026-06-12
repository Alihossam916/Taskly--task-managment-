import Link from "next/link";
import AddNewEpic from "@/src/components/common/projects/addNewEpic";

// lib
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";
import { getProjectById } from "@/src/lib/api/projects/getProjectById";

interface Props {
  params: Promise<{ projectId: string }>;
}

const AddEpicPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const members = await getProjectMembers(projectId);
  const project = await getProjectById(projectId);

  return (
    <div className="md:px-20 mb-30 mt-5">
      <div className="flex items-center gap-2">
        <Link href={"/project"} className="uppercase label-sm text-slate-2">
          Projects
        </Link>
        <span className="text-slate-1">{">"}</span>
        <Link
          href={`/project/${projectId}/epics`}
          className="uppercase label-sm text-slate-2"
        >
          {project?.name}
        </Link>
        <span className="text-slate-1">{">"}</span>
        <Link
          href={`/project/${projectId}/epics`}
          className="uppercase label-sm text-slate-2"
        >
          epics
        </Link>
        <span className="text-slate-1">{">"}</span>
        <p className="uppercase label-sm text-primary">New Epic</p>
      </div>
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
