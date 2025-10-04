import { Home, Search, TrendingUp, User, Settings, List, Film, Tv, Star, Play } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Search", url: "/search", icon: Search },
  { title: "Trending", url: "/trending", icon: TrendingUp },
];

const browseItems = [
  { title: "A-Z List", url: "/az-list", icon: List },
  { title: "Movies", url: "/movies", icon: Film },
  { title: "TV Series", url: "/tv-series", icon: Tv },
  { title: "Most Popular", url: "/most-popular", icon: Star },
  { title: "Subbed", url: "/subbed-anime", icon: Play },
  { title: "Dubbed", url: "/dubbed-anime", icon: Play },
];

const accountItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-border/10 bg-sidebar-background/98 backdrop-blur-xl"
    >
      <SidebarContent className="py-6 px-3">
        {/* Modern Logo Section */}
        <div className="px-2 pb-6 mb-4">
          {open ? (
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:scale-105">
                <Play className="h-5 w-5 text-primary-foreground fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground tracking-tight">AnimixPlay</span>
                <span className="text-xs text-muted-foreground font-medium">Stream Anime</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center group cursor-pointer">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:scale-105">
                <Play className="h-5 w-5 text-primary-foreground fill-current" />
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation - Modern clean style */}
        <SidebarGroup className="px-0">
          {open && (
            <SidebarGroupLabel className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
              Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:border hover:border-border/50"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                            isActive 
                              ? "bg-primary/20 text-primary" 
                              : "bg-muted/50 text-muted-foreground group-hover:bg-accent group-hover:text-foreground"
                          )}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          {open && <span className="flex-1 font-medium">{item.title}</span>}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Browse Section - Modern clean style */}
        <SidebarGroup className="px-0 mt-8">
          {open && (
            <SidebarGroupLabel className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
              Browse
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {browseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:border hover:border-border/50"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                            isActive 
                              ? "bg-primary/20 text-primary" 
                              : "bg-muted/50 text-muted-foreground group-hover:bg-accent group-hover:text-foreground"
                          )}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          {open && <span className="flex-1 font-medium">{item.title}</span>}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section - Modern clean style */}
        <SidebarGroup className="px-0 mt-8">
          {open && (
            <SidebarGroupLabel className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
              Account
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:border hover:border-border/50"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                            isActive 
                              ? "bg-primary/20 text-primary" 
                              : "bg-muted/50 text-muted-foreground group-hover:bg-accent group-hover:text-foreground"
                          )}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          {open && <span className="flex-1 font-medium">{item.title}</span>}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
