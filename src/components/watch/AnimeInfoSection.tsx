import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AnimeInfoSectionProps {
  anime: {
    id: string;
    title: string;
    japanese_title?: string;
    poster: string;
    showType?: string;
    animeInfo?: {
      Overview?: string;
      Aired?: string;
      Premiered?: string;
      Status?: string;
      Duration?: string;
      "MAL Score"?: string;
      Genres?: Array<{ name: string; url: string }>;
      Studios?: string;
      Producers?: Array<{ name: string; url: string }>;
    };
    tvInfo?: {
      rating?: string;
      quality?: string;
      sub?: number;
      dub?: number;
    };
  } | null;
  seasons?: Array<{
    id: string;
    season: string;
    season_poster: string;
  }>;
  currentAnimeId?: string;
}

const AnimeInfoSection = ({ anime, seasons, currentAnimeId }: AnimeInfoSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!anime) return null;

  const info = anime.animeInfo;
  const description = info?.Overview || "";
  const shouldTruncate = description.length > 300;
  const displayDescription =
    shouldTruncate && !isExpanded
      ? description.slice(0, 300) + "..."
      : description;

  return (
    <div className="bg-[#191826] rounded-lg p-6">
      <div className="flex gap-6 flex-col md:flex-row">
        {/* Poster */}
        <div className="flex-shrink-0">
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-32 h-44 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{anime.title}</h1>
            {anime.japanese_title && (
              <p className="text-sm text-muted-foreground mt-1">
                {anime.japanese_title}
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {anime.tvInfo?.rating && (
              <Badge variant="secondary" className="bg-white/90 text-black">
                {anime.tvInfo.rating}
              </Badge>
            )}
            {anime.tvInfo?.quality && (
              <Badge variant="secondary" className="bg-pink-300 text-black">
                {anime.tvInfo.quality}
              </Badge>
            )}
            {anime.tvInfo?.sub && (
              <Badge variant="secondary" className="bg-green-300 text-black">
                SUB: {anime.tvInfo.sub}
              </Badge>
            )}
            {anime.tvInfo?.dub && (
              <Badge variant="secondary" className="bg-blue-300 text-black">
                DUB: {anime.tvInfo.dub}
              </Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayDescription}
            </p>
            {shouldTruncate && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto text-primary"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {anime.showType && (
              <div>
                <span className="text-muted-foreground">Type: </span>
                <span className="text-foreground">{anime.showType}</span>
              </div>
            )}
            {info?.Premiered && (
              <div>
                <span className="text-muted-foreground">Premiered: </span>
                <span className="text-foreground">{info.Premiered}</span>
              </div>
            )}
            {info?.Aired && (
              <div>
                <span className="text-muted-foreground">Aired: </span>
                <span className="text-foreground">{info.Aired}</span>
              </div>
            )}
            {info?.Status && (
              <div>
                <span className="text-muted-foreground">Status: </span>
                <span className="text-foreground">{info.Status}</span>
              </div>
            )}
            {info?.Duration && (
              <div>
                <span className="text-muted-foreground">Duration: </span>
                <span className="text-foreground">{info.Duration}</span>
              </div>
            )}
            {info?.["MAL Score"] && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">MAL: </span>
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-foreground">{info["MAL Score"]}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {info?.Genres && info.Genres.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Genres:</span>
              {info.Genres.map((genre, idx) => (
                <Link
                  key={idx}
                  to={`/genre/${genre.name.toLowerCase()}`}
                  className="text-sm text-primary hover:underline"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          )}

          {/* Studios */}
          {info?.Studios && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Studios:</span>
              <span className="text-sm text-foreground">{info.Studios}</span>
            </div>
          )}
        </div>
      </div>

      {/* Seasons */}
      {seasons && seasons.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border/30">
          <h3 className="text-lg font-semibold mb-4">Seasons</h3>
          <div className="flex gap-3 flex-wrap">
            {seasons.map((season) => (
              <Link
                key={season.id}
                to={`/watch/${season.id}`}
                className={`relative w-32 h-16 rounded-lg overflow-hidden group ${
                  currentAnimeId === season.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                <img
                  src={season.season_poster}
                  alt={season.season}
                  className="w-full h-full object-cover blur-[2px] opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`text-xs font-bold text-center px-2 ${
                      currentAnimeId === season.id
                        ? "text-primary"
                        : "text-white group-hover:text-primary"
                    } transition-colors`}
                  >
                    {season.season}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeInfoSection;
