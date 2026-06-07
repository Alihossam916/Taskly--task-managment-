import Link from "next/link";
import { useRouter } from "next/navigation";

// icons
import Logo from "../icons/logo";
import LogoutIcon from "../icons/logoutIcon";

import { toast } from "react-toastify";

import { logoutApi } from "@/src/lib/api/auth/logout";
import { getAccessToken } from "@/src/lib/utils/cookies";

import { navLinks } from "@/src/lib/constants/navLinks";

import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "@/src/lib/redux/feature/sidebarSlice";

const MobileNavbar = () => {
  const router = useRouter();
  const extended = useSelector((state: any) => state.sidebar.extended);
  const dispatch = useDispatch();

  async function handleLogout() {
    dispatch(toggleSidebar());
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
    <>
      <div
        onClick={() => dispatch(toggleSidebar())}
        className={
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 " +
          (extended
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none")
        }
      />

      <aside
        className={`${extended ? `translate-x-0` : `-translate-x-full`} fixed left-0 top-0 bg-surface-low z-60 transition-all duration-200`}
      >
        <nav className="w-64 h-screen p-4 flex flex-col justify-between">
          <div>
            <Link href={"/project"} className="flex gap-2 items-center w-fit">
              <Logo className="size-7" />
              <h2 className="headline-lg font-bold uppercase">Taskly</h2>
            </Link>

            <ul className="space-y-2 mt-5">
              {navLinks.map((link) => {
                return (
                  <Link
                    key={link.name}
                    href={`${link.href}`}
                    onClick={() => dispatch(toggleSidebar())}
                    className="group block w-full text-lg font-semibold text-foreground rounded-sm p-3 focus:bg-white hover:bg-white transition-colors duration-200 cursor-pointer"
                  >
                    <li className="flex items-center gap-2">
                      <link.icon className="group-hover:text-primary-container group-focus:text-primary-container" />
                      <span className="group-hover:text-primary">
                        {link.desktopName}
                      </span>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer focus:bg-white hover:bg-white transition-colors duration-200 p-3 w-full rounded-sm"
          >
            <LogoutIcon />
            <span className="title-md text-error">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default MobileNavbar;
