"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// components
import BreadCrumb from "@/src/components/ui/breadCrumb";
import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";

// icons
import SearchIcon from "@/src/components/icons/searchIcon";
import FilterIcon from "@/src/components/icons/filterIcon";
import { Project } from "@/src/types/projectType";

const ViewSelector = dynamic(() => import("./viewSelector"), { ssr: false });

const TasksHeader = ({
  project,
  projectId,
  view,
}: {
  project: Project | null;
  projectId: string;
  view: string | undefined;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(q);
  const [debouncedSearch, setDebouncedSearch] = useState(q);
  const [, startTransition] = useTransition();

  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    setSearchInput(q);
    setDebouncedSearch(q);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedSearch !== q) {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedSearch.trim()) {
          params.set("q", debouncedSearch.trim());
        } else {
          params.delete("q");
        }
        // Reset page to 1
        params.set("page", "1");
        router.push(`/project/${projectId}/tasks?${params.toString()}`);
      });
    }
  }, [debouncedSearch, q, projectId, router, searchParams]);

  return (
    <>
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="rounded-xs pl-10 placeholder:text-[#6B7280] text-black"
            />
          </div>
          <ViewSelector />
          <Button
            className={`bg-primary-container/30 ${view === `list` ? `hidden` : `hidden sm:block`}`}
          >
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
    </>
  );
};

export default TasksHeader;
