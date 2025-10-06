import { Home, Search, TrendingUp, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: TrendingUp, label: "Trending", path: "/trending" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-4 mb-4 rounded-3xl bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40 border border-border/20 shadow-2xl">
        <div className="flex items-center justify-around px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 group relative",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-0 bg-primary rounded-2xl shadow-lg shadow-primary/30 transition-all duration-300" />
                  )}
                  <div className={cn(
                    "relative flex items-center justify-center transition-all duration-300",
                    isActive && "scale-110"
                  )}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary-foreground animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
