const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-1 rounded ${className ?? ""}`} />
);

const TaskDetailsModalSkeleton = () => (
  <>
    <article className="flex flex-col justify-between w-3/5">
      <div className="w-full p-6 space-y-10">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </section>
        <section className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </section>
      </div>
      <section className="bg-surface-low py-4 px-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-20" />
        </div>
      </section>
    </article>
    <aside className="w-2/5 bg-surface-low p-6 space-y-10">
      <div className="space-y-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-20" />
        <div className="bg-white p-4 flex items-center gap-3 rounded-md">
          <Skeleton className="size-8 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-20" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </aside>
  </>
);

export default TaskDetailsModalSkeleton;
