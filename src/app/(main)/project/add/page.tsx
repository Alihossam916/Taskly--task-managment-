import Link from "next/link";
import Button from "@/src/components/ui/button";
import AddMemberIcon from "@/src/components/icons/addMemberIcon";
import AddNewProject from "@/src/components/common/projects/addNewProject";

const AddProject = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Link href={"/project"} className="uppercase label-sm text-slate-2">
          Projects
        </Link>
        <span className="text-slate-1">{">"}</span>
        <p className="uppercase label-sm text-primary">
          Add new projects
        </p>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="headline-lg text-slate-3">Add New Project</h1>
        <Button className="w-fit flex items-center gap-2 rounded-xs!">
          <AddMemberIcon />
          <span>Invite Member</span>
        </Button>
      </div>
      <AddNewProject />
    </div>
  );
};

export default AddProject;
