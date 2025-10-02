import { Clock, TrendingUp, Star, Play } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

const trendingAnime = [
  { id: 1, title: "Demon Slayer S4", episode: "EP 12", rating: 9.2, status: "Airing" },
  { id: 2, title: "Jujutsu Kaisen", episode: "EP 24", rating: 9.0, status: "Completed" },
  { id: 3, title: "Attack on Titan", episode: "EP 87", rating: 9.5, status: "Completed" },
  { id: 4, title: "One Piece", episode: "EP 1095", rating: 8.9, status: "Airing" },
  { id: 5, title: "My Hero Academia", episode: "EP 138", rating: 8.7, status: "Airing" },
];

const recentUpdates = [
  { title: "Frieren: Beyond Journey's End", time: "2 mins ago" },
  { title: "Solo Leveling", time: "15 mins ago" },
  { title: "Mushoku Tensei", time: "1 hour ago" },
  { title: "Blue Lock S2", time: "3 hours ago" },
];

export function EntertainmentSidebar() {
  return (
    <aside className="hidden lg:block w-80 border-l border-border/40 bg-card/30 backdrop-blur-sm">
      <ScrollArea className="h-screen pb-20">
        <div className="p-4 space-y-6">
          {/* Trending Now */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Trending Now</h3>
            </div>
            <div className="space-y-3">
              {trendingAnime.map((anime) => (
                <Card
                  key={anime.id}
                  className="p-3 bg-card/50 hover:bg-card/80 transition-all cursor-pointer border-border/40 hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate text-foreground">
                        {anime.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          {anime.episode}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {anime.rating}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={anime.status === "Airing" ? "default" : "outline"}
                      className="text-xs shrink-0"
                    >
                      {anime.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Updates */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Recent Updates</h3>
            </div>
            <div className="space-y-2">
              {recentUpdates.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border border-border/20"
                >
                  <div className="flex items-start gap-2">
                    <Play className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Anime</span>
                <span className="font-bold text-primary">12,540+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Episodes</span>
                <span className="font-bold text-primary">185,320+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="font-bold text-primary">2.5M+</span>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </aside>
  );
}
