"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { toast } from "react-toastify";

// validation libraries
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// schemas
import { AddEpicFormData } from "@/src/lib/schemas/addEpicSchema";
import { addEpicSchema } from "@/src/lib/schemas/addEpicSchema";

// types
import { Epic } from "@/src/types/projectType";

// libs
import { formatDate } from "@/src/lib/utils/formatDate";
import { getInitials } from "@/src/lib/utils/initials";
import { editEpicApi } from "@/src/lib/api/projects/editEpic";
import { getEpicDetails } from "@/src/lib/api/projects/getEpicDetails";

// components
import EpicTitleInput from "./updateEpic/epicTitleInput";
import EpicDescription from "./updateEpic/epicDescription";
import EpicAssigneeSelect from "./updateEpic/epicAssigneeSelect";
import Spinner from "../../ui/spinner";

// icons
import EpicIdIcon from "../../icons/epicIdIcon";
import DateIcon from "../../icons/dateIcon";
import UnassignedIcon from "../../icons/unassignedIcon";
import EpicDeadlineInput from "./updateEpic/epicDeadlineInput";

interface EpicDetailsModalProps {
  epicId: string;
  projectId: string;
  onClose: () => void;
}

const DynamicTaskList = dynamic(() => import("./taskList"), {
  loading: () => <Spinner className="border-slate-3" />,
});

const EpicDetailsModal = ({
  epicId,
  projectId,
  onClose,
}: EpicDetailsModalProps) => {
  const [epic, setEpic] = useState<Epic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState({
    assignee: false,
    deadline: false,
  });
  const router = useRouter();

  //   initials
  const assigneeInitials = getInitials(epic?.assignee?.name);
  const creatorInitials = getInitials(epic?.created_by.name);

  const methods = useForm<AddEpicFormData>({
    resolver: zodResolver(addEpicSchema),
    defaultValues: {
      title: epic?.title,
      description: epic?.description || "No description provided",
      assignee_id: epic?.assignee?.sub || "unassigned",
      deadline: epic?.deadline || "",
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    async function handleEpicDetails() {
      try {
        const response = await getEpicDetails(projectId, epicId);
        setEpic(response[0]);
      } catch (error) {
        console.error("failed to fetch epic details:", error);
      }
    }
    handleEpicDetails();

    // Prevent scrolling
    document.body.style.overflow = "hidden";

    // keeps scroll after closing modal
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [projectId, epicId]);

  // refreshes the default values of the inputs after updating
  useEffect(() => {
    reset({
      title: epic?.title,
      description: epic?.description || "No description provided",
      assignee_id: epic?.assignee?.sub || "unassigned",
      deadline: epic?.deadline || "",
    });
  }, [epic, reset]);

  // form submition logic
  const onSubmit: SubmitHandler<AddEpicFormData> = async (data) => {
    const payload = {
      epicId: epic!.id,
      title: data.title,
      description: data.description ?? null,
      assignee_id: !data.assignee_id ? "unassigned" : data.assignee_id,
      deadline: data.deadline ?? null,
    };
    setIsLoading(true);
    try {
      const [action, response] = await Promise.all([
        editEpicApi(payload),
        getEpicDetails(projectId, epicId),
      ]);
      setEpic(response[0]);

      setEditMode({
        assignee: false,
        deadline: false,
      });

      toast.success("Epic updated successfully!");
      router.refresh();
    } catch {
      toast.error(`Failed to update epic. Please try again.`);
    } finally {
      setIsLoading(false); // resets the loading state after response
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <FormProvider {...methods}>
        <form
          className="relative w-full max-w-3xl bg-white rounded-sm shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Header */}
          <div className="relative p-4 sm:p-6">
            <div className="flex flex-col gap-2">
              <span className="flex gap-2 label-sm text-slate-2 rounded-xs">
                <EpicIdIcon />
                {epic?.epic_id}
              </span>
              {/* Title */}
              <EpicTitleInput onSubmit={onSubmit} isLoading={isLoading} />
            </div>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-slate-2 hover:text-error transition-colors p-2 cursor-pointer"
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

          {/* main content */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[80vh]">
            {/* Description */}
            <EpicDescription onSubmit={onSubmit} isLoading={isLoading} />

            {/* Details Grid */}
            <section className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-6">
              {/* created by */}
              <div className="space-y-3">
                <p className="label-sm text-slate-1 uppercase">Created By</p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold">
                    {creatorInitials}
                  </div>
                  <div>
                    <h5 className="text-slate-3 body-md leading-none">
                      {epic?.created_by?.name}
                    </h5>
                  </div>
                </div>
              </div>

              {/* assignee */}
              <div className="space-y-3">
                <p className="label-sm text-slate-1 uppercase">Assignee</p>
                {!editMode.assignee ? (
                  <div
                    onClick={() => {
                      setEditMode((prev) => ({ ...prev, assignee: true }));
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="size-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                      {assigneeInitials || (
                        <UnassignedIcon className="size-4" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-slate-3 body-md leading-none">
                        {epic?.assignee?.name || "Unassigned"}
                      </h5>
                    </div>
                  </div>
                ) : (
                  <EpicAssigneeSelect
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    projectId={projectId}
                  />
                )}
              </div>

              {/* deadline */}
              <div className="space-y-3 sm:space-y-5">
                <p className="label-sm text-slate-1 uppercase">Deadline</p>
                {!editMode.deadline ? (
                  <div
                    onClick={() => {
                      setEditMode((prev) => ({ ...prev, deadline: true }));
                    }}
                    className="flex items-center gap-3 text-slate-3 cursor-pointer"
                  >
                    <DateIcon className="size-5" />
                    <span className="body-md font-medium">
                      {epic?.deadline
                        ? formatDate(epic.deadline)
                        : "No deadline set"}
                    </span>
                  </div>
                ) : (
                  <EpicDeadlineInput
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                  />
                )}
              </div>

              {/* created at */}
              <div className="space-y-3">
                <p className="label-sm text-slate-1 uppercase">Created At</p>
                <div className="flex items-center gap-3 text-slate-3">
                  <DateIcon className="size-5" />
                  <span className="body-md font-medium">
                    {formatDate(epic?.created_at)}
                  </span>
                </div>
              </div>
            </section>

            {/* tasks section */}
            <DynamicTaskList
              projectId={projectId}
              epic={epic}
              onClose={onClose}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EpicDetailsModal;
