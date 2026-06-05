"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "react-toastify";

// libs
import { navLinks } from "@/src/lib/constants/navLinks";
import { getAccessToken } from "@/src/lib/utils/cookies";
import { logoutApi } from "@/src/lib/api/auth";

// icons
import Logo from "../icons/logo";
import LogoutIcon from "../icons/logoutIcon";
import CollapseIcon from "../icons/collapseIcon";
import ExpandIcon from "../icons/expandIcon";

const Sidebar = () => {
  const router = useRouter();
  const [extended, setExtended] = useState(true);

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
    <aside className="hidden sm:block fixed top-0 z-50">
      <nav
        className={`${extended ? "w-64" : "w-20"} flex flex-col justify-between h-screen bg-surface-low p-4 transition-all duration-300`}
      >
        <div>
          <Link href={"/"} className="flex gap-2 items-center w-fit ml-2">
            <Logo className="size-7" />
            {extended && (
              <h2 className="headline-lg font-bold uppercase">Taskly</h2>
            )}
          </Link>

          <ul className="space-y-2 mt-5">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.name}
                  href={`${link.href}`}
                  className="group block w-full text-lg font-semibold text-foreground rounded-sm p-3 focus:bg-white hover:bg-white transition-colors duration-200 cursor-pointer"
                >
                  <li className="flex items-center gap-2">
                    <link.icon className="size-6 group-hover:text-primary-container group-focus:text-primary-container" />
                    {extended && (
                      <span className="group-hover:text-primary">
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
              setExtended(!extended);
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
  );
};

export default Sidebar;
