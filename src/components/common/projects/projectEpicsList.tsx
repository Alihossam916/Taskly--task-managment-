"use client";
import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// components
import Button from "../../ui/button";
import Input from "../../ui/input";
import BreadCrumb from "../../ui/breadCrumb";
import InfiniteScrollLoader from "../../ui/infiniteScrollLoader";
import Pagination from "../../ui/pagination";
import EpicDetailsModal from "./epicDetailsModal";
import TaskDetailsModal from "./taskDetailsModal";
import TaskDetailsMobile from "./taskDetailsMobile";

// types
import { ProjectEpicsListProps } from "@/src/types/projectType";
import { Epic } from "@/src/types/projectType";

// icons
import SearchIcon from "../../icons/searchIcon";
import EditIcon from "../../icons/editIcon";
import CreatedByIcon from "../../icons/createdByIcon";
import DateIcon from "../../icons/dateIcon";

// lib
import { formatDate } from "@/src/lib/utils/formatDate";
import { getInitials } from "@/src/lib/utils/initials";
import { getProjectEpics } from "@/src/lib/api/projects/getProjectEpics";

// hooks
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";

const ProjectEpicsList = ({
  project,
  projectId,
  epics,
  total,
  currentPage,
  limit,
  hasError = false,
}: ProjectEpicsListProps) => {
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") || "";
  const [prevQ, setPrevQ] = useState(q);
  const [searchInput, setSearchInput] = useState(q);
  const [debouncedSearch, setDebouncedSearch] = useState(q);

  const [isPending, startTransition] = useTransition();

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
        params.set("page", "1");
        router.push(`/project/${projectId}/epics?${params.toString()}`);
      });
    }
  }, [debouncedSearch, q, projectId, router, searchParams]);

  const {
    items: displayedEpics,
    loading,
    hasMore,
    loadMore: loadMoreEpics,
  } = useInfiniteScroll<Epic>(
    epics,
    total,
    currentPage,
    limit,
    async (l, o) => {
      const res = await getProjectEpics(
        projectId,
        l,
        o,
        q || undefined,
      );
      if (!res) return null;
      return { items: res.epics, total: res.total };
    },
  );

  const handleEpicClick = (epic: Epic) => {
    setSelectedEpic(epic);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-30 mt-5">
      <BreadCrumb
        items={[
          { label: "projects", href: "/project" },
          { label: project?.name, href: `/project/${projectId}/edit` },
          { label: "epics" },
        ]}
      />
      <div className="flex items-center justify-center sm:justify-between">
        <h1 className="hidden sm:block headline-lg text-slate-3">
          Project Epics
        </h1>
        <div className="flex items-center gap-10 w-full sm:w-fit">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#6B7280]" />
            <Input
              type="search"
              placeholder="Search epics..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="rounded-xs! pl-10 placeholder:text-[#6B7280] text-black"
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

      {hasError ? (
        <div className="text-center py-10">
          <p className="text-error body-md font-semibold">
            Failed to search epics
          </p>
        </div>
      ) : isPending ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 animate-pulse">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="bg-white rounded-xs p-4 space-y-4">
              <section className="flex items-center justify-between">
                <h6 className="bg-surface-highest w-24 h-8"></h6>
                <div className="w-10 h-10 bg-surface-highest rounded-xl" />
              </section>
              <h3 className="bg-surface-highest w-full h-8"></h3>
              <section className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-surface-highest size-12 rounded-xl"></div>
                  <div className="flex flex-col-reverse sm:flex-col">
                    <p className="w-40 h-6 bg-surface-highest"></p>
                  </div>
                </div>
              </section>
              <hr className="w-full h-2 bg-surface-highest border-none" />
              <section className="hidden sm:flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="bg-surface-highest h-6 w-24"></p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="bg-surface-highest h-6 w-24"></p>
                </div>
              </section>
            </div>
          ))}
        </section>
      ) : displayedEpics.length === 0 ? (
        <div className="text-center py-10">
          <p className="body-md text-slate-2">
            {q
              ? "No epics found matching your search"
              : "No epics found for this project"}
          </p>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            {displayedEpics.map((epic) => {
              const initials = getInitials(epic.assignee?.name || "U N");
              return (
                <div
                  key={epic.epic_id}
                  onClick={() => handleEpicClick(epic)}
                  className="bg-white sm:border-l-4 border-[#005235] rounded-xs p-4 space-y-4 cursor-pointer"
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
                        <p className="text-slate-2 body-md">
                          {epic.assignee?.name ? "Assignee" : "unassigned"}
                        </p>
                        <h5 className="text-slate-3 title-md">
                          {epic.assignee?.name}
                        </h5>
                      </div>
                    </div>
                    <div className="sm:hidden">
                      <p className="text-slate-2 uppercase label-sm">deadline</p>
                      <p className="text-slate-3 body-md">
                        {formatDate(epic.deadline)}
                      </p>
                    </div>
                  </section>
                  <section className="hidden sm:flex justify-between items-center border-t border-surface-low pt-2">
                    <div className="flex items-center gap-2">
                      <CreatedByIcon />
                      <p className="text-slate-2 label-sm">
                        Created by:{" "}
                        <span className="text-slate-3">
                          {epic.created_by?.name}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <DateIcon />
                      <p>{formatDate(epic.created_at)}</p>
                    </div>
                  </section>
                </div>
              );
            })}
          </section>

          {/* 5. Render the Modal */}
          {isModalOpen && selectedEpic && (
            <EpicDetailsModal
              epicId={selectedEpic.id}
              projectId={projectId}
              onClose={() => setIsModalOpen(false)}
            />
          )}

          {/* pagination and infinite scroll */}
          <InfiniteScrollLoader
            loading={loading}
            hasMore={hasMore}
            hasItems={displayedEpics.length > 0}
            onLoadMore={loadMoreEpics}
            label={"epics"}
          />
          <div className="mt-20">
            <Pagination
              basePath={`/project/${projectId}/epics`}
              currentPage={currentPage}
              limit={limit}
              total={total}
              displayedCount={displayedEpics.length}
              itemLabel="epics"
            />
          </div>
        </>
      )}

      <Link
        href={`/project/${projectId}/epics/new`}
        className="fixed sm:hidden p-4 bg-primary size-12 bottom-30 right-5 z-40 text-white text-2xl rounded-sm flex items-center justify-center"
      >
        +
      </Link>
      <TaskDetailsModal />
      <TaskDetailsMobile />
    </div>
  );
};

export default ProjectEpicsList;
