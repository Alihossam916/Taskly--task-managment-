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
}

const InfiniteScrollLoader = ({
  loading,
  hasMore,
  hasItems,
  label,
  onLoadMore,
}: InfiniteScrollLoaderProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          window.innerWidth < mobileView &&
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
  }, [onLoadMore, hasMore, loading]);

  return (
    <div
      ref={observerTarget}
      className="flex justify-center py-8 sm:hidden h-20"
    >
      {loading && <Spinner className="size-8!" />}
      {!hasMore && hasItems && (
        <p className="text-slate-2 body-md italic">No more {label} to show</p>
      )}
    </div>
  );
};

export default InfiniteScrollLoader;
