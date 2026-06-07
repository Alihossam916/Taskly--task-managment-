// icons
import ProjectsIcon from "@/src/components/icons/projectsIcon";
import ProjectEpicsIcon from "@/src/components/icons/projectEpicsIcon";
import DetailsIcon from "@/src/components/icons/detailsIcon";
import TasksIcon from "@/src/components/icons/tasksIcon";
import MembersIcon from "@/src/components/icons/membersIcon";

export const navLinks = [
  {
    desktopName:"Projects",
    name: "Projects",
    icon: ProjectsIcon,
    href: "/project",
  },
  {
    desktopName:"Project Epics",
    name: "Epics",
    icon: ProjectEpicsIcon,
    href: "/epics",
  },
  {
    desktopName:"Project Tasks",
    name: "Tasks",
    icon: TasksIcon,
    href: "/tasks",
  },
  {
    desktopName:"Project Members",
    name: "Members",
    icon: MembersIcon,
    href: "/members",
  },
  {
    desktopName:"Project Details",
    name: "Details",
    icon: DetailsIcon,
    href: "/details",
  },
];
