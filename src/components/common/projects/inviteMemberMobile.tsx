"use client";
import { useEffect, useState, useRef } from "react";

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
import MailIcon from "../../icons/mailIcon";

// schemas
import { inviteMemberSchema } from "@/src/lib/schemas/inviteMemberSchema";

// types
import { InviteMemberFormData } from "@/src/lib/schemas/inviteMemberSchema";

// libs
import { inviteMembersApi } from "@/src/lib/api/projects/inviteMembers";

const InviteMemberMobile = ({ projectId }: { projectId: string }) => {
  const isOpen = useSelector(
    (state: any) => state.membersModal.membersModalOpen,
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeMembersModal());
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) setTranslateY(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateY > 150) {
      dispatch(closeMembersModal());
    }
    setTranslateY(0);
  };

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
      className="fixed inset-0 z-50 sm:hidden bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ transform: `translateY(${translateY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="absolute bottom-0 left-0 right-0 bg-surface-low rounded-t-2xl max-h-[90vh] overflow-y-auto transition-transform duration-200"
      >
        <div className="sticky top-0 bg-surface-low z-10 pt-3 pb-2 px-6 flex items-center justify-between">
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-10 h-1 bg-slate-1 rounded-full mx-auto cursor-grab active:cursor-grabbing"
          />
          <button
            onClick={() => dispatch(closeMembersModal())}
            className="absolute right-5 top-5 size-8 flex items-center justify-center rounded-full hover:bg-surface-low transition-colors duration-200 cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <article className="px-6 pb-6 space-y-8">
          <div className="space-y-2">
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
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <Input
                  {...register("email")}
                  id="email"
                  type="text"
                  placeholder="yourname@company.com"
                  variant={errors.email ? "error" : "primary"}
                  className="pl-15"
                />
              </div>
              {errors.email && (
                <span className="text-red-600 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col-reverse items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => dispatch(closeMembersModal())}
                className="w-full capitalize"
              >
                cancel
              </Button>
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <Spinner />}
                Send Invitation
              </Button>
            </div>
          </form>
        </article>
      </div>
    </div>
  );
};

export default InviteMemberMobile;
