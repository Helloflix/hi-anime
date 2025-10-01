import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Header = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 md:h-16 items-center px-3 md:px-4 gap-2 md:gap-4">
        {/* Desktop Sidebar Toggle */}
        <div className="hidden md:block">
          <SidebarTrigger />
        </div>
        
        {/* Animated Logo - visible only on mobile */}
        <Link to="/" className="flex items-center space-x-1.5 md:hidden">
          <span className="font-bold text-lg bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-pulse">
            AnimixPlay
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search anime..."
              className="pl-8 md:pl-10 bg-muted/50 h-9 md:h-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {user ? (
            <Button variant="ghost" size="sm" className="h-8 md:h-9 px-2 md:px-3" asChild>
              <Link to="/profile">
                <User className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2" />
                <span className="hidden md:inline">Profile</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="h-8 md:h-9 px-2 md:px-3" asChild>
              <Link to="/auth">
                <span className="text-sm">Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
