import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AnimeCard from "@/components/AnimeCard";
import { searchAnime, getHomeData } from "@/services/animeApi";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance",
  "Thriller", "Horror", "Sci-Fi", "Slice of Life", "Sports", "Supernatural",
  "Mecha", "Isekai", "School", "Magic", "Mystery", "Ecchi",
  "Music", "Psychological",
];

interface AnimeResult {
  id: string;
  title: string;
  poster: string;
  tvInfo?: {
    showType?: string;
    sub?: number;
    dub?: number;
    eps?: number;
  };
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [availableGenres, setAvailableGenres] = useState<string[]>(GENRES);

  // Load genres from API
  useEffect(() => {
    getHomeData().then((data) => {
      if (data?.genres?.length) setAvailableGenres(data.genres);
    }).catch(() => {});
  }, []);

  const doSearch = useCallback(async (q: string, p: number, append = false) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await searchAnime(q.trim(), p);
      const items: AnimeResult[] = (data?.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        poster: item.poster,
        tvInfo: item.tvInfo,
      }));
      setResults((prev) => (append ? [...prev, ...items] : items));
      setHasMore(data?.hasNextPage ?? false);
    } catch {
      if (!append) setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search on mount / query param change
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      setPage(1);
      doSearch(initialQuery, 1);
    }
  }, [initialQuery, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchParams(searchQuery.trim() ? { q: searchQuery.trim() } : {});
    doSearch(searchQuery, 1);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    doSearch(searchQuery, next, true);
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Client-side filtering
  const filtered = results.filter((anime) => {
    if (selectedType && anime.tvInfo?.showType?.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }
    // Genre filter is client-side best-effort (API doesn't return genres in search)
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">Search Anime</h1>
        <p className="text-muted-foreground text-sm">Find your favorite anime instantly</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Type anime name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
            autoFocus
          />
        </div>
        <Button type="submit" className="h-11 px-6">Search</Button>
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="anime-card p-4 mb-6 space-y-4 animate-in slide-in-from-top-2">
          {/* Type filter */}
          <div>
            <p className="text-sm font-medium mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {["", "TV", "Movie", "OVA", "ONA", "Special"].map((t) => (
                <Badge
                  key={t || "all"}
                  variant={selectedType === t ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedType(t)}
                >
                  {t || "All"}
                </Badge>
              ))}
            </div>
          </div>

          {/* Genre filter */}
          <div>
            <p className="text-sm font-medium mb-2">
              Genres
              {selectedGenres.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-5 text-xs text-muted-foreground"
                  onClick={() => setSelectedGenres([])}
                >
                  <X className="h-3 w-3 mr-1" /> Clear
                </Button>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {availableGenres.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handleGenreToggle(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      {searchQuery.trim() && !isLoading && (
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      )}

      {/* Loading */}
      {isLoading && results.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Searching...</span>
        </div>
      )}

      {/* Results Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((anime) => (
            <AnimeCard
              key={anime.id}
              id={anime.id}
              title={anime.title}
              image={anime.poster}
              type={anime.tvInfo?.showType}
              episodes={anime.tvInfo?.eps || anime.tvInfo?.sub}
            />
          ))}
        </div>
      )}

      {/* No results */}
      {!isLoading && searchQuery.trim() && filtered.length === 0 && (
        <div className="text-center py-20">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium">No anime found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
        </div>
      )}

      {/* Load More */}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}

      {isLoading && results.length > 0 && (
        <div className="flex justify-center mt-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
