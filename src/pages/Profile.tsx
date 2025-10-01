import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Heart, Clock, Bookmark, Settings as SettingsIcon, Edit, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AnimeCard from "@/components/AnimeCard";

const Profile = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Profile Header */}
      <div className="mb-6 md:mb-8">
        <Card className="anime-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
              <Avatar className="h-20 w-20 md:h-24 md:w-24">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-xl md:text-2xl bg-primary text-primary-foreground">
                  <User className="h-6 w-6 md:h-8 md:w-8" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left w-full">
                <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">
                  {user.user_metadata?.username || user.email?.split("@")[0]}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">{user.email}</p>
                
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3 md:mb-4">
                  <Badge variant="secondary">Action</Badge>
                  <Badge variant="secondary">Fantasy</Badge>
                  <Badge variant="secondary">Romance</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 md:gap-4 text-center sm:text-left">
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-primary">0</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Episodes Watched</p>
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-primary">0</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Anime Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button className="glow-effect w-full sm:w-auto" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="w-full sm:w-auto"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="watching" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="watching" className="flex flex-col sm:flex-row items-center py-2 sm:py-3 text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 mb-1 sm:mb-0" />
            <span className="hidden sm:inline">Watching</span>
            <span className="sm:hidden">Watch</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex flex-col sm:flex-row items-center py-2 sm:py-3 text-xs sm:text-sm">
            <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 mb-1 sm:mb-0" />
            <span className="hidden sm:inline">Completed</span>
            <span className="sm:hidden">Done</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex flex-col sm:flex-row items-center py-2 sm:py-3 text-xs sm:text-sm">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 mb-1 sm:mb-0" />
            <span className="hidden sm:inline">Favorites</span>
            <span className="sm:hidden">Favs</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center py-2 sm:py-3 text-xs sm:text-sm">
            <SettingsIcon className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 mb-1 sm:mb-0" />
            <span className="hidden sm:inline">Account</span>
            <span className="sm:hidden">Acct</span>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
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
                <SettingsIcon className="h-4 w-4 mr-2" />
                Notification Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy Settings
              </Button>
              <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;