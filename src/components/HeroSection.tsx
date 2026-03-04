import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getHomeData } from "@/services/animeApi";
import type { AnimeBasic } from "@/types/anime";

const HeroSection = () => {
  const [spotlights, setSpotlights] = useState<AnimeBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await getHomeData();
        setSpotlights(data.spotlights || []);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || spotlights.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spotlights.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, spotlights.length]);

  const nextSlide = () => {
    if (spotlights.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % spotlights.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (spotlights.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + spotlights.length) % spotlights.length);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <section className="relative min-h-[50vh] md:min-h-[65vh] lg:min-h-[75vh] flex items-end overflow-hidden">
        <Skeleton className="absolute inset-0" />
      </section>
    );
  }

  if (spotlights.length === 0) return null;

  const anime = spotlights[currentSlide];
  const hasEpisodeInfo = anime?.tvInfo?.episodeInfo;
  const episodeCount = hasEpisodeInfo
    ? (anime.tvInfo.episodeInfo.sub || 0) + (anime.tvInfo.episodeInfo.dub || 0)
    : anime?.tvInfo?.eps || 0;

  return (
    <section className="relative min-h-[50vh] md:min-h-[65vh] lg:min-h-[75vh] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {spotlights.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={s.poster}
              alt={s.title}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className="w-full h-full object-cover scale-105"
            />
          </div>
        ))}
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px neon-line opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-7xl px-4 md:px-6 pb-10 md:pb-14 lg:pb-20 mx-auto">
        <div className="max-w-xl space-y-4 animate-slide-up">
          <Badge className="bg-primary/15 text-primary border-primary/25 backdrop-blur-sm text-xs">
            <Zap className="h-3 w-3 mr-1" />
            #{currentSlide + 1} Spotlight
          </Badge>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-glow">
            {anime.title}
          </h1>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {anime.tvInfo?.quality && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-semibold">
                {anime.tvInfo.quality}
              </Badge>
            )}
            {anime.tvInfo?.showType && (
              <Badge variant="outline" className="bg-card/40 backdrop-blur-sm text-[10px]">
                {anime.tvInfo.showType}
              </Badge>
            )}
            {episodeCount > 0 && (
              <Badge variant="outline" className="bg-card/40 backdrop-blur-sm text-[10px]">
                {episodeCount} eps
              </Badge>
            )}
          </div>

          {anime.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 max-w-lg hidden sm:block leading-relaxed">
              {anime.description}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button size="sm" className="animate-glow-pulse font-semibold" asChild>
              <Link to={`/watch/${anime.id}`}>
                <Play className="h-4 w-4 mr-1.5 fill-current" />
                Watch Now
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="bg-card/40 backdrop-blur-sm border-border/50" asChild>
              <Link to={`/anime/${anime.id}`}>
                <Info className="h-4 w-4 mr-1.5" />
                Details
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-colors"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-colors"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {spotlights.map((_, i) => (
          <button
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === currentSlide
                ? 'w-6 h-1.5 bg-primary'
                : 'w-1.5 h-1.5 bg-foreground/20 hover:bg-foreground/40'
            }`}
            onClick={() => { setCurrentSlide(i); setIsAutoPlaying(false); }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
