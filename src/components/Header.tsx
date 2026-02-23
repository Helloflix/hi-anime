import { useState, useEffect, useRef } from "react";
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
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import SearchSuggestions from "./SearchSuggestions";

const Header = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { suggestions, isLoading } = useSearchSuggestions(searchQuery);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
      <div className="flex h-14 md:h-12 lg:h-16 items-center px-3 md:px-3 lg:px-4 gap-2 md:gap-2 lg:gap-4">
        {/* Sidebar Toggle */}
        <SidebarTrigger className="h-9 w-9 md:h-8 md:w-8 lg:h-10 lg:w-10 flex-shrink-0" />
        
        {/* Animated Logo - visible on mobile and tablet */}
        <Link to="/" className="flex items-center lg:hidden flex-shrink-0">
          <span className="font-bold text-sm md:text-xs lg:text-lg bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-pulse">
            AnimixPlay
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={(e) => { handleSearch(e); setShowSuggestions(false); }} className="flex-1 min-w-0">
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-2 md:left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search anime..."
              className="pl-7 md:pl-8 lg:pl-10 bg-muted/50 h-8 md:h-8 lg:h-10 text-xs md:text-sm w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && (
              <SearchSuggestions
                suggestions={suggestions}
                isLoading={isLoading}
                query={searchQuery}
                onSelect={() => {
                  setShowSuggestions(false);
                  setSearchQuery("");
                }}
              />
            )}
          </div>
        </form>

        {/* Action Buttons - Right aligned and compact */}
        <div className="flex items-center gap-1 md:gap-1 lg:gap-2 flex-shrink-0 ml-auto relative">
          <ThemeToggle />
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 md:h-8 md:w-8 lg:h-10 lg:w-auto lg:px-3 p-0 lg:p-2"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Avatar className="h-7 w-7 md:h-7 md:w-7 lg:h-8 lg:w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs md:text-xs lg:text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline ml-2 text-sm">Profile</span>
              </Button>
              
              {/* Animated Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-64 md:w-72 bg-card border border-border rounded-lg shadow-xl animate-slide-up overflow-hidden z-50">
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
            <Button 
              variant="default" 
              size="sm" 
              className="h-8 md:h-8 lg:h-10 px-3 md:px-3 lg:px-4 text-xs md:text-xs lg:text-sm font-medium"
              asChild
            >
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
