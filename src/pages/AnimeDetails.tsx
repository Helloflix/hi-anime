import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, Star, ArrowLeft, Calendar, Clock, Award, Film, Users, Tag, BookOpen, Tv, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnimeDetails, getEpisodes } from "@/services/animeApi";
import type { AnimeDetails as AnimeDetailsType, Episode } from "@/types/anime";

interface Season {
  id: string;
  data_number: number;
  data_id: number;
  season: string;
  title: string;
  japanese_title: string;
  season_poster: string;
}

interface RelatedAnime {
  duration: string;
  data_id: number;
  id: string;
  title: string;
  japanese_title: string;
  poster: string;
  tvInfo: {
    dub: number;
    sub: number;
    showType: string;
    eps: number;
  };
}

interface AnimeDetailsResponse {
  data: AnimeDetailsType;
  seasons?: Season[];
  related_data?: RelatedAnime[];
}

const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState<AnimeDetailsResponse | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [error, setError] = useState(false);

  const fetchDetails = async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const response = await getAnimeDetails(id);
      setAnimeData(response);
    } catch (error) {
      console.error('Failed to fetch anime details:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodes = async () => {
    if (!id) return;
    setLoadingEpisodes(true);
    try {
      const response = await getEpisodes(id);
      setEpisodes(response.episodes || []);
    } catch (error) {
      console.error('Failed to fetch episodes:', error);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchEpisodes();
  }, [id]);

  const anime = animeData?.data;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-4">
          <Skeleton className="h-10 w-32 mb-4" />
        </div>
        <Skeleton className="h-[50vh] w-full" />
        <div className="container px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">Failed to load anime details</p>
            <Button onClick={fetchDetails} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Anime not found</p>
          <Button onClick={() => navigate('/')} variant="outline" size="sm">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container px-4 py-4">
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Hero Banner Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={anime.poster} 
          alt={anime.title} 
          loading="eager"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="container">
            <div className="max-w-4xl space-y-2 md:space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                  {anime.animeInfo.Status}
                </Badge>
                <Badge variant="outline" className="backdrop-blur-sm bg-background/20">
                  {anime.showType}
                </Badge>
                {anime.animeInfo["MAL Score"] && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 backdrop-blur-sm gap-1">
                    <Star className="h-3 w-3 fill-yellow-400" />
                    {anime.animeInfo["MAL Score"]}
                  </Badge>
                )}
                {anime.animeInfo.Duration && (
                  <Badge variant="outline" className="backdrop-blur-sm bg-background/20 gap-1">
                    <Clock className="h-3 w-3" />
                    {anime.animeInfo.Duration}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {anime.title}
              </h1>
              
              <p className="text-sm md:text-base text-muted-foreground">{anime.japanese_title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-b border-border/20 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container px-4 py-3">
          <div className="flex flex-wrap gap-3">
            {episodes.length > 0 && (
              <Button size="lg" className="gap-2" asChild>
                <Link to={`/watch/${id}?ep=${episodes[0].episode_no || 1}`}>
                  <Play className="h-5 w-5" />
                  Watch Episode 1
                </Link>
              </Button>
            )}
            <Button variant="outline" size="lg" className="gap-2">
              <BookOpen className="h-5 w-5" />
              Add to List
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Synopsis Section */}
            {anime.animeInfo.Overview && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Synopsis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {anime.animeInfo.Overview}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Episodes Section */}
            {episodes.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tv className="h-5 w-5 text-primary" />
                    Episodes ({episodes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingEpisodes ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {episodes.slice(0, 20).map((episode) => (
                        <Link
                          key={episode.id}
                          to={`/watch/${id}?ep=${episode.episode_no}`}
                          className="group relative overflow-hidden rounded-lg border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
                        >
                          <div className="aspect-video bg-muted/20 flex items-center justify-center relative">
                            <Play className="h-8 w-8 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="p-2 bg-card/50 backdrop-blur-sm">
                            <p className="text-xs font-medium line-clamp-1">
                              Episode {episode.episode_no}
                            </p>
                            {episode.title && (
                              <p className="text-[10px] text-muted-foreground line-clamp-1">
                                {episode.title}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {episodes.length > 20 && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Showing 20 of {episodes.length} episodes
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Genres Section */}
            {anime.animeInfo.Genres && anime.animeInfo.Genres.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Genres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {anime.animeInfo.Genres.map((genre, index) => (
                      <Badge key={index} variant="secondary" className="text-sm hover:bg-secondary/80 transition-colors">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Producers Section */}
            {anime.animeInfo.Producers && anime.animeInfo.Producers.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Producers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {anime.animeInfo.Producers.map((producer, index) => (
                      <Badge key={index} variant="outline" className="text-sm hover:bg-accent transition-colors">
                        {producer.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seasons Section */}
            {animeData?.seasons && animeData.seasons.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tv className="h-5 w-5 text-primary" />
                    Seasons ({animeData.seasons.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {animeData.seasons.map((season) => (
                      <Link 
                        key={season.id} 
                        to={`/anime/${season.id}`}
                        className="group relative overflow-hidden rounded-lg border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
                      >
                        <div className="aspect-[3/4] relative">
                          <img 
                            src={season.season_poster} 
                            alt={season.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                            <p className="text-xs font-medium line-clamp-2">{season.title}</p>
                            <p className="text-[10px] text-muted-foreground">{season.season}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Anime Section */}
            {animeData?.related_data && animeData.related_data.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Film className="h-5 w-5 text-primary" />
                    Related Anime ({animeData.related_data.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {animeData.related_data.slice(0, 8).map((related) => (
                      <Link 
                        key={related.id} 
                        to={`/anime/${related.id}`}
                        className="group relative overflow-hidden rounded-lg border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
                      >
                        <div className="aspect-[3/4] relative">
                          <img 
                            src={related.poster} 
                            alt={related.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            {related.tvInfo?.sub > 0 && (
                              <Badge className="text-[10px] px-1.5 py-0 h-5 bg-primary/90">
                                SUB {related.tvInfo.sub}
                              </Badge>
                            )}
                            {related.tvInfo?.dub > 0 && (
                              <Badge className="text-[10px] px-1.5 py-0 h-5 bg-secondary/90">
                                DUB {related.tvInfo.dub}
                              </Badge>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                            <p className="text-xs font-medium line-clamp-2">{related.title}</p>
                            <p className="text-[10px] text-muted-foreground">{related.tvInfo?.showType}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Information Card */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-border/50 sticky top-20">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Film className="h-5 w-5 text-primary" />
                  Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {anime.animeInfo["MAL Score"] && (
                  <>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        MAL Score
                      </span>
                      <span className="font-semibold flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {anime.animeInfo["MAL Score"]}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                
                {anime.showType && (
                  <>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <Badge variant="secondary">{anime.showType}</Badge>
                    </div>
                    <Separator />
                  </>
                )}
                
                {anime.animeInfo.Status && (
                  <>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {anime.animeInfo.Status}
                      </Badge>
                    </div>
                    <Separator />
                  </>
                )}
                
                {anime.animeInfo.Premiered && (
                  <>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Premiered
                      </span>
                      <span className="font-medium text-sm">{anime.animeInfo.Premiered}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                {anime.animeInfo.Aired && (
                  <>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Aired</span>
                      <span className="font-medium text-sm text-right max-w-[60%]">
                        {anime.animeInfo.Aired}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                
                {anime.animeInfo.Duration && (
                  <>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Duration
                      </span>
                      <span className="font-medium text-sm">{anime.animeInfo.Duration}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                {anime.animeInfo.Studios && (
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm text-muted-foreground">Studios</span>
                    <span className="font-medium text-sm text-right max-w-[60%]">
                      {anime.animeInfo.Studios}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
