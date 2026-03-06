import { useState, useEffect } from "react";
import { User, LogOut, Settings, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowProfile(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(180_100%_50%/0.06)] bg-[hsl(240_30%_5%/0.8)] backdrop-blur-xl">
      <div className="flex h-14 md:h-12 lg:h-16 items-center px-3 md:px-3 lg:px-4 gap-2 md:gap-2 lg:gap-4">
        {/* Sidebar Toggle */}
        <SidebarTrigger className="h-9 w-9 md:h-8 md:w-8 lg:h-10 lg:w-10 flex-shrink-0" />
        
        {/* Logo - visible on mobile and tablet */}
        <Link to="/" className="flex items-center lg:hidden flex-shrink-0">
          <span className="font-bold text-sm md:text-xs lg:text-lg bg-gradient-to-r from-[hsl(180_100%_50%)] to-[hsl(300_100%_50%)] bg-clip-text text-transparent">
            Helloflix
          </span>
        </Link>

        {/* Search button - desktop only, navigates to /search */}
        <div className="flex-1 hidden lg:flex justify-center">
          <Button
            variant="ghost"
            className="w-full max-w-md h-10 px-4 justify-start gap-2 text-muted-foreground bg-[hsl(180_100%_50%/0.03)] border border-[hsl(180_100%_50%/0.08)] rounded-xl hover:border-[hsl(180_100%_50%/0.15)] hover:bg-[hsl(180_100%_50%/0.06)]"
            onClick={() => navigate("/search")}
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search anime...</span>
            <span className="ml-auto text-xs text-muted-foreground/50">⌘K</span>
          </Button>
        </div>

        {/* Spacer on mobile */}
        <div className="flex-1 lg:hidden" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-1 lg:gap-2 flex-shrink-0 relative">
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
                  <AvatarFallback className="bg-gradient-to-br from-[hsl(180_100%_50%)] to-[hsl(300_100%_50%)] text-[hsl(240_30%_5%)] text-xs md:text-xs lg:text-sm font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline ml-2 text-sm">Profile</span>
              </Button>
              
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-64 md:w-72 bg-[hsl(240_30%_8%)] border border-[hsl(180_100%_50%/0.12)] rounded-xl shadow-[0_8px_32px_hsl(0_0%_0%/0.5),0_0_16px_hsl(180_100%_50%/0.1)] animate-slide-up overflow-hidden z-50">
                  <div className="p-4 bg-gradient-to-br from-[hsl(180_100%_50%/0.08)] to-[hsl(300_100%_50%/0.05)] border-b border-[hsl(180_100%_50%/0.1)]">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border border-[hsl(180_100%_50%/0.2)]">
                        <AvatarFallback className="bg-gradient-to-br from-[hsl(180_100%_50%)] to-[hsl(300_100%_50%)] text-[hsl(240_30%_5%)] font-bold">
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
                      className="w-full justify-start hover:bg-[hsl(180_100%_50%/0.06)] hover:text-[hsl(180_100%_50%)]"
                      onClick={() => { setShowProfile(false); navigate("/profile"); }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-[hsl(180_100%_50%/0.06)] hover:text-[hsl(180_100%_50%)]"
                      onClick={() => { setShowProfile(false); navigate("/settings"); }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
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
              className="h-8 md:h-8 lg:h-10 px-3 md:px-3 lg:px-4 text-xs md:text-xs lg:text-sm font-medium bg-gradient-to-r from-[hsl(180_100%_50%)] to-[hsl(300_100%_50%)] text-[hsl(240_30%_5%)] hover:opacity-90 border-0"
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
