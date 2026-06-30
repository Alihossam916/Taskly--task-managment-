"use client";
import { useState } from "react";

import { toast } from "react-toastify";

// components
import Input from "../../ui/input";
import Button from "../../ui/button";
import Spinner from "../../ui/spinner";

// redux
import { useDispatch, useSelector } from "react-redux";
import { closeMembersModal } from "@/src/lib/redux/feature/membersModalSlice";

// validation
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

// icons
import CloseIcon from "../../icons/closeIcon";
import FilledAddMemberIcon from "../../icons/filledAddMemberIcon";
import MailIcon from "../../icons/mailIcon";

// schemas
import { inviteMemberSchema } from "@/src/lib/schemas/inviteMemberSchema";

// types
import { InviteMemberFormData } from "@/src/lib/schemas/inviteMemberSchema";

// libs
import { inviteMembersApi } from "@/src/lib/api/projects/inviteMembers";

const InviteMemberModal = ({ projectId }: { projectId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: any) => state.membersModal.membersModalOpen,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
    },
  });
  // form submition logic
  const onSubmit: SubmitHandler<InviteMemberFormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await inviteMembersApi({
        email: data.email,
        project_id: projectId,
      });
      toast.success("Invitation sent successfully");
    } catch {
      toast.error("Failed to send invitation. Check the email or try again.");
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={() => dispatch(closeMembersModal())}
      className="fixed inset-0 z-50 hidden sm:flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-fit min-w-xl w-xl bg-white p-10 space-y-6"
      >
        <button
          onClick={() => dispatch(closeMembersModal())}
          className="absolute top-2 right-2 text-slate-2 hover:text-error transition-colors p-2 cursor-pointer"
        >
          <CloseIcon />
        </button>
        <div className="space-y-2">
          <FilledAddMemberIcon className="text-primary bg-surface-low p-2 size-10 rounded-lg" />
          <h3 className="capitalize text-2xl font-bold text-slate-3">
            Invite Team Member
          </h3>
          <p className="text-slate-2 body-md">
            Send an invitation to join the Architectural Studio <br />{" "}
            workspace.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* email field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="uppercase label-sm">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <MailIcon />
              </div>
              <Input
                {...register("email")}
                id="email"
                type="text"
                placeholder="yourname@company.com"
                variant={errors.email ? "error" : "primary"}
                className="rounded-sm!"
              />
            </div>
            {errors.email && (
              <span className="text-red-600 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => dispatch(closeMembersModal())}
              className="w-1/2 capitalize"
            >
              cancel
            </Button>
            <Button
              type="submit"
              className="w-1/2 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <Spinner />}
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
