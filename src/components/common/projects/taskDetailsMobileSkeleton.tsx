const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-1 rounded ${className ?? ""}`} />
);

const TaskDetailsMobileSkeleton = () => (
  <div className="px-6 pb-6 space-y-8">
    <Skeleton className="h-5 w-24" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-3/4" />
    <div className="flex items-center gap-4">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-24" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4 p-4 bg-white rounded-md">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="space-y-4 p-4 bg-white rounded-md">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 p-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="space-y-4 p-4 bg-white rounded-md">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="space-y-4 p-4 bg-white rounded-md">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 p-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-20 w-full" />
    </div>
  </div>
);

export default TaskDetailsMobileSkeleton;
