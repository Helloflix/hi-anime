import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AnimeCard from "@/components/AnimeCard";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance",
    "Thriller", "Horror", "Sci-Fi", "Slice of Life", "Sports", "Supernatural",
    "Mecha", "Isekai", "School", "Magic"
  ];

  const years = Array.from({ length: 30 }, (_, i) => 2024 - i);
  
  // Mock search results
  const searchResults = [
    { id: 1, title: "Attack on Titan", image: "/src/assets/anime1.jpg", rating: 9.0, episodes: "87 Episodes", status: "Completed" },
    { id: 2, title: "Demon Slayer", image: "/src/assets/anime2.jpg", rating: 8.7, episodes: "44 Episodes", status: "Ongoing" },
  ];

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-glow mb-4">Advanced Search</h1>
        <p className="text-muted-foreground">Find your perfect anime with advanced filters</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6 anime-card p-6">
            {/* Search Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search Title</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter anime title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tv">TV Series</SelectItem>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="ova">OVA</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Year</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Genres</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {genres.map(genre => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={() => handleGenreToggle(genre)}
                    />
                    <label htmlFor={genre} className="text-sm cursor-pointer">
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full glow-effect">
              Search Anime
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-muted-foreground">
              Found {searchResults.length} results
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map(anime => (
              <AnimeCard 
                key={anime.id} 
                id={anime.id.toString()} 
                title={anime.title} 
                image={anime.image} 
                rating={anime.rating} 
                status={anime.status} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;