import { ReactNode } from "react";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import { AppSidebar } from "./AppSidebar";
import { EntertainmentSidebar } from "./EntertainmentSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        {/* Left Navigation Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
        </SidebarInset>

        {/* Right Entertainment Sidebar */}
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