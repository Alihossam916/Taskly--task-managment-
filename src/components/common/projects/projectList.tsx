"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

// lib
import { getProjects } from "@/src/lib/api/projects/getProjects";

// types
import { Project, ProjectListProps } from "@/src/types/projectType";
import EditIcon from "@/src/components/icons/editIcon";

// icons
import DateIcon from "@/src/components/icons/dateIcon";
import CircledPlus from "@/src/components/icons/circledPlus";

// components
import Button from "@/src/components/ui/button";
import Pagination from "../../ui/pagination";
import InfiniteScrollLoader from "../../ui/infiniteScrollLoader";

// hooks
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";

const ProjectList = ({
  projects: initialProjects,
  total,
  currentPage,
  limit,
}: ProjectListProps) => {
  const router = useRouter();
  const {
    items: displayedProjects,
    loading,
    hasMore,
    loadMore: loadMoreProjects,
  } = useInfiniteScroll(
    initialProjects,
    total,
    currentPage,
    limit,
    async (l, o) => {
      const res = await getProjects(l, o);
      return { items: res.projects, total: res.total };
    },
  );

  return (
    <div className="mt-5 mb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="headline-lg text-slate-3">Projects</h1>
          <p className="body-md text-slate-2">
            Manage and curate your projects
          </p>
        </div>
        <Link href={"/project/add"} className="hidden sm:block">
          <Button className="flex items-center gap-2 w-fit rounded-xs!">
            + Create New Project
          </Button>
        </Link>
      </div>
      {/* display projects */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayedProjects.map((project: Project) => {
          const createdAt = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(project.created_at));
          return (
            <div
              key={project.id}
              onClick={() => router.push(`/project/${project.id}/epics`)}
              className="w-full h-52 flex flex-col justify-between bg-white p-4 rounded-sm mx-auto hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold title-md text-slate-3">
                    {project.name}
                  </h3>
                  <Link
                    href={`/project/${project.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EditIcon className="size-7 text-slate-1 p-2 rounded-xs hover:bg-surface-low transition-colors duration-200" />
                  </Link>
                </div>
                {project.description && (
                  <p className="text-slate-2 text-sm body-md overflow-y-hidden">
                    {project.description}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="uppercase hidden sm:block">created at</p>
                <div className="flex items-center gap-2">
                  <DateIcon className="sm:hidden" />
                  <p>{createdAt}</p>
                </div>
              </div>
            </div>
          );
        })}
        <Link
          href={"/project/add"}
          className="flex flex-col items-center justify-center gap-2 w-full h-52 bg-white p-4 rounded-sm mx-auto hover:shadow-md transition-all duration-200"
        >
          <CircledPlus className="text-slate-3! bg-surface-low p-3 size-10 rounded-md" />
          <h3 className="uppercase font-bold body-md text-slate-3">
            add project
          </h3>
        </Link>
      </section>
      {/* pagination and infinite scroll */}
      <InfiniteScrollLoader
        loading={loading}
        hasMore={hasMore}
        hasItems={displayedProjects.length > 0}
        onLoadMore={loadMoreProjects}
      />
      <Pagination
        basePath="/project"
        currentPage={currentPage}
        limit={limit}
        total={total}
        displayedCount={displayedProjects.length}
        itemLabel="active projects"
      />{" "}
      <Link
        href={"/project/add"}
        className="fixed sm:hidden p-4 bg-primary size-12 bottom-30 right-5 z-50 text-white text-2xl rounded-sm flex items-center justify-center"
      >
        +
      </Link>
    </div>
  );
};

export default ProjectList;
