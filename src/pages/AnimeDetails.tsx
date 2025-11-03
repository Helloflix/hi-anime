import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Star, ArrowLeft, Calendar, Clock, TrendingUp, Award, Film, Users, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getAnimeDetails } from "@/services/animeApi";
import type { AnimeDetails as AnimeDetailsType } from "@/types/anime";

const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const data = await getAnimeDetails(id);
        setAnime(data.data);
      } catch (error) {
        console.error('Failed to fetch anime details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-[60vh] w-full" />
        <div className="container px-4 py-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!anime) return <div className="container px-4 py-8">Anime not found</div>;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="container px-4 py-4 md:py-6">
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Hero Banner Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={anime.poster} 
          alt={anime.title} 
          loading="eager"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container">
            <div className="max-w-4xl space-y-3 md:space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                  {anime.animeInfo.Status}
                </Badge>
                <Badge variant="outline" className="backdrop-blur-sm">
                  {anime.showType}
                </Badge>
                {anime.animeInfo["MAL Score"] && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 backdrop-blur-sm gap-1">
                    <Star className="h-3 w-3 fill-yellow-400" />
                    {anime.animeInfo["MAL Score"]}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-glow leading-tight">
                {anime.title}
              </h1>
              
              <div className="flex flex-col gap-1">
                <p className="text-base md:text-lg text-muted-foreground">{anime.japanese_title}</p>
                {anime.animeInfo.Synonyms && (
                  <p className="text-sm text-muted-foreground/80">{anime.animeInfo.Synonyms}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 shadow-lg animate-glow-pulse flex-1 sm:flex-initial"
                asChild
              >
                <Link to={`/watch/${id}`}>
                  <Play className="h-5 w-5 mr-2" />
                  Watch Now
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="backdrop-blur-sm"
              >
                <Star className="h-5 w-5 mr-2" />
                Add to List
              </Button>
            </div>

            {/* Synopsis Card */}
            <Card className="anime-card">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">Synopsis</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {anime.animeInfo.Overview}
                </p>
              </CardContent>
            </Card>

            {/* Genres Card */}
            <Card className="anime-card">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold">Genres</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {anime.animeInfo.Genres.map((genre, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Producers Card */}
            {anime.animeInfo.Producers && anime.animeInfo.Producers.length > 0 && (
              <Card className="anime-card">
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold">Producers</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {anime.animeInfo.Producers.map((producer, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="backdrop-blur-sm"
                      >
                        {producer.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Info Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Main Info Card */}
            <Card className="anime-card sticky top-4">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Information</h3>
                </div>
                
                <div className="space-y-3">
                  {/* MAL Score */}
                  {anime.animeInfo["MAL Score"] && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Star className="h-4 w-4" />
                          <span className="text-sm">MAL Score</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{anime.animeInfo["MAL Score"]}</span>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Type */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Film className="h-4 w-4" />
                      <span className="text-sm">Type</span>
                    </div>
                    <span className="font-medium">{anime.showType}</span>
                  </div>
                  <Separator />

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Status</span>
                    </div>
                    <Badge variant="outline">{anime.animeInfo.Status}</Badge>
                  </div>
                  <Separator />

                  {/* Premiered */}
                  {anime.animeInfo.Premiered && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Premiered</span>
                        </div>
                        <span className="font-medium text-right text-sm">
                          {anime.animeInfo.Premiered}
                        </span>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Aired */}
                  {anime.animeInfo.Aired && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Aired</span>
                        </div>
                        <span className="font-medium text-right text-sm">
                          {anime.animeInfo.Aired}
                        </span>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Duration */}
                  {anime.animeInfo.Duration && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Duration</span>
                        </div>
                        <span className="font-medium">{anime.animeInfo.Duration}</span>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Studios */}
                  {anime.animeInfo.Studios && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Studios</span>
                        </div>
                        <span className="font-medium text-right text-sm">
                          {anime.animeInfo.Studios}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
