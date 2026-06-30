"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "react-toastify";

// components
import Button from "@/src/components/ui/button";
import Spinner from "../../ui/spinner";

// lib
import { acceptInviteApi } from "@/src/lib/api/projects/acceptInvitation";

// icons
import AcceptInvitationIcon from "../../icons/acceptInvitationIcon";

const AcceptInvitation = ({ token }: { token: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleAcceptInvitation() {
    setIsLoading(true);
    try {
      const response = await acceptInviteApi(token);
      setIsLoading(false);
      toast.success("Invite accepted successfully");
      router.push(`/project`);
    } catch {
      toast.error("Invite failed please try again later");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="bg-white p-12 rounded-lg border-t-4 border-t-primary flex flex-col items-center justify-center gap-4">
      <h5 className="flex items-center gap-2 bg-surface-highest py-1 px-2 rounded-l-full rounded-r-full">
        <AcceptInvitationIcon />
        <span className="label-sm text-slate-2">New Project Invitation</span>
      </h5>
      <h3 className="text-center text-slate-3 headline-lg">
        You&apos;ve been invited to join <br /> new project
      </h3>
      <Button
        onClick={() => handleAcceptInvitation()}
        className="w-full flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading && <Spinner />}
        Accept Invitation
      </Button>
    </div>
  );
};

export default AcceptInvitation;
