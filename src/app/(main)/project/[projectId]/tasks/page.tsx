// components
import BreadCrumb from "@/src/components/ui/breadCrumb";
import TasksBoardView from "@/src/components/common/projects/tasksBoardView";
import TasksListView from "@/src/components/common/projects/tasksListView";
import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";

// lib
import { getProjectById } from "@/src/lib/api/projects/getProjectById";

// icons
import SearchIcon from "@/src/components/icons/searchIcon";
import BoardViewIcon from "@/src/components/icons/boardViewIcon";
import ListViewIcon from "@/src/components/icons/listViewIcon";
import FilterIcon from "@/src/components/icons/filterIcon";
import Link from "next/link";

interface Props {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ view?: string }>;
}

const ProjectTasksPage = async ({ params, searchParams }: Props) => {
  const { projectId } = await params;
  const { view } = await searchParams;
  const project = await getProjectById(projectId);

  return (
    <div className="mb-30 mt-5 max-w-full overflow-x-hidden">
      {/* page header */}
      <BreadCrumb
        items={[
          { label: "projects", href: "/project" },
          { label: project?.name, href: `/project/${projectId}/edit` },
          { label: "tasks" },
        ]}
      />
      <div className="flex flex-col sm:flex-row sm:items-end justify-center sm:justify-between gap-y-6 w-full">
        <div>
          <h1 className="headline-lg text-slate-3">Active Workboard</h1>
          <p className="text-slate-2 body-md hidden sm:block">
            Curating Project Alpha&apos;s production pipeline and milestones.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#6B7280]" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="rounded-xs pl-10 placeholder:text-[#6B7280] text-black"
            />
          </div>
          <div className="relative hidden sm:block">
            <BoardViewIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
            <select className="pl-8 border border-slate-1 rounded-xs h-12 px-4">
              <option value="board">Board View</option>
              <option value="list">List View</option>
            </select>
          </div>
          <Button className="bg-primary-container/30 hidden sm:block">
            <FilterIcon className="text-black" />
          </Button>
        </div>
        <Link
          href={`/project/${projectId}/tasks/new`}
          className="sm:hidden capitalize bg-primary text-white p-4 text-center rounded-md"
        >
          + create task
        </Link>
      </div>
      {view === "board" ? (
        <TasksBoardView projectId={projectId} />
      ) : (
        <TasksListView />
      )}
    </div>
  );
};

export default ProjectTasksPage;
