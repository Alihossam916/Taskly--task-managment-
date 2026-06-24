const TasksMobileSkeleton = () => {
  const cards = [1, 2, 3, 4];

  return (
    <div className="flex flex-col items-center gap-4 w-full sm:hidden mt-10 animate-pulse">
      {cards.map((card) => (
        <div key={card} className="w-full bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="bg-surface-highest h-4 w-20" />
            <div className="bg-surface-highest h-6 w-24 rounded-xs" />
          </div>
          <div className="bg-surface-highest h-6 w-full" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-surface-highest size-9 rounded-full" />
              <div>
                <div className="bg-surface-highest h-3 w-12 mb-1" />
                <div className="bg-surface-highest h-4 w-24" />
              </div>
            </div>
            <div className="bg-surface-highest size-8" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksMobileSkeleton;
