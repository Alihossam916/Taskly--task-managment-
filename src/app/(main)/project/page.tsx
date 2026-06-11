import Link from "next/link";
import { Suspense } from "react";

// lib
import { getProjects } from "@/src/lib/api/projects/getProjects";

// icons
import NoProjectsIcon from "@/src/components/icons/noProjectsIcon";
import CircledPlus from "@/src/components/icons/circledPlus";

// components
import Button from "@/src/components/ui/button";
import ProjectList from "@/src/components/common/projects/projectList";
import ProjectSkeleton from "@/src/components/common/projects/projectSkeleton";

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const currentPage = Number((await searchParams).page) || 1;
  const limit = 5;
  const offset = (currentPage - 1) * limit;

  const { projects, total } = await getProjects(limit, offset);
  // ---------- Empty state ----------
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col gap-8 items-center mx-auto my-20">
        <NoProjectsIcon />
        <h1 className="headline-lg text-slate-3">No Projects</h1>
        <p className="body-md text-slate-2 text-center font-semibold">
          You don&apos;t have any projects yet. Start by defining <br /> your
          first architectural workspace to begin tracking <br /> tasks and
          epics.
        </p>
        <Link href={"/project/add"}>
          <Button className="flex items-center gap-2 w-fit rounded-xs!">
            <CircledPlus />
            <span>Create New Project</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectList
        projects={projects}
        total={total}
        currentPage={currentPage}
        limit={limit}
      />
    </Suspense>
  );
}
