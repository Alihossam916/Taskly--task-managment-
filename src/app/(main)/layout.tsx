// layout
import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/sidebar";
import BottomNavbar from "../../components/layout/bottomNavbar";
import MainContent from "@/src/components/layout/mainContent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex flex-1 overflow-auto min-h-0">
        <Sidebar />
        <MainContent>
          <main>{children}</main>
        </MainContent>
      </div>
      <BottomNavbar />
    </>
  );
}
