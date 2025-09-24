import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Play, Film, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/", icon: Play },
    { name: "Subbed", href: "/subbed-anime", icon: Film },
    { name: "Dubbed", href: "/dubbed-anime", icon: Film },
    { name: "Popular", href: "/most-popular", icon: TrendingUp },
    { name: "Movies", href: "/movies", icon: Film },
    { name: "TV Series", href: "/tv-series", icon: Play },
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
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg anime-gradient">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-anime-purple bg-clip-text text-transparent">
            HiAnime
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Search and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search anime..."
                  className="w-64 bg-secondary border-border focus:border-primary"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-card">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Navigation</h3>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                          isActivePath(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
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

                <div className="pt-4">
                  <Input
                    type="text"
                    placeholder="Search anime..."
                    className="bg-secondary border-border focus:border-primary"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;