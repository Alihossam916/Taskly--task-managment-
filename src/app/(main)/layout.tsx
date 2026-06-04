// layout
import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/sidebar";
import BottomNavbar from "../../components/layout/bottomNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <BottomNavbar />
    </div>
  );
}
