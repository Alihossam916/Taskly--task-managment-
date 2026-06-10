"use client";
import Link from "next/link";

import { navLinks } from "@/src/lib/constants/navLinks";

import { useSelector } from "react-redux";

export const BottomNavbar = () => {
  const extended = useSelector((state: any) => state.sidebar.extended);

  return (
    <footer className={`fixed bottom-0 w-full p-4 bg-surface-low ${extended && "hidden"} sm:hidden`}>
      <ul className="flex items-center justify-between gap-2">
        {navLinks.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className="group text-slate-3 body-md hover:text-primary-container focus:text-primary-container active:text-primary-container transition-color duration-200"
            >
              <li className="flex flex-col items-center">
                <link.icon className="group-hover:text-primary-container group-focus:text-primary-container" />
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
