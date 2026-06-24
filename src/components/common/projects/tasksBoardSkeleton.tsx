const TasksBoardSkeleton = () => {
  const statuses = ["TO_DO", "IN_PROGRESS", "BLOCKED", "IN_REVIEW", "READY_FOR_QA", "REOPENED", "READY_FOR_PRODUCTION", "DONE"];
  const cards = [1, 2, 3];

  return (
    <div className="hidden sm:block animate-pulse">
      <div className="flex gap-8 overflow-x-auto min-w-0 w-full overflow-y-hidden">
        {statuses.map((status) => (
          <div key={status} className="w-xs flex flex-col items-center shrink-0">
            <div className="flex items-center justify-between w-full p-2">
              <div className="flex items-center gap-2">
                <div className="bg-surface-highest size-2 rounded-full" />
                <div className="bg-surface-highest h-5 w-24" />
                <div className="bg-surface-highest h-5 w-5 rounded-xs" />
              </div>
              <div className="bg-surface-highest h-5 w-5" />
            </div>
            <div className="flex items-center justify-center w-full p-4 border border-slate-1 border-dashed">
              <div className="bg-surface-highest h-4 w-28" />
            </div>
            <div className="flex flex-col gap-4 mt-4 w-full">
              {cards.map((card) => (
                <div key={card} className="flex flex-col gap-4 rounded-lg p-6 w-full bg-white">
                  <div className="bg-surface-highest h-4 w-full" />
                  <div className="bg-surface-highest h-4 w-3/4" />
                  <div className="flex items-center justify-between">
                    <div className="bg-surface-highest h-4 w-24" />
                    <div className="bg-surface-highest size-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksBoardSkeleton;
