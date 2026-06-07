"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { logoutApi } from "@/src/lib/api/auth/logout";
import { getAccessToken } from "@/src/lib/utils/cookies";

interface AvatarDropdownProps {
  userName?: string;
}

export default function AvatarDropdown({
  userName = "John Doe",
}: AvatarDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setIsOpen(false);
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="size-12 rounded-xl bg-primary text-white font-semibold text-xl flex items-center justify-center hover:opacity-80 transition-opacity duration-200 cursor-pointer"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 min-w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
