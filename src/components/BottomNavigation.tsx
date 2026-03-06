import { Home, Search, Star, User, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Star, label: "Popular", path: "/most-popular" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] md:hidden">
      <div className="bg-[hsl(240_30%_5%/0.95)] backdrop-blur-2xl border-t border-[hsl(180_100%_50%/0.1)] shadow-[0_-4px_20px_hsl(180_100%_50%/0.05)]">
        <div className="flex items-center justify-around px-2 pb-safe pt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group relative",
                  isActive
                    ? "text-[hsl(180_100%_50%)]"
                    : "text-[hsl(210_15%_45%)] hover:text-[hsl(180_100%_50%/0.7)]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "relative flex items-center justify-center transition-all duration-300",
                    isActive && "scale-110"
                  )}>
                    <item.icon className={cn(
                      "h-6 w-6",
                      isActive && "drop-shadow-[0_0_6px_hsl(180_100%_50%/0.5)]"
                    )} />
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 w-8 h-0.5 rounded-full bg-[hsl(180_100%_50%)] shadow-[0_0_6px_hsl(180_100%_50%/0.5)]" />
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
