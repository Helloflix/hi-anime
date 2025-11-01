import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Star, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="container px-4 py-4">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {anime.animeInfo.Status}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold">{anime.title}</h1>
              <p className="text-lg text-muted-foreground">{anime.japanese_title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link to={`/watch/${id}`}>
                <Play className="h-5 w-5 mr-2" />
                Watch Now
              </Link>
            </Button>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed">{anime.animeInfo.Overview}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {anime.animeInfo.Genres.map((genre, index) => (
                  <Badge key={index} variant="secondary">{genre.name}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="anime-card p-6 space-y-4">
              <h3 className="text-lg font-semibold">Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-medium">{anime.animeInfo["MAL Score"]}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{anime.animeInfo.Duration}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Studios</span>
                  <span className="font-medium">{anime.animeInfo.Studios}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
