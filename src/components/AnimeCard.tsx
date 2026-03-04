import { Link } from "react-router-dom";
import { Play, Calendar, Clock, Subtitles, Mic2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  id: string;
  title: string;
  image: string;
  rating?: number;
  year?: number;
  episodes?: number;
  type?: string;
  status?: string;
  genres?: string[];
  subtitle?: string;
  className?: string;
  isDubbed?: boolean;
}

const AnimeCard = ({
  id,
  title,
  image,
  year,
  episodes,
  subtitle,
  className = "",
  isDubbed = false,
}: AnimeCardProps) => {
  return (
    <Link to={`/anime/${id}`} className={cn("group block anime-card", className)}>
      {/* Poster */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center shadow-lg backdrop-blur-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Play className="h-4 w-4 text-primary-foreground fill-current ml-0.5" />
          </div>
        </div>

        {/* Language badges - top right */}
        <div className="absolute top-1.5 right-1.5 flex gap-1">
          {subtitle && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/80 text-primary-foreground backdrop-blur-sm">
              SUB
            </span>
          )}
          {isDubbed && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground backdrop-blur-sm">
              DUB
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-1.5">
        <h3 className="font-medium text-xs leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          {year && (
            <span className="flex items-center gap-0.5">
              <Calendar className="h-2.5 w-2.5" />
              {year}
            </span>
          )}
          {episodes !== undefined && episodes > 0 && (
            <span className="flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5" />
              {episodes} eps
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
