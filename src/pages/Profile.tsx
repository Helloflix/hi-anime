import { useState } from "react";
import { User, Heart, Clock, Bookmark, Settings, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AnimeCard from "@/components/AnimeCard";

const Profile = () => {
  const [user] = useState({
    name: "Anime Otaku",
    email: "otaku@animixplay.com",
    avatar: "",
    joinDate: "January 2023",
    watchedEpisodes: 1247,
    completedAnime: 89,
    favoriteGenres: ["Action", "Fantasy", "Romance"]
  });

  // Mock data for different lists
  const watchlist = [
    { id: 1, title: "Attack on Titan", image: "/src/assets/anime1.jpg", rating: 9.0, episodes: "75/87 Episodes", status: "Watching" },
    { id: 2, title: "Demon Slayer", image: "/src/assets/anime2.jpg", rating: 8.7, episodes: "12/44 Episodes", status: "Watching" },
  ];

  const favorites = [
    { id: 3, title: "One Piece", image: "/src/assets/anime3.jpg", rating: 9.2, episodes: "1000+ Episodes", status: "Ongoing" },
    { id: 4, title: "Naruto", image: "/src/assets/anime4.jpg", rating: 8.8, episodes: "720 Episodes", status: "Completed" },
  ];

  const completed = [
    { id: 5, title: "Death Note", image: "/src/assets/anime5.jpg", rating: 9.1, episodes: "37 Episodes", status: "Completed" },
    { id: 6, title: "Fullmetal Alchemist", image: "/src/assets/anime6.jpg", rating: 9.5, episodes: "64 Episodes", status: "Completed" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <Card className="anime-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {user.favoriteGenres.map(genre => (
                    <Badge key={genre} variant="secondary">{genre}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center md:text-left">
                  <div>
                    <p className="text-2xl font-bold text-primary">{user.watchedEpisodes}</p>
                    <p className="text-sm text-muted-foreground">Episodes Watched</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{user.completedAnime}</p>
                    <p className="text-sm text-muted-foreground">Anime Completed</p>
                  </div>
                </div>
              </div>
              
              <Button className="glow-effect">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="watching" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="watching" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Watching
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <Bookmark className="h-4 w-4 mr-2" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watching">
          <Card className="anime-card">
            <CardHeader>
              <CardTitle>Currently Watching</CardTitle>
              <CardDescription>
                Anime you're currently following
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {watchlist.map(anime => (
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="anime-card">
            <CardHeader>
              <CardTitle>Completed Anime</CardTitle>
              <CardDescription>
                Anime you've finished watching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {completed.map(anime => (
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card className="anime-card">
            <CardHeader>
              <CardTitle>Favorite Anime</CardTitle>
              <CardDescription>
                Your all-time favorite anime series
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favorites.map(anime => (
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="anime-card">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Update Profile Information
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Notification Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy Settings
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;