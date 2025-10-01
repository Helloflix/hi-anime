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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarContent className="bg-card/50 backdrop-blur-sm">
        {/* Animated Logo Section */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-border/40">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 animate-pulse">
            <Play className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              AnimixPlay
            </span>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Browse Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {browseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
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
