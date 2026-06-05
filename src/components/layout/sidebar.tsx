"use client";
import Link from "next/link";

// icons

const Sidebar = () => {
  const { extended, toggleSidebar } = useSidebarStore(); // Access the sidebar state and toggle function from sidebarStore
  const { user } = useAuthStore(); // Access the user state from authStore

  return (
    <aside className="hidden sm:block fixed top-0 z-50">
      <nav
        className={`${extended ? "w-52" : "w-16"} h-screen bg-background border-r-2 border-border p-4 transition-all duration-300`}
      >
        {/* Sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className={`${extended ? "ml-36" : "-ml-2 "} mb-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300 p-2 rounded-sm cursor-pointer`}
        >
          {extended ? <PanelRightOpen /> : <BookOpen />}
        </button>
        <hr className="-ml-0.5 mb-2 border-2 w-full" /> {/* Navigation links */}
        <ul className="space-y-4 overflow-x-hidden">
          <li>
            <Link
              href="/"
              className="flex items-center gap-4 w-full text-lg font-semibold text-foreground hover:text-primary hover:bg-primary/ transition-colors duration-200"
            >
              <House />
              {extended && "Home"}
            </Link>
          </li>
          <li>
            <Link
              href="/courses"
              className="flex items-center gap-4 w-full text-lg font-semibold text-foreground hover:text-primary hover:bg-primary/ transition-colors duration-200"
            >
              <School />
              {extended && "Courses"}
            </Link>
          </li>
          {user && (
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-4 w-full text-lg font-semibold text-foreground hover:text-primary hover:bg-primary/ transition-colors duration-200"
              >
                <LayoutDashboard />
                {extended && "Dashboard"}
              </Link>
            </li>
          )}
        </ul>
        <hr className="-ml-0.5 my-2 border-2 w-full" />{" "}
        {/* Additional links or content can be added here */}
        {!user && (
          <Link
            href="/auth/login"
            className="flex items-center gap-4 w-full text-lg font-semibold text-foreground hover:text-primary hover:bg-primary/ transition-colors duration-200"
          >
            <LogIn />
            {extended && "Sign In"}
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
