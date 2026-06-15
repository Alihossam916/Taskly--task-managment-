import Link from "next/link";

interface PaginationProps {
  basePath: string;
  currentPage: number;
  limit: number;
  total: number;
  displayedCount: number;
  pageParam?: string;
  itemLabel?: string;
}

const Pagination = ({
  basePath,
  currentPage,
  limit,
  total,
  displayedCount,
  pageParam = "page",
  itemLabel = "items",
}: PaginationProps) => {
  const totalPages = Math.ceil(total / limit);

  const buildHref = (pageNumber: number) => {
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}${pageParam}=${pageNumber}`;
  };

  return (
    <div className="hidden sm:flex items-center justify-between mt-40">
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
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
        )}
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
