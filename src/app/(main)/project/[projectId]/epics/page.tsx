import Link from "next/link";
import dynamic from "next/dynamic";

// lib
import { getProjectEpics } from "@/src/lib/api/projects/getProjectEpics";
import { getProjectById } from "@/src/lib/api/projects/getProjectById";

// icons
import NoEpicsIcon from "@/src/components/icons/noEpicsIcon";
import PowerIcon from "@/src/components/icons/powerIcon";
import HierarchyDesignIcon from "@/src/components/icons/hierarchyDesign";
import HighLevelGoalsIcon from "@/src/components/icons/highLevelGoalsIcon";
import TrackVelocityIcon from "@/src/components/icons/trackVelocity";

// components
import Button from "@/src/components/ui/button";
import EpicsSkeleton from "@/src/components/common/projects/epicsSkeleton";

const ProjectEpicsList = dynamic(
  () => import("@/src/components/common/projects/projectEpicsList"),
  { loading: () => <EpicsSkeleton /> },
);

interface Props {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function ProjectEpicPage({ params, searchParams }: Props) {
  const { projectId } = await params;

  const currentPage = Number((await searchParams).page) || 1;
  const limit = 6;
  const offset = (currentPage - 1) * limit;

  const [project, epicsData] = await Promise.all([
    getProjectById(projectId),
    getProjectEpics(projectId, limit, offset),
  ]);

  const { epics, total } = epicsData || { epics: [], total: 0 };
  // ---------- Empty state ----------
  if (!epics || epics.length === 0) {
    return (
      <div className="flex flex-col gap-8 items-center mx-auto my-20">
        <NoEpicsIcon className="shadow-xl/20 shadow-primary-container rounded-lg" />
        <h1 className="headline-lg text-slate-3">
          No epics in this project yet.
        </h1>
        <p className="body-md text-slate-2 text-center font-semibold">
          Break down your large project into manageable <br /> epics to track
          progress better and maintain <br /> architectural clarity.
        </p>
        <Link href={`/project/${projectId}/epics/new`}>
          <Button className="flex items-center gap-2 w-fit rounded-xs!">
            <PowerIcon />
            <span>Create First Epic</span>
          </Button>
        </Link>
        {/*  */}
        <section className="flex flex-col sm:flex-row items-center gap-6 mt-10">
          <div className="w-fit pr-20 p-6 bg-surface-low space-y-2">
            <HighLevelGoalsIcon className="bg-white p-2 size-9" />
            <h5 className="text-slate-3 title-md">High-Level Goals</h5>
            <p className="text-slate-2 body-md">
              Define the broad objectives <br /> that span across multiple{" "}
              <br /> cycles.
            </p>
          </div>
          <div className="w-fit pr-20 p-6 bg-surface-low space-y-2">
            <HierarchyDesignIcon className="bg-white p-2 size-9" />
            <h5 className="text-slate-3 title-md">Hierarchy Design</h5>
            <p className="text-slate-2 body-md">
              Link individual tasks to <br /> parent epics for a <br />{" "}
              consolidated view.
            </p>
          </div>
          <div className="w-fit pr-20 p-6 bg-surface-low space-y-2">
            <TrackVelocityIcon className="bg-white p-2 size-9" />
            <h5 className="text-slate-3 title-md">Track Velocity</h5>
            <p className="text-slate-2 body-md">
              Visualize percentage <br /> completion at a macro <br /> project
              level.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <ProjectEpicsList
      project={project}
      projectId={projectId}
      epics={epics}
      total={total}
      currentPage={currentPage}
      limit={limit}
    />
  );
}
