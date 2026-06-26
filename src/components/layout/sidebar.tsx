"use client";
import Link from "next/link";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { toast } from "react-toastify";

// libs
import { getAccessToken } from "@/src/lib/utils/cookies";
import { logoutApi } from "@/src/lib/api/auth/logout";

// icons
import Logo from "../icons/logo";
import LogoutIcon from "../icons/logoutIcon";
import CollapseIcon from "../icons/collapseIcon";
import ExpandIcon from "../icons/expandIcon";
import ProjectsIcon from "@/src/components/icons/projectsIcon";
import ProjectEpicsIcon from "@/src/components/icons/projectEpicsIcon";
import DetailsIcon from "@/src/components/icons/detailsIcon";
import TasksIcon from "@/src/components/icons/tasksIcon";
import MembersIcon from "@/src/components/icons/membersIcon";

import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "@/src/lib/redux/feature/sidebarSlice";
import { mobileView } from "@/src/constants/mobileView";

const Sidebar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { projectId } = useParams();
  const pathname = usePathname();

  const extended = useSelector((state: any) => state.sidebar.extended);
  const dispatch = useDispatch();

  const [screenWidth, setScreenWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const globalLinks = [
    {
      name: "Projects",
      icon: ProjectsIcon,
      href: "/project",
      desktopName: "Projects",
    },
  ];

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
          href: `/project/${projectId}/tasks?view=board`,
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

  async function handleLogout() {
    const token = await getAccessToken();
    if (!token) {
      toast.error("No session found. Please log in again.");
      router.push("/login");
      return;
    }
    const response = await logoutApi(token);
    if (response.error) {
      toast.error("Logout failed, please try again.");
      return;
    }
    toast.success("Logout successfully");
    router.push("/login");
  }

  return (
    <div className="w-full">
      <aside className="hidden sm:block fixed top-0 z-50">
        <nav
          className={`${extended ? "w-64" : "w-20"} flex flex-col justify-between h-screen bg-surface-low p-4 transition-all duration-300`}
        >
          <div>
            <Link
              href={"/project"}
              className="flex gap-2 items-center w-fit ml-2"
            >
              <Logo className="size-7" />
              {extended && (
                <h2 className="headline-lg font-bold uppercase">Taskly</h2>
              )}
            </Link>

            <ul className="space-y-2 mt-5">
              {allVisibleLinks.map((link) => {
                const hrefPath = link.href.split("?")[0];
                const isActive =
                  pathname === hrefPath ||
                  (hrefPath !== "/project" && pathname.startsWith(hrefPath));
                return (
                  <Link
                    key={link.name}
                    href={`${link.href}`}
                    className={`group block w-full text-lg font-semibold text-foreground rounded-sm p-3 hover:bg-white transition-colors duration-200 cursor-pointer ${isActive ? "bg-white text-primary" : "text-foreground hover:bg-white"}`}
                  >
                    <li className="flex items-center gap-2">
                      <link.icon
                        className={`size-6 ${isActive ? "text-primary-container!" : "group-hover:text-primary-container!"}`}
                      />
                      {extended && (
                        <span
                          className={
                            isActive
                              ? "text-primary"
                              : "group-hover:text-primary"
                          }
                        >
                          {link.desktopName}
                        </span>
                      )}
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div>
            <button
              onClick={() => {
                dispatch(toggleSidebar());
              }}
              className="group flex items-center gap-2 cursor-pointer hover:bg-white transition-colors duration-200 p-3 w-full rounded-sm"
            >
              {extended ? (
                <CollapseIcon className="group-hover:text-primary-container" />
              ) : (
                <ExpandIcon className="group-hover:text-primary-container" />
              )}
              {extended && (
                <span className="title-md text-slate-3 group-hover:text-primary-container">
                  Collapse
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer focus:bg-white hover:bg-white transition-colors duration-200 p-3 w-full rounded-sm"
            >
              <LogoutIcon />
              {extended && <span className="title-md text-error">Logout</span>}
            </button>
          </div>
        </nav>
      </aside>
      <main
        className={`transition-all duration-300 p-4 bg-background min-w-0 ${
          screenWidth < mobileView ? "ml-0" : extended ? "ml-64" : "ml-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
