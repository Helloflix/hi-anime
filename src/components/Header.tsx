import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Filter, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "A-Z List", href: "/az-list" },
    { name: "Advanced Search", href: "/search" },
    { name: "Contact Us", href: "/contact" },
  ];

  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", 
    "Thriller", "Horror", "Sci-Fi", "Slice of Life", "Sports", "Supernatural"
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Desktop Sidebar Toggle */}
        <div className="hidden md:block">
          <SidebarTrigger />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-card">
            <div className="flex flex-col space-y-6 mt-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Navigation</h3>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg transition-all ${
                      isActivePath(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Genres</h3>
                <div className="grid grid-cols-2 gap-2">
                  {genres.map((genre) => (
                    <Link
                      key={genre}
                      to={`/genre/${genre.toLowerCase().replace(' ', '-')}`}
                      className="px-3 py-2 text-sm rounded-lg bg-secondary hover:bg-accent transition-colors"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        </div>

        {/* Logo - Hidden on desktop as it's in sidebar */}
        <Link to="/" className="flex items-center space-x-2 md:hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg animix-gradient">
            <Play className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-glow-cyan bg-clip-text text-transparent">
            ANIMIXPLAY
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
          <div className="relative">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search anime..."
                className="w-full bg-card border-border focus:border-primary pr-20"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 h-8"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <Button variant="ghost" size="sm" className="sm:hidden">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;