"use client";
import Link from "next/link";

// components
import Button from "../../ui/button";

// types
import { Epic, Project } from "@/src/types/projectType";
import Input from "../../ui/input";
import SearchIcon from "../../icons/searchIcon";
import EditIcon from "../../icons/editIcon";
import CreatedByIcon from "../../icons/createdByIcon";
import DateIcon from "../../icons/dateIcon";

const ProjectEpicsList = ({
  project,
  projectId,
  epics,
}: {
  project: Project | null;
  projectId: string;
  epics: Epic[];
}) => {
  return (
    <div className="mb-30 mt-5">
      <div className="hidden sm:flex items-center gap-2">
        <Link href={"/project"} className="uppercase label-sm text-slate-2">
          Projects
        </Link>
        <span className="text-slate-1">{">"}</span>
        <Link
          href={`/project/${projectId}/epics`}
          className="uppercase label-sm text-slate-2"
        >
          {project?.name}
        </Link>
        <span className="text-slate-1">{">"}</span>
        <p className="uppercase label-sm text-primary">epics</p>
      </div>
      <div className="flex items-center justify-center sm:justify-between">
        <h1 className="hidden sm:block headline-lg text-slate-3">
          Project Epics
        </h1>
        <div className="flex items-center gap-10 w-full sm:w-fit">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#6B7280]" />
            <Input
              type="search"
              placeholder="Search Epics..."
              className="rounded-xs! pl-10"
            />
          </div>
          <Link
            href={`/project/${projectId}/epics/new`}
            className="hidden sm:block"
          >
            <Button className="hidden sm:flex w-36 items-center justify-center gap-2 rounded-xs!">
              <span className="hidden sm:inline">+ New Epic</span>
            </Button>
          </Link>
        </div>
      </div>
      {epics && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
          {epics.map((epic) => {
            const initials = (epic.assignee?.name || "Unknown Member")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={epic.epic_id}
                className="bg-white sm:border-l-4 border-[#005235] rounded-xs p-4 space-y-4"
              >
                <section className="flex items-center justify-between">
                  <h6 className="label-sm px-4 py-2 bg-success">
                    {epic.epic_id}
                  </h6>
                  <EditIcon className="p-2 rotate-90 sm:rotate-0 hover:bg-surface-low transition-colors duration-200 cursor-pointer" />
                </section>
                <h3 className="title-md text-slate-3">{epic.title}</h3>
                <section className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="title-md font-bold size-10 md:size-12 rounded-xl bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col-reverse sm:flex-col">
                      <p className="text-slate-2 body-md">Assignee</p>
                      <h5 className="text-slate-3 title-md">
                        {epic.assignee?.name}
                      </h5>
                    </div>
                  </div>
                  <div className="sm:hidden">
                    <p className="text-slate-2 uppercase label-sm">deadline</p>
                    <p className="text-slate-3 body-md">{epic.deadline}</p>
                  </div>
                </section>
                <section className="hidden sm:flex justify-between items-center border-t border-surface-low pt-2">
                  <div className="flex items-center gap-2">
                    <CreatedByIcon />
                    <p className="text-slate-2 label-sm">
                      Created by:{" "}
                      <span className="text-slate-3">
                        {epic.assignee?.name}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DateIcon />
                    <p>{epic.deadline}</p>
                  </div>
                </section>
              </div>
            );
          })}
        </section>
      )}
      <section className="hidden sm:flex justify-between items-center mt-30">
        <p>
          Showing {epics.length} of {epics.length} active projects
        </p>

        {/* pagination */}
        <div className="hidden sm:flex items-center justify-between gap-2">
          <Link
            href={``}
            className={`px-3 py-2 rounded-xs text-sm font-medium transition border border-slate-1`}
          >
            {"<"}
          </Link>
          <Link
            href={``}
            className={`size-9 flex items-center justify-center rounded-xs border border-slate-1 bg-primary text-white text-sm font-medium transition`}
          >
            1
          </Link>
          <Link
            href={``}
            className={`px-3 py-2 rounded-xs text-sm font-medium transition border border-slate-1`}
          >
            {">"}
          </Link>
        </div>
      </section>
      <Link
        href={`/project/${projectId}/epics/new`}
        className="fixed sm:hidden p-4 bg-primary size-12 bottom-30 right-5 z-50 text-white text-2xl rounded-sm flex items-center justify-center"
      >
        +
      </Link>
    </div>
  );
};

export default ProjectEpicsList;
