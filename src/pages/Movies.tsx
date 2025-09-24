import { useState } from "react";
import { Search, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimeCard from "@/components/AnimeCard";

// Import anime images
import anime1 from "@/assets/anime1.jpg";
import anime2 from "@/assets/anime2.jpg";
import anime3 from "@/assets/anime3.jpg";
import anime4 from "@/assets/anime4.jpg";
import anime5 from "@/assets/anime5.jpg";
import anime6 from "@/assets/anime6.jpg";

const animeMovies = [
  {
    id: "demon-slayer-movie",
    title: "Demon Slayer: Mugen Train",
    subtitle: "The movie that broke records",
    image: anime2,
    rating: 9.2,
    year: 2020,
    episodes: 1,
    type: "Movie",
    status: "Completed",
    genres: ["Action", "Supernatural", "Drama"]
  },
  {
    id: "spirited-away",
    title: "Spirited Away",
    subtitle: "Studio Ghibli masterpiece",
    image: anime1,
    rating: 9.6,
    year: 2001,
    episodes: 1,
    type: "Movie",
    status: "Completed",
    genres: ["Adventure", "Family", "Fantasy"]
  },
  {
    id: "your-name",
    title: "Your Name",
    subtitle: "Kimi no Na wa",
    image: anime3,
    rating: 9.4,
    year: 2016,
    episodes: 1,
    type: "Movie",
    status: "Completed",
    genres: ["Romance", "Drama", "Supernatural"]
  },
  {
    id: "princess-mononoke",
    title: "Princess Mononoke",
    subtitle: "Nature vs civilization",
    image: anime4,
    rating: 9.3,
    year: 1997,
    episodes: 1,
    type: "Movie",
    status: "Completed",
    genres: ["Adventure", "Drama", "Fantasy"]
  },
  {
    id: "akira",
    title: "Akira",
    subtitle: "Cyberpunk classic",
    image: anime5,
    rating: 9.1,
    year: 1988,
    episodes: 1,
    type: "Movie",
    status: "Completed",
    genres: ["Action", "Sci-Fi", "Thriller"]
  },
  {
    id: "grave-of-fireflies",
    title: "Grave of the Fireflies",
    subtitle: "Heart-wrenching war story",
    image: anime6,
    rating: 9.5,
    year: 1988,
    episodes: 1,
    type: "Movie",
    status: "Completed",
    genres: ["Drama", "War", "Historical"]
  }
];

const Movies = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredMovies = animeMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Anime Movies</h1>
        <p className="text-muted-foreground">
          Discover incredible anime films from legendary studios
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search anime movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredMovies.length} of {animeMovies.length} results
        </p>
      </div>

      {/* Movies Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
          : 'grid-cols-1 md:grid-cols-2'
      }`}>
        {filteredMovies.map((movie) => (
          <AnimeCard
            key={movie.id}
            {...movie}
            className={viewMode === 'list' ? 'flex-row' : ''}
          />
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No movies found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Movies;