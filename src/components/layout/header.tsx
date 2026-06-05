"use client";
import Link from "next/link";
import { useState } from "react";

// components
import AvatarDropdown from "../ui/avatarDropdown";
import MobileNavbar from "./mobileNavbar";

// icons
import HamburgerMenuIcon from "../icons/hamburgerMenuIcon";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="p-2 border-b-2 border-slate-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden cursor-pointer p-4 hover:bg-slate-1 transition-colors duration-200 rounded-lg"
          >
            <HamburgerMenuIcon />
          </button>
          <Link href={"/"}>
            <h2 className="sm:invisible uppercase headline-lg text-slate-3 font-bold">
              taskly
            </h2>
          </Link>
        </div>
        <AvatarDropdown />
      </div>
      <div className="sm:hidden">
        <MobileNavbar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </header>
  );
};

export default Header;
