// components
import MembersHeader from "@/src/components/common/projects/membersHeader";
import MembersTable from "@/src/components/common/projects/membersTable";
import MembersMobile from "@/src/components/common/projects/membersMobile";

// lib
import { getProjectById } from "@/src/lib/api/projects/getProjectById";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";

interface Props {
  params: Promise<{ projectId: string }>;
}

const ProjectMembersPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const [project, members] = await Promise.all([
    getProjectById(projectId),
    getProjectMembers(projectId),
  ]);
  return (
    <div className="mb-30 mt-5">
      <MembersHeader project={project} projectId={projectId} />
      {project && (
        <>
          {/* Desktop table */}
          <MembersTable members={members} projectId={projectId} />
          {/* Mobile cards */}
          <MembersMobile members={members} projectId={projectId} />
        </>
      )}
    </div>
  );
};

export default ProjectMembersPage;
