// icons
import AddMemberIcon from "@/src/components/icons/addMemberIcon";

// components
import Button from "@/src/components/ui/button";
import Badge from "@/src/components/ui/badge";
import BreadCrumb from "@/src/components/ui/breadCrumb";

// lib
import { getProjectById } from "@/src/lib/api/projects/getProjectById";
import { getProjectMembers } from "@/src/lib/api/projects/getProjectMembers";
import EditIcon from "@/src/components/icons/editIcon";
import { getInitials } from "@/src/lib/utils/initials";

interface Props {
  params: Promise<{ projectId: string }>;
}

const ProjectMembersPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  const members = await getProjectMembers(projectId);

  return (
    <div className="mb-30 mt-5">
      <BreadCrumb
        items={[
          { label: "projects", href: "/project" },
          { label: project?.name, href: `/project/${projectId}/edit` },
          { label: "members" },
        ]}
      />
      <div className="flex items-center justify-center sm:justify-between">
        <h1 className="headline-lg text-slate-3">Project Members</h1>
        <Button className="hidden sm:flex w-fit items-center gap-2 rounded-xs!">
          <AddMemberIcon />
          <span className="hidden sm:inline">Invite Member</span>
          <span className="sm:hidden">Invite</span>
        </Button>
      </div>
      {project && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto mt-20">
            <table className="border border-slate-1 w-full max-w-5xl mx-auto min-w-150">
              <thead className="bg-surface-low">
                <tr className="uppercase">
                  <th className="py-4 pl-4 md:pl-10 text-left w-1/2 whitespace-nowrap">
                    member
                  </th>
                  <th className="py-4 text-left w-1/4 whitespace-nowrap">
                    role
                  </th>
                  <th className="py-4 pr-10 text-right w-1/4 whitespace-nowrap">
                    actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {members?.map((member) => {
                  const initials = getInitials(
                    member.metadata.name || "Unknown Member",
                  );
                  return (
                    <tr
                      key={member.member_id}
                      className="border border-slate-1"
                    >
                      <td className="py-4 px-4 md:px-10">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="title-md font-bold size-10 md:size-12 rounded-xl bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="body-md font-semibold text-slate-3 truncate">
                              {member.metadata.name}
                            </p>
                            <p className="body-md text-slate-2 truncate">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge>{member.role}</Badge>
                      </td>
                      <td>
                        <div className="flex justify-end pr-10">
                          {member.role != "owner" && (
                            <EditIcon className="p-2 hover:bg-slate-1 cursor-pointer transition-colors duration-200" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-4 mt-6">
            {members?.map((member) => {
              const initials = getInitials(
                member.metadata.name || "Unknown Member",
              );

              return (
                <div
                  key={member.member_id}
                  className="bg-white rounded-sm p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="title-md font-bold size-10 rounded-xl bg-primary-container/30 text-primary flex items-center justify-center">
                      {initials}
                    </div>
                    <div className="flex flex-col">
                      <p className="body-md font-semibold text-slate-3">
                        {member.metadata.name}
                      </p>
                      <p className="body-md text-slate-2 truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className="rounded-none!">{member.role}</Badge>

                    {member.role != "owner" && (
                      <EditIcon className="p-2 hover:bg-slate-1 cursor-pointer transition-colors duration-200" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="fixed sm:hidden bg-primary size-12 bottom-30 right-5 z-50 text-white rounded-md flex items-center justify-center">
            <AddMemberIcon />
          </button>
        </>
      )}
    </div>
  );
};

export default ProjectMembersPage;
