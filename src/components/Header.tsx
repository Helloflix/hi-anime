import { useState, useEffect } from "react";
import { Search, User, LogOut, Settings, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowProfile(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="flex h-14 md:h-12 lg:h-16 items-center px-3 md:px-3 lg:px-4 gap-2 md:gap-3 lg:gap-4">
        {/* Sidebar Toggle - visible on all screens */}
        <SidebarTrigger className="h-8 w-8 md:h-7 md:w-7 lg:h-9 lg:w-9" />
        
        {/* Animated Logo - visible on mobile and tablet */}
        <Link to="/" className="flex items-center space-x-1.5 lg:hidden">
          <span className="font-bold text-base md:text-sm lg:text-lg bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-pulse">
            AnimixPlay
          </span>
        </Link>

        {/* Search Bar - More compact on tablet */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-2 md:left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 md:h-3.5 lg:h-4 lg:w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search anime..."
              className="pl-8 md:pl-9 lg:pl-10 bg-muted/50 h-9 md:h-8 lg:h-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Action Buttons - Compact on tablet */}
        <div className="flex items-center space-x-1 md:space-x-1 lg:space-x-2 relative">
          <ThemeToggle />
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 md:h-7 lg:h-9 px-2 md:px-2 lg:px-3"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Avatar className="h-6 w-6 md:h-5 md:w-5 lg:h-7 lg:w-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline ml-2">Profile</span>
              </Button>
              
              {/* Animated Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-xl animate-slide-up overflow-hidden">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {user.user_metadata?.username || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/profile");
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/settings");
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Button variant="ghost" size="sm" className="h-8 md:h-7 lg:h-9 px-2 md:px-2 lg:px-3" asChild>
              <Link to="/auth">
                <span className="text-xs md:text-xs lg:text-sm">Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
