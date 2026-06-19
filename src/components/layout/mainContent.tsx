"use client";
import { ReactNode, useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { mobileView } from "@/src/constants/mobileView";

export default function MainContent({ children }: { children: ReactNode }) {
  const [screenWidth, setScreenWidth] = useState(0);
  const extended = useSelector((state: any) => state.sidebar.extended);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`transition-all duration-300 p-4 w-full bg-background ${
        screenWidth < mobileView
          ? "ml-0" // No margin on mobile
          : extended
            ? "ml-64"
            : "ml-20"
      }`}
    >
      {children}
    </div>
  );
}
