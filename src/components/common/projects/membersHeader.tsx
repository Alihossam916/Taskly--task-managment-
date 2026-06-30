"use client";
// components
import Button from "@/src/components/ui/button";
import BreadCrumb from "@/src/components/ui/breadCrumb";

// icons
import AddMemberIcon from "@/src/components/icons/addMemberIcon";

// types
import { Project } from "@/src/types/projectType";

// redux
import { useDispatch } from "react-redux";
import { openMembersModal } from "@/src/lib/redux/feature/membersModalSlice";

interface MembersHeaderProps {
  project: Project | null;
  projectId: string;
}

const MembersHeader = ({ project, projectId }: MembersHeaderProps) => {
  const dispatch = useDispatch();

  return (
    <>
      <BreadCrumb
        items={[
          { label: "projects", href: "/project" },
          { label: project?.name, href: `/project/${projectId}/edit` },
          { label: "members" },
        ]}
      />
      <div className="flex items-center justify-center sm:justify-between">
        <h1 className="headline-lg text-slate-3">Project Members</h1>
        <Button
          onClick={() => dispatch(openMembersModal())}
          className="hidden sm:flex w-fit items-center gap-2 rounded-xs!"
        >
          <AddMemberIcon />
          <span className="hidden sm:inline">Invite Member</span>
        </Button>
      </div>
    </>
  );
};

export default MembersHeader;
