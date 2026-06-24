const TasksListSkeleton = () => {
  const rows = [1, 2, 3, 4, 5];

  return (
    <div className="mt-10 w-full mx-auto hidden sm:block relative animate-pulse">
      <table className="max-w-full mx-auto min-w-150">
        <thead className="bg-surface-low">
          <tr className="uppercase">
            <th className="label-sm text-slate-2 py-4 pl-4 md:pl-10 text-left w-1/6">Task ID</th>
            <th className="label-sm text-slate-2 py-4 text-left w-1/5">Title</th>
            <th className="label-sm text-slate-2 py-4 pr-10 text-left w-1/6">Status</th>
            <th className="label-sm text-slate-2 py-4 pr-10 text-left w-1/6">Due Date</th>
            <th className="label-sm text-slate-2 py-4 pr-10 text-left w-2/6">Assignee</th>
            <th className="label-sm text-slate-2 py-4 pr-10 text-right w-1/6"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((row) => (
            <tr key={row} className="border-b border-surface-low">
              <td className="py-4 px-4 md:px-10">
                <div className="bg-surface-highest h-4 w-20" />
              </td>
              <td className="py-4">
                <div className="bg-surface-highest h-5 w-44" />
              </td>
              <td className="py-4 pr-10">
                <div className="bg-surface-highest h-6 w-24 rounded-xs" />
              </td>
              <td className="py-4 pr-10">
                <div className="bg-surface-highest h-4 w-28" />
              </td>
              <td className="py-4 pr-10">
                <div className="flex items-center gap-2">
                  <div className="bg-surface-highest size-8 rounded-full" />
                  <div className="bg-surface-highest h-4 w-24" />
                </div>
              </td>
              <td className="py-4">
                <div className="bg-surface-highest size-8 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-40">
        <div className="bg-surface-highest h-5 w-48" />
        <div className="flex items-center gap-2">
          <div className="bg-surface-highest h-9 w-24 rounded-xs" />
          <div className="bg-surface-highest h-9 w-10 rounded-xs" />
          <div className="bg-surface-highest h-9 w-10 rounded-xs" />
          <div className="bg-surface-highest h-9 w-24 rounded-xs" />
        </div>
      </div>
    </div>
  );
};

export default TasksListSkeleton;
