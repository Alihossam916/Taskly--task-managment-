"use client";

import CrossedCloud from "@/src/components/icons/crossedCloud";
import Button from "@/src/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 my-40">
      <CrossedCloud className="p-4 size-14 rounded-sm bg-error/20" />
      <h3 className="text-slate-3 title-md font-semibold">
        Something went wrong
      </h3>
      <p className="text-slate-2 body-md text-center">
        We&apos;re having trouble retrieving your <br /> projects right now.
        Please try <br />
        again in a moment.
      </p>
      <Button onClick={() => reset()} className="rounded-xs!">
        Retry Connection
      </Button>
    </div>
  );
}
