"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import { getUser } from "@/src/lib/api/auth/getUser";
import { getAccessToken } from "@/src/lib/utils/cookies";

// components
import AvatarDropdown from "../ui/avatarDropdown";
import MobileNavbar from "./mobileNavbar";

// icons
import HamburgerMenuIcon from "../icons/hamburgerMenuIcon";

import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/src/lib/redux/feature/sidebarSlice";

const Header = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<{ name: string; job: string } | null>(null);

  useEffect(() => {
    getAccessToken().then((token) => {
      if (!token) return;
      getUser(token).then((response) => {
        if (response) {
          setUser(response.user_metadata);
        }
      });
    });
  }, []);

  return (
    <header className="p-2 border-b-2 border-slate-1">
      <div className="flex justify-between sm:justify-end items-center">
        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="cursor-pointer p-4 hover:bg-slate-1 transition-colors duration-200 rounded-lg"
          >
            <HamburgerMenuIcon />
          </button>
          <Link href={"/project"}>
            <h2 className="uppercase headline-lg text-slate-3 font-bold">
              taskly
            </h2>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-col items-end hidden sm:flex">
            <p className="body-md font-bold">{user?.name}</p>
            <p className="label-sm uppercase text-primary">{user?.job}</p>
          </div>
          <AvatarDropdown user={user} />
        </div>
      </div>
      <div className="sm:hidden">
        <MobileNavbar />
      </div>
    </header>
  );
};

export default Header;
