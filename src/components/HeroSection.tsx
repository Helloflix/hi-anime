import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Star, Calendar, Zap, ChevronLeft, ChevronRight } from "lucide-react";
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
      <section className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden">
        <Skeleton className="absolute inset-0" />
      </section>
    );
  }

  if (spotlights.length === 0) return null;

  const currentAnime = spotlights[currentSlide];
  const hasValidEpisodeInfo = currentAnime?.tvInfo?.episodeInfo;
  const episodeCount = hasValidEpisodeInfo 
    ? (currentAnime.tvInfo.episodeInfo.sub || 0) + (currentAnime.tvInfo.episodeInfo.dub || 0)
    : currentAnime?.tvInfo?.eps || 0;

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Images with Smooth Transition */}
      <div className="absolute inset-0">
        {spotlights.map((anime, index) => (
          <div
            key={anime.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={anime.poster}
              alt={anime.title}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-7xl px-4 md:px-6 py-8 md:py-16 lg:py-20 mx-auto">
        <div className="max-w-2xl space-y-3 md:space-y-5 animate-slide-up">
          {/* Spotlight Badge */}
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 animate-glow-pulse">
              <Zap className="h-3 w-3 mr-1" />
              #{currentSlide + 1} Spotlight
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-glow">
            {currentAnime.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm">
            {currentAnime.tvInfo?.quality && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                {currentAnime.tvInfo.quality}
              </Badge>
            )}
            {currentAnime.tvInfo?.showType && (
              <Badge variant="outline" className="bg-card/50 backdrop-blur-sm text-xs">
                {currentAnime.tvInfo.showType}
              </Badge>
            )}
            {episodeCount > 0 && (
              <Badge variant="outline" className="bg-card/50 backdrop-blur-sm text-xs">
                {episodeCount} episodes
              </Badge>
            )}
            {currentAnime.tvInfo?.duration && (
              <span className="text-muted-foreground hidden sm:inline">{currentAnime.tvInfo.duration}</span>
            )}
          </div>

          {/* Description */}
          {currentAnime.description && (
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-2 md:line-clamp-3 max-w-xl hidden sm:block">
              {currentAnime.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 pt-2 md:pt-4">
            <Button 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold animate-glow-pulse h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              asChild
            >
              <Link to={`/watch/${currentAnime.id}`}>
                <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Watch
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              asChild
            >
              <Link to={`/anime/${currentAnime.id}`}>
                <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Details
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 backdrop-blur-sm hover:bg-background/40"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 backdrop-blur-sm hover:bg-background/40"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {spotlights.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-primary scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;