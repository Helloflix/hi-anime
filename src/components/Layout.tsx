import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNavigation from "./BottomNavigation";
import { AppSidebar } from "./AppSidebar";
import { EntertainmentSidebar } from "./EntertainmentSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Left Navigation Sidebar - Hidden on mobile and tablet */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
        </SidebarInset>

        {/* Right Entertainment Sidebar - Hidden on mobile and tablet */}
        <EntertainmentSidebar />

        {/* Mobile Bottom Navigation - Hidden on desktop */}
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;