import Link from "next/link";

// lib
import { getProjects } from "@/src/lib/api/projects/getProjects";

// icons
import NoProjectsIcon from "@/src/components/icons/noProjectsIcon";
import CircledPlus from "@/src/components/icons/circledPlus";

// components
import Button from "@/src/components/ui/button";

// types
import { Project } from "@/src/types/projectType";

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
        {projects.map((project: Project) => {
          const createdAt = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(project.created_at));
          return (
            <div
              key={project.id}
              className="w-full h-52 flex flex-col justify-between bg-white p-4 rounded-sm mx-auto hover:shadow-md transition-all duration-200"
            >
              <div>
                <h3 className="font-semibold title-md text-slate-3">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-slate-2 text-sm body-md overflow-y-hidden">
                    {project.description}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="uppercase">created at</p>
                <p>{createdAt}</p>
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
      <div className="hidden sm:flex items-center justify-between mt-40">
        <p>
          Showing {limit > projects.length ? projects.length : limit} of {total}{" "}
          active projects
        </p>

        {/* pagination */}
        <div className="hidden sm:flex items-center justify-between gap-2">
          <Link
            href={`/project?page=${currentPage - 1}`}
            className={`px-3 py-2 rounded-xs text-sm font-medium transition border border-slate-1 ${
              currentPage <= 1
                ? "pointer-events-none opacity-40"
                : "bg-white hover:shadow-sm"
            }`}
          >
            {"<"}
          </Link>
          {Array.from(
            { length: Math.ceil(total / limit) },
            (_, i) => i + 1,
          ).map((page) => (
            <Link
              key={page}
              href={`/project?page=${page}`}
              className={`size-9 flex items-center justify-center rounded-xs border border-slate-1 text-sm font-medium transition ${
                page === currentPage
                  ? "bg-primary text-white"
                  : "bg-white hover:shadow-sm"
              }`}
            >
              {page}
            </Link>
          ))}
          <Link
            href={`/project?page=${currentPage + 1}`}
            className={`px-3 py-2 rounded-xs text-sm font-medium transition border border-slate-1 ${
              currentPage >= Math.ceil(total / limit)
                ? "pointer-events-none opacity-40"
                : "bg-white hover:shadow-sm"
            }`}
          >
            {">"}
          </Link>
        </div>
      </div>
      <Link
        href={"/project/add"}
        className="fixed sm:hidden p-4 bg-primary size-12 bottom-30 right-5 z-50 text-white text-2xl rounded-sm flex items-center justify-center"
      >
        +
      </Link>
    </div>
  );
}
