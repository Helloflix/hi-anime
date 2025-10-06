import { Link, useLocation } from "react-router-dom";
import { Home, TrendingUp, User, Settings, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Trending", href: "/trending", icon: TrendingUp },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-4 mb-4 rounded-3xl bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40 border border-border/20 shadow-2xl">
        <div className="flex items-center justify-around px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.href);
            
            return (
              <Link key={item.name} to={item.href} className="flex-1">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-2xl transition-all duration-300 relative group",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-primary rounded-2xl shadow-lg shadow-primary/30 transition-all duration-300" />
                  )}
                  <div className={cn(
                    "relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300",
                    isActive 
                      ? "bg-primary-foreground/15" 
                      : "group-hover:bg-accent/50"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive ? "text-primary-foreground" : "group-hover:text-foreground"
                    )} />
                  </div>
                  <span className={cn(
                    "relative text-[10px] font-semibold transition-all duration-300",
                    isActive ? "text-primary-foreground" : ""
                  )}>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;