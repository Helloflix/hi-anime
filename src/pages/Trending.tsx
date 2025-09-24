import { useState } from "react";
import { TrendingUp, Calendar, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AnimeCard from "@/components/AnimeCard";

const Trending = () => {
  const [timeFrame, setTimeFrame] = useState("today");

  // Mock trending data
  const trendingToday = [
    { id: 1, title: "Attack on Titan Final Season", image: "/src/assets/anime1.jpg", rating: 9.1, episodes: "Episode 87", status: "New", trend: "+15%" },
    { id: 2, title: "Demon Slayer: Infinity Castle", image: "/src/assets/anime2.jpg", rating: 8.9, episodes: "Episode 12", status: "Hot", trend: "+8%" },
    { id: 3, title: "One Piece", image: "/src/assets/anime3.jpg", rating: 9.0, episodes: "Episode 1085", status: "Trending", trend: "+12%" },
  ];

  const trendingWeek = [
    { id: 4, title: "Jujutsu Kaisen Season 3", image: "/src/assets/anime4.jpg", rating: 8.8, episodes: "Episode 24", status: "Popular", trend: "+25%" },
    { id: 5, title: "My Hero Academia", image: "/src/assets/anime5.jpg", rating: 8.5, episodes: "Episode 138", status: "Rising", trend: "+18%" },
    { id: 6, title: "Chainsaw Man", image: "/src/assets/anime6.jpg", rating: 8.7, episodes: "Episode 12", status: "Viral", trend: "+30%" },
  ];

  const topRated = [
    { id: 7, title: "Fullmetal Alchemist Brotherhood", image: "/src/assets/anime7.jpg", rating: 9.5, episodes: "64 Episodes", status: "Masterpiece", trend: "★" },
    { id: 8, title: "Death Note", image: "/src/assets/anime8.jpg", rating: 9.3, episodes: "37 Episodes", status: "Classic", trend: "★" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-green-500";
      case "Hot": return "bg-red-500";
      case "Trending": return "bg-blue-500";
      case "Popular": return "bg-purple-500";
      case "Rising": return "bg-yellow-500";
      case "Viral": return "bg-pink-500";
      case "Masterpiece": return "bg-gold-500";
      case "Classic": return "bg-indigo-500";
      default: return "bg-primary";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-glow mb-4">Trending Anime</h1>
        <p className="text-muted-foreground text-lg">
          Discover what's hot in the anime world right now
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="anime-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-sm text-muted-foreground">Trending Shows</p>
          </CardContent>
        </Card>
        
        <Card className="anime-card">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">9.2</p>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
        
        <Card className="anime-card">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">New This Week</p>
          </CardContent>
        </Card>
        
        <Card className="anime-card">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">24/7</p>
            <p className="text-sm text-muted-foreground">Live Updates</p>
          </CardContent>
        </Card>
      </div>

      {/* Trending Tabs */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="top">Top Rated</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Trending Today</h2>
              <Badge className="glow-effect">Live Updates</Badge>
            </div>
            
            <div className="grid gap-6">
              {trendingToday.map((anime, index) => (
                <Card key={anime.id} className="anime-card">
                  <CardContent className="p-0">
                    <div className="flex items-center p-6">
                      <div className="text-4xl font-bold text-primary mr-6 w-16 text-center">
                        #{index + 1}
                      </div>
                      
                      <div className="relative mr-6">
                        <img 
                          src={anime.image} 
                          alt={anime.title}
                          className="w-24 h-32 object-cover rounded-lg"
                        />
                        <Badge className={`absolute -top-2 -right-2 text-xs ${getStatusColor(anime.status)}`}>
                          {anime.status}
                        </Badge>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{anime.title}</h3>
                        <p className="text-muted-foreground mb-2">{anime.episodes}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{anime.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-500 font-medium">{anime.trend}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="glow-effect">
                        Watch Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="week">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Trending This Week</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
          </div>
        </TabsContent>

        <TabsContent value="top">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Top Rated Anime</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
          </div>
        </TabsContent>
      </Tabs>

      {/* Featured Section */}
      <div className="mt-12">
        <Card className="anime-card bg-gradient-to-r from-primary/10 to-glow-cyan/10">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <TrendingUp className="h-6 w-6 mr-2 text-primary" />
              Trending Alert
            </CardTitle>
            <CardDescription>
              Don't miss out on the hottest anime everyone's talking about!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Attack on Titan Final Season</h3>
                <p className="text-muted-foreground">
                  The epic conclusion to humanity's fight against the titans is breaking the internet.
                </p>
              </div>
              <Button size="lg" className="glow-effect">
                Watch Episode 87
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Trending;