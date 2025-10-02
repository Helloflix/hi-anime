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
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-card/30">
      <SidebarContent className="bg-gradient-to-b from-card/50 to-card/30">
        {/* Modern Logo Section */}
        <div className="p-4 border-b border-border/40">
          {open ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-glow-cyan shadow-lg">
                <Play className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">AnimixPlay</span>
                <span className="text-xs text-muted-foreground">Stream Anime</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-glow-cyan shadow-lg">
                <Play className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive
                          ? "flex items-center gap-3 rounded-lg bg-primary/10 text-primary border-l-4 border-primary font-medium transition-all"
                          : "flex items-center gap-3 rounded-lg hover:bg-accent/50 transition-all"
                      }
                    >
                      <item.icon className={open ? "h-5 w-5" : "h-5 w-5"} />
                      {open && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Browse Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-2">
            Browse
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {browseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "flex items-center gap-3 rounded-lg bg-primary/10 text-primary border-l-4 border-primary font-medium transition-all"
                          : "flex items-center gap-3 rounded-lg hover:bg-accent/50 transition-all"
                      }
                    >
                      <item.icon className={open ? "h-5 w-5" : "h-5 w-5"} />
                      {open && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "flex items-center gap-3 rounded-lg bg-primary/10 text-primary border-l-4 border-primary font-medium transition-all"
                          : "flex items-center gap-3 rounded-lg hover:bg-accent/50 transition-all"
                      }
                    >
                      <item.icon className={open ? "h-5 w-5" : "h-5 w-5"} />
                      {open && <span className="text-sm">{item.title}</span>}
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
