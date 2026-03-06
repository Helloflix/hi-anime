import { Home, Star, List, Film, Tv, Subtitles, Mic2, Settings, HelpCircle, User, Play, History, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Most Popular", url: "/most-popular", icon: Star },
  { title: "A-Z List", url: "/az-list", icon: List },
  { title: "Movies", url: "/movies", icon: Film },
  { title: "TV Series", url: "/tv-series", icon: Tv },
  { title: "Subbed", url: "/subbed-anime", icon: Subtitles },
  { title: "Dubbed", url: "/dubbed-anime", icon: Mic2 },
  { title: "Watch History", url: "/watch-history", icon: History },
];

const bottomItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help", url: "/contact", icon: HelpCircle },
];

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const showText = isMobile || open;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[hsl(180_100%_50%/0.08)] sidebar-cyberpunk"
    >
      <SidebarContent className="sidebar-cyberpunk-bg overflow-hidden">
        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute top-3 left-3 z-50 flex items-center justify-center w-8 h-8 rounded-lg border border-[hsl(180_100%_50%/0.3)] bg-[hsl(180_100%_50%/0.05)] text-[hsl(180_100%_50%)] hover:bg-[hsl(180_100%_50%/0.15)] hover:shadow-[0_0_12px_hsl(180_100%_50%/0.3)] transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Logo */}
        <div className={cn(
          "flex items-center gap-3 px-4 border-b border-[hsl(180_100%_50%/0.08)]",
          isMobile ? "py-4 pt-14" : "py-5"
        )}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[hsl(180_100%_50%)] to-[hsl(300_100%_50%)] shadow-[0_0_15px_hsl(180_100%_50%/0.4)]">
            <Play className="h-5 w-5 text-[hsl(240_30%_5%)] fill-current" />
          </div>
          {showText && (
            <span className="text-base font-bold tracking-wide bg-gradient-to-r from-[hsl(180_100%_50%)] to-[hsl(300_100%_50%)] bg-clip-text text-transparent">
              Helloflix
            </span>
          )}
        </div>

        {/* Main Nav */}
        <SidebarGroup className="px-2 py-3 flex-1">
          {showText && (
            <div className="px-3 mb-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[hsl(180_100%_50%/0.4)]">
                Navigate
              </span>
            </div>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "bg-[hsl(180_100%_50%/0.08)] text-[hsl(180_100%_50%)] shadow-[inset_0_0_12px_hsl(180_100%_50%/0.06)]"
                          : "text-[hsl(210_15%_55%)] hover:text-[hsl(180_100%_50%/0.8)] hover:bg-[hsl(180_100%_50%/0.04)]"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r bg-[hsl(180_100%_50%)] shadow-[0_0_8px_hsl(180_100%_50%/0.6)]" />
                        )}
                        <item.icon className={cn(
                          "h-[18px] w-[18px] md:h-5 md:w-5 transition-all duration-200 flex-shrink-0",
                          isActive && "drop-shadow-[0_0_6px_hsl(180_100%_50%/0.6)]"
                        )} />
                        {showText && <span className="truncate">{item.title}</span>}
                      </>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Section */}
        <div className="px-2 pb-3 border-t border-[hsl(180_100%_50%/0.06)]">
          {showText && (
            <div className="px-3 pt-3 mb-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[hsl(180_100%_50%/0.4)]">
                System
              </span>
            </div>
          )}
          <SidebarMenu className="space-y-0.5">
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 group",
                      isActive
                        ? "bg-[hsl(180_100%_50%/0.08)] text-[hsl(180_100%_50%)]"
                        : "text-[hsl(210_15%_55%)] hover:text-[hsl(180_100%_50%/0.8)] hover:bg-[hsl(180_100%_50%/0.04)]"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 md:h-[18px] md:w-[18px] flex-shrink-0" />
                  {showText && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          {/* Profile */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 mt-1 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-[hsl(300_100%_50%/0.08)] text-[hsl(300_100%_60%)]"
                  : "text-[hsl(210_15%_55%)] hover:text-[hsl(300_100%_60%)] hover:bg-[hsl(300_100%_50%/0.04)]"
              )
            }
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full border border-[hsl(300_100%_50%/0.3)] bg-[hsl(300_100%_50%/0.06)]">
              <User className="h-3.5 w-3.5" />
            </div>
            {showText && <span className="text-[13px] font-medium">Profile</span>}
          </NavLink>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
