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
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main>{children}</main>
      </div>
      <BottomNavbar />
    </>
  );
}
