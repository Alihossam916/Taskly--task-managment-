"use client";
import { useEffect } from "react";

// types
import { Epic } from "@/src/types/projectType";

// libs
import { formatDate } from "@/src/lib/utils/formatDate";
import { getInitials } from "@/src/lib/utils/initials";

// components
import Button from "../../ui/button";

// icons
import EpicIdIcon from "../../icons/epicIdIcon";
import DateIcon from "../../icons/dateIcon";
import UnassignedIcon from "../../icons/unassignedIcon";
import EmptyTasksIcon from "../../icons/emptyTasksIcon";

interface EpicDetailsModalProps {
  epic: Epic;
  onClose: () => void;
}

const EpicDetailsModal = ({ epic, onClose }: EpicDetailsModalProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const assigneeInitials = getInitials(epic.assignee?.name);
  const creatorInitials = getInitials(epic.created_by.name);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <span className="flex gap-2 label-sm text-slate-2 rounded-xs">
              <EpicIdIcon />
              {epic.epic_id}
            </span>
            <h3 className="headline-lg text-2xl text-slate-3 capitalize truncate max-w-md">
              {epic.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-2 hover:text-error transition-colors p-2 cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Title and Description */}
          <section className="space-y-4">
            <p className="body-md text-slate-2 leading-relaxed">
              {epic.description || "No description provided."}
            </p>
          </section>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-6">
            {/* created by */}
            <div className="space-y-3">
              <p className="label-sm text-slate-1 uppercase">Created By</p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold">
                  {creatorInitials}
                </div>
                <div>
                  <h5 className="text-slate-3 body-md leading-none">
                    {epic.created_by?.name}
                  </h5>
                </div>
              </div>
            </div>

            {/* assignee */}
            <div className="space-y-3">
              <p className="label-sm text-slate-1 uppercase">Assignee</p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                  {assigneeInitials || <UnassignedIcon className="size-4" />}
                </div>
                <div>
                  <h5 className="text-slate-3 body-md leading-none">
                    {epic.assignee?.name || "Unassigned"}
                  </h5>
                </div>
              </div>
            </div>

            {/* deadline */}
            <div className="space-y-3 sm:space-y-5">
              <p className="label-sm text-slate-1 uppercase">Deadline</p>
              <div className="flex items-center gap-3 text-slate-3">
                <DateIcon className="size-5" />
                <span className="body-md font-medium">
                  {epic.deadline
                    ? formatDate(epic.deadline)
                    : "No deadline set"}
                </span>
              </div>
            </div>

            {/* created at */}
            <div className="space-y-3">
              <p className="label-sm text-slate-1 uppercase">Created At</p>
              <div className="flex items-center gap-3 text-slate-3">
                <DateIcon className="size-5" />
                <span className="body-md font-medium">
                  {formatDate(epic.created_at)}
                </span>
              </div>
            </div>
          </div>
          <section>
            <div className="flex justify-between items-center">
              <h4 className="capitalize">tasks</h4>
              <Button variant="secondary" className="capitalize">
                + add tasks
              </Button>
            </div>
            <div className="bg-surface-low flex flex-col items-center gap-6 rounded-lg p-10">
              <EmptyTasksIcon className="text-primary sm:text-slate-1 bg-surface-highest rounded-xl p-3 size-11" />
              <p className="title-md text-center">
                No tasks have been added to this epic yet
              </p>
              <Button className="capitalize">+ add tasks</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EpicDetailsModal;
