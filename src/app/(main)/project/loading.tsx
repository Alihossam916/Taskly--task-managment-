import Spinner from "@/src/components/ui/spinner";

export default function Loading() {
  const projects = [1, 2, 3, 4, 5, 6];
  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="headline-lg text-slate-3">Projects</h1>
          <p className="body-md text-slate-2">
            Manage and curate your projects
          </p>
        </div>
        <div className="hidden sm:block animate-pulse bg-surface-highest w-52 h-10">
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
        {projects.map((project: number) => (
          <li key={project} className="flex flex-col gap-4 bg-white w-fit p-4 mx-auto">
            <div className="bg-surface-highest w-64 h-28"></div>
            <div className="font-semibold title-md text-slate-3 bg-surface-highest w-44 h-6"></div>
            <div className="text-slate-2 text-sm body-md bg-surface-highest w-36 h-4"></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
