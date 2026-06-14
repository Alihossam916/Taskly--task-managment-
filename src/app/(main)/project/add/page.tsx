// icons
import AddMemberIcon from "@/src/components/icons/addMemberIcon";

// components
import AddNewProject from "@/src/components/common/projects/addNewProject";
import Button from "@/src/components/ui/button";
import BreadCrumb from "@/src/components/ui/breadCrumb";

const AddProject = () => {
  return (
    <div>
      <BreadCrumb
        items={[
          { label: "projects", href: "/project" },
          { label: "add new projects" },
        ]}
      />
      <div className="hidden sm:flex items-center justify-between">
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
