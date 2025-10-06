import { TrendingUp, Calendar, Star, Clock, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AnimeCard from "@/components/AnimeCard";

const Trending = () => {
  // Mock trending data
  const trendingToday = [
    { id: 1, title: "Attack on Titan Final Season", image: "/src/assets/anime1.jpg", rating: 9.1, episodes: "Episode 87", status: "New", trend: "+15%", views: "2.4M" },
    { id: 2, title: "Demon Slayer: Infinity Castle", image: "/src/assets/anime2.jpg", rating: 8.9, episodes: "Episode 12", status: "Hot", trend: "+8%", views: "1.8M" },
    { id: 3, title: "One Piece", image: "/src/assets/anime3.jpg", rating: 9.0, episodes: "Episode 1085", status: "Trending", trend: "+12%", views: "3.1M" },
    { id: 4, title: "Jujutsu Kaisen Season 3", image: "/src/assets/anime4.jpg", rating: 8.8, episodes: "Episode 24", status: "Popular", trend: "+25%", views: "1.5M" },
  ];

  const trendingWeek = [
    { id: 5, title: "My Hero Academia", image: "/src/assets/anime5.jpg", rating: 8.5, episodes: "Episode 138", status: "Rising" },
    { id: 6, title: "Chainsaw Man", image: "/src/assets/anime6.jpg", rating: 8.7, episodes: "Episode 12", status: "Viral" },
    { id: 1, title: "Attack on Titan", image: "/src/assets/anime1.jpg", rating: 9.1, episodes: "87 Episodes", status: "Hot" },
    { id: 2, title: "Demon Slayer", image: "/src/assets/anime2.jpg", rating: 8.9, episodes: "45 Episodes", status: "Popular" },
    { id: 3, title: "One Piece", image: "/src/assets/anime3.jpg", rating: 9.0, episodes: "1085 Episodes", status: "Trending" },
    { id: 4, title: "Jujutsu Kaisen", image: "/src/assets/anime4.jpg", rating: 8.8, episodes: "47 Episodes", status: "Rising" },
  ];

  const topRated = [
    { id: 7, title: "Fullmetal Alchemist Brotherhood", image: "/src/assets/anime7.jpg", rating: 9.5, episodes: "64 Episodes", status: "Masterpiece" },
    { id: 8, title: "Death Note", image: "/src/assets/anime8.jpg", rating: 9.3, episodes: "37 Episodes", status: "Classic" },
    { id: 1, title: "Attack on Titan", image: "/src/assets/anime1.jpg", rating: 9.1, episodes: "87 Episodes", status: "Epic" },
    { id: 3, title: "One Piece", image: "/src/assets/anime3.jpg", rating: 9.0, episodes: "1085 Episodes", status: "Legend" },
    { id: 2, title: "Demon Slayer", image: "/src/assets/anime2.jpg", rating: 8.9, episodes: "45 Episodes", status: "Stunning" },
    { id: 4, title: "Jujutsu Kaisen", image: "/src/assets/anime4.jpg", rating: 8.8, episodes: "47 Episodes", status: "Amazing" },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "New": "bg-green-500/90 hover:bg-green-500",
      "Hot": "bg-red-500/90 hover:bg-red-500",
      "Trending": "bg-blue-500/90 hover:bg-blue-500",
      "Popular": "bg-purple-500/90 hover:bg-purple-500",
      "Rising": "bg-yellow-500/90 hover:bg-yellow-500",
      "Viral": "bg-pink-500/90 hover:bg-pink-500",
      "Masterpiece": "bg-amber-500/90 hover:bg-amber-500",
      "Classic": "bg-indigo-500/90 hover:bg-indigo-500",
    };
    return colors[status] || "bg-primary/90 hover:bg-primary";
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Trending Anime
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Discover what's hot in the anime world right now
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <Card className="anime-card border-0 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <p className="text-xl md:text-2xl font-bold">1.2K</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Trending</p>
          </CardContent>
        </Card>
        
        <Card className="anime-card border-0 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-yellow-500/10">
              <Star className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
            </div>
            <p className="text-xl md:text-2xl font-bold">9.2</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Avg Rating</p>
          </CardContent>
        </Card>
        
        <Card className="anime-card border-0 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-green-500/10">
              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
            </div>
            <p className="text-xl md:text-2xl font-bold">156</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">New Episodes</p>
          </CardContent>
        </Card>
        
        <Card className="anime-card border-0 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-blue-500/10">
              <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
            </div>
            <p className="text-xl md:text-2xl font-bold">24/7</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Live</p>
          </CardContent>
        </Card>
      </div>

      {/* Trending Tabs */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-11 md:h-12 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="today" className="text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            This Week
          </TabsTrigger>
          <TabsTrigger value="top" className="text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Top Rated
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold">Trending Today</h2>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
              Live
            </Badge>
          </div>
          
          <div className="grid gap-3 md:gap-4">
            {trendingToday.map((anime, index) => (
              <Card key={anime.id} className="anime-card overflow-hidden border-0 bg-gradient-to-r from-card to-card/50">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4">
                    <div className="text-2xl md:text-3xl font-bold text-primary/20 w-8 md:w-12 text-center flex-shrink-0">
                      #{index + 1}
                    </div>
                    
                    <div className="relative flex-shrink-0">
                      <img 
                        src={anime.image} 
                        alt={anime.title}
                        className="w-16 h-20 md:w-20 md:h-28 object-cover rounded-lg"
                      />
                      <Badge className={`absolute -top-1 -right-1 text-[10px] px-1.5 py-0 h-5 ${getStatusColor(anime.status)} text-white border-0`}>
                        {anime.status}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-bold mb-1 truncate">{anime.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{anime.episodes}</p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span className="font-medium">{anime.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">{anime.trend}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">{anime.views}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button size="sm" className="hidden md:flex bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                      <Play className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                    <Button size="icon" variant="ghost" className="md:hidden flex-shrink-0 h-9 w-9">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <h2 className="text-lg md:text-xl font-bold mb-4">Trending This Week</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {trendingWeek.map(anime => (
              <AnimeCard 
                key={anime.id} 
                id={anime.id.toString()} 
                title={anime.title} 
                image={anime.image} 
                rating={anime.rating} 
                status={anime.status} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top" className="space-y-4">
          <h2 className="text-lg md:text-xl font-bold mb-4">Top Rated Anime</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {topRated.map(anime => (
              <AnimeCard 
                key={anime.id} 
                id={anime.id.toString()} 
                title={anime.title} 
                image={anime.image} 
                rating={anime.rating} 
                status={anime.status} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trending;
