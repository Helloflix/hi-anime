import { useState } from "react";
import { Filter, Grid3X3, List, Search } from "lucide-react";
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
import anime7 from "@/assets/anime7.jpg";
import anime8 from "@/assets/anime8.jpg";

const subbedAnimes = [
  {
    id: "one-piece-sub",
    title: "One Piece (Sub)",
    subtitle: "The legendary journey continues",
    image: anime1,
    rating: 9.2,
    year: 2023,
    episodes: 1000,
    type: "TV",
    status: "Ongoing",
    genres: ["Adventure", "Comedy", "Action", "Shounen"]
  },
  {
    id: "demon-slayer-sub",
    title: "Demon Slayer (Sub)",
    subtitle: "Kimetsu no Yaiba",
    image: anime2,
    rating: 9.1,
    year: 2023,
    episodes: 44,
    type: "TV",
    status: "Completed",
    genres: ["Action", "Historical", "Supernatural"]
  },
  {
    id: "attack-on-titan-sub",
    title: "Attack on Titan (Sub)",
    subtitle: "Shingeki no Kyojin",
    image: anime3,
    rating: 9.5,
    year: 2023,
    episodes: 28,
    type: "TV",
    status: "Completed",
    genres: ["Action", "Drama", "Fantasy"]
  },
  {
    id: "jujutsu-kaisen-sub",
    title: "Jujutsu Kaisen (Sub)",
    subtitle: "Sorcery Fight",
    image: anime4,
    rating: 9.0,
    year: 2023,
    episodes: 23,
    type: "TV",
    status: "Completed",
    genres: ["Action", "School", "Supernatural"]
  },
  {
    id: "naruto-sub",
    title: "Naruto Shippuden (Sub)",
    subtitle: "Hurricane Chronicles",
    image: anime5,
    rating: 8.8,
    year: 2023,
    episodes: 500,
    type: "TV",
    status: "Completed",
    genres: ["Action", "Martial Arts", "Comedy"]
  },
  {
    id: "my-hero-academia-sub",
    title: "My Hero Academia (Sub)",
    subtitle: "Boku no Hero Academia",
    image: anime6,
    rating: 8.9,
    year: 2024,
    episodes: 25,
    type: "TV",
    status: "Ongoing",
    genres: ["Action", "School", "Superhero"]
  },
  {
    id: "dragon-ball-z-sub",
    title: "Dragon Ball Z (Sub)",
    subtitle: "Dragon Ball Z",
    image: anime7,
    rating: 9.3,
    year: 2023,
    episodes: 291,
    type: "TV",
    status: "Completed",
    genres: ["Action", "Adventure", "Martial Arts"]
  },
  {
    id: "death-note-sub",
    title: "Death Note (Sub)",
    subtitle: "Death Note",
    image: anime8,
    rating: 9.4,
    year: 2023,
    episodes: 37,
    type: "TV",
    status: "Completed",
    genres: ["Psychological", "Thriller", "Supernatural"]
  }
];

const SubbedAnime = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredAnimes = subbedAnimes.filter(anime =>
    anime.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Subbed Anime</h1>
        <p className="text-muted-foreground">
          Watch anime with Japanese audio and subtitles for the authentic experience
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subbed anime..."
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
          Showing {filteredAnimes.length} of {subbedAnimes.length} results
        </p>
      </div>

      {/* Anime Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
          : 'grid-cols-1 md:grid-cols-2'
      }`}>
        {filteredAnimes.map((anime) => (
          <AnimeCard
            key={anime.id}
            {...anime}
            className={viewMode === 'list' ? 'flex-row' : ''}
          />
        ))}
      </div>

      {filteredAnimes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No anime found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default SubbedAnime;