import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AnimeBasic } from "@/types/anime";

interface RelatedAnimeProps {
  relatedAnime: AnimeBasic[];
  title?: string;
}

const RelatedAnime = ({ relatedAnime, title = "Related" }: RelatedAnimeProps) => {
  if (!relatedAnime || relatedAnime.length === 0) return null;

  return (
    <div className="bg-[#191826] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border/30">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="p-3 space-y-3">
          {relatedAnime.map((anime) => (
            <Link
              key={anime.id}
              to={`/anime/${anime.id}`}
              className="flex gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-16 h-20 object-cover rounded-md flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {anime.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{anime.tvInfo?.showType || "TV"}</span>
                  {anime.tvInfo?.eps && (
                    <>
                      <span>•</span>
                      <span>{anime.tvInfo.eps} Eps</span>
                    </>
                  )}
                  {anime.tvInfo?.duration && (
                    <>
                      <span>•</span>
                      <span>{anime.tvInfo.duration}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RelatedAnime;
