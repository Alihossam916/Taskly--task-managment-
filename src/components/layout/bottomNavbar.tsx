"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { useSelector } from "react-redux";

// icons
import ProjectsIcon from "@/src/components/icons/projectsIcon";
import ProjectEpicsIcon from "@/src/components/icons/projectEpicsIcon";
import DetailsIcon from "@/src/components/icons/detailsIcon";
import TasksIcon from "@/src/components/icons/tasksIcon";
import MembersIcon from "@/src/components/icons/membersIcon";

export const BottomNavbar = () => {
  const { projectId } = useParams();
  const pathname = usePathname();
  const extended = useSelector((state: any) => state.sidebar.extended);

  const globalLinks = [
    {
      name: "Projects",
      icon: ProjectsIcon,
      href: "/project",
      desktopName: "Projects",
    },
  ];

  // 2. Links that ONLY show when a project is clicked
  const projectSpecificLinks = projectId
    ? [
        {
          name: "Epics",
          icon: ProjectEpicsIcon,
          href: `/project/${projectId}/epics`,
          desktopName: "Project Epics",
        },
        {
          name: "Tasks",
          icon: TasksIcon,
          href: `/project/${projectId}/tasks`,
          desktopName: "Project Tasks",
        },
        {
          name: "Members",
          icon: MembersIcon,
          href: `/project/${projectId}/members`,
          desktopName: "Project Members",
        },
        {
          name: "Details",
          icon: DetailsIcon,
          href: `/project/${projectId}/edit`,
          desktopName: "Project Details",
        },
      ]
    : [];

  const allVisibleLinks = [...globalLinks, ...projectSpecificLinks];

  return (
    <footer
      className={`fixed bottom-0 w-full p-4 bg-surface-low ${extended && "hidden"} sm:hidden`}
    >
      <ul className="flex items-center justify-between gap-2">
        {allVisibleLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/project" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`group text-slate-3 body-md hover:text-primary-container focus:text-primary-container active:text-primary-container transition-color duration-200 ${isActive ? "text-primary-container!" : "group-hover:text-primary-container!"}`}
            >
              <li className="flex flex-col items-center">
                <link.icon
                  className={
                    isActive ? "text-primary!" : "group-hover:text-primary!"
                  }
                />
                <span>{link.name}</span>
              </li>
            </Link>
          );
        })}
      </ul>
    </footer>
  );
};

export default BottomNavbar;
