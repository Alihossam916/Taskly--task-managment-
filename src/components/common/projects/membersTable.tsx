"use client";
// components
import Badge from "@/src/components/ui/badge";
import InviteMemberModal from "./inviteMemberModal";

// utils
import { getInitials } from "@/src/lib/utils/initials";

// icons
import EditIcon from "@/src/components/icons/editIcon";

// types
import { Member } from "@/src/types/projectType";

const MembersTable = ({
  members,
  projectId,
}: {
  members: Member[] | null;
  projectId: string;
}) => {
  return (
    <div className="hidden sm:block overflow-x-auto mt-20">
      <table className="border border-slate-1 w-full max-w-5xl mx-auto min-w-150">
        <thead className="bg-surface-low">
          <tr className="uppercase">
            <th className="py-4 pl-4 md:pl-10 text-left w-1/2 whitespace-nowrap">
              member
            </th>
            <th className="py-4 text-left w-1/4 whitespace-nowrap">role</th>
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
              <tr key={member.member_id} className="border border-slate-1">
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
      {/* invite members modal */}
      <InviteMemberModal projectId={projectId} />
    </div>
  );
};

export default MembersTable;
