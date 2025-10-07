import { Link } from "react-router-dom";
import { Play, Star, Calendar, Clock, Subtitles, Mic2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  rating, 
  year, 
  episodes, 
  type, 
  status, 
  genres = [],
  subtitle,
  className = "",
  isDubbed = false
}: AnimeCardProps) => {
  return (
    <div className={`group relative anime-card overflow-hidden ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              size="sm"
              className="w-full mb-2 bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs"
              asChild
            >
              <Link to={`/watch/${id}`}>
                <Play className="h-3 w-3 mr-1" />
                Watch Now
              </Link>
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        {status && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-secondary/90 backdrop-blur-sm"
          >
            {status}
          </Badge>
        )}

        {/* Rating */}
        {rating && (
          <div className="absolute top-2 left-2 flex items-center space-x-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <Link to={`/anime/${id}`} className="block">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Meta Information */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {year && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{year}</span>
              </div>
            )}
            {episodes && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{episodes} eps</span>
              </div>
            )}
          </div>
          
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs px-2 py-0.5 flex items-center gap-1 w-fit",
              isDubbed ? "bg-purple-500/10 text-purple-400 border-purple-500/30" : "bg-blue-500/10 text-blue-400 border-blue-500/30"
            )}
          >
            {isDubbed ? <Mic2 className="h-3 w-3" /> : <Subtitles className="h-3 w-3" />}
            <span>{isDubbed ? "DUB" : "SUB"}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;