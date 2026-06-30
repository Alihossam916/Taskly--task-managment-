"use client";
// icons
import AddMemberIcon from "@/src/components/icons/addMemberIcon";
import EditIcon from "@/src/components/icons/editIcon";

// components
import Badge from "@/src/components/ui/badge";

// utils
import { getInitials } from "@/src/lib/utils/initials";
import { Member } from "@/src/types/projectType";

// redux
import { useDispatch } from "react-redux";
import { openMembersModal } from "@/src/lib/redux/feature/membersModalSlice";
import InviteMemberMobile from "./inviteMemberMobile";

const MembersMobile = ({
  members,
  projectId,
}: {
  members: Member[] | null;
  projectId: string;
}) => {
  const dispatch = useDispatch();

  return (
    <div className="sm:hidden space-y-4 mt-6">
      {members?.map((member) => {
        const initials = getInitials(member.metadata.name || "Unknown Member");

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
                <p className="body-md text-slate-2 truncate">{member.email}</p>
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
      <button
        onClick={() => dispatch(openMembersModal())}
        className="fixed sm:hidden bg-primary size-12 bottom-30 right-5 z-50 text-white rounded-md flex items-center justify-center"
      >
        <AddMemberIcon />
      </button>
      <InviteMemberMobile projectId={projectId} />
    </div>
  );
};

export default MembersMobile;
