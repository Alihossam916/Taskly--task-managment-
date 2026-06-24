"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  basePath: string;
  currentPage: number;
  limit: number;
  total: number;
  displayedCount: number;
  pageParam?: string;
  itemLabel?: string;
  mode?: "numbered" | "simple";
}

const Pagination = ({
  basePath,
  currentPage,
  limit,
  total,
  displayedCount,
  pageParam = "page",
  itemLabel = "items",
  mode = "numbered",
}: PaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  const searchParams = useSearchParams();

  const buildHref = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParam, String(pageNumber));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="hidden sm:flex items-center justify-between">
      <p>
        Showing {limit > displayedCount ? displayedCount : limit} of {total}{" "}
        {itemLabel}
      </p>

      <div className="hidden sm:flex items-center justify-between gap-2">
        <Link
          href={buildHref(currentPage - 1)}
          className={`px-3 py-2 rounded-xs text-sm font-medium transition border border-slate-1 ${
            currentPage <= 1
              ? "pointer-events-none opacity-40"
              : "bg-white hover:shadow-sm"
          }`}
        >
          {"<"}
        </Link>
        {mode === "simple" ? (
          <span className="text-sm font-medium px-3">
            Page {currentPage} of {totalPages}
          </span>
        ) : (
          Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <Link
                key={pageNumber}
                href={buildHref(pageNumber)}
                className={`size-9 flex items-center justify-center rounded-xs border border-slate-1 text-sm font-medium transition ${
                  pageNumber === currentPage
                    ? "bg-primary text-white"
                    : "bg-white hover:shadow-sm"
                }`}
              >
                {pageNumber}
              </Link>
            ),
          )
        )}{" "}
        <Link
          href={buildHref(currentPage + 1)}
          className={`px-3 py-2 rounded-xs text-sm font-medium transition border border-slate-1 ${
            currentPage >= totalPages
              ? "pointer-events-none opacity-40"
              : "bg-white hover:shadow-sm"
          }`}
        >
          {">"}
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
