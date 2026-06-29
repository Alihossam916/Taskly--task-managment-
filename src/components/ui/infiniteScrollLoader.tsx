"use client";
import { useEffect, useRef } from "react";
import Spinner from "@/src/components/ui/spinner";
import { mobileView } from "@/src/constants/mobileView";

interface InfiniteScrollLoaderProps {
  loading: boolean;
  hasMore: boolean;
  hasItems: boolean;
  label: string;
  onLoadMore: () => void;
  mobileOnly?: boolean;
}

const InfiniteScrollLoader = ({
  loading,
  hasMore,
  hasItems,
  label,
  onLoadMore,
  mobileOnly = true,
}: InfiniteScrollLoaderProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          (mobileOnly ? window.innerWidth < mobileView : true) &&
          hasMore &&
          !loading
        ) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading, mobileOnly]);

  return (
    <div
      ref={observerTarget}
      className={`flex justify-center py-8 h-20 ${mobileOnly ? "sm:hidden" : ""}`}
    >
      {loading && <Spinner className="border-slate-3" />}
      {!hasMore && hasItems && (
        <p className="text-slate-2 body-md italic">No more {label} to show</p>
      )}
    </div>
  );
};

export default InfiniteScrollLoader;
