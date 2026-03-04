import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AnimeSectionGrid from "@/components/AnimeSectionGrid";
import { Flame, Clock, Star, Heart, CheckCircle, TrendingUp } from "lucide-react";
import { getHomeData } from "@/services/animeApi";
import type { HomeData } from "@/types/anime";

const Index = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomeData();
        setHomeData(data);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-0">
      <HeroSection />

      {/* Neon divider */}
      <div className="neon-line opacity-30 mx-auto max-w-7xl" />

      <AnimeSectionGrid
        title="Trending Now"
        subtitle="Most watched this week"
        icon={TrendingUp}
        animeList={homeData?.trending || []}
        viewAllLink="/trending"
        loading={loading}
        limit={18}
      />

      <AnimeSectionGrid
        title="Top Airing"
        subtitle="Currently broadcasting"
        icon={Flame}
        animeList={homeData?.topAiring || []}
        viewAllLink="/tv-series"
        loading={loading}
        limit={12}
      />

      <AnimeSectionGrid
        title="Most Popular"
        subtitle="Fan favorites of all time"
        icon={Star}
        animeList={homeData?.mostPopular || []}
        viewAllLink="/most-popular"
        loading={loading}
        limit={12}
      />

      <AnimeSectionGrid
        title="Most Favorite"
        subtitle="Highest rated by community"
        icon={Heart}
        animeList={homeData?.mostFavorite || []}
        loading={loading}
        limit={12}
      />

      <AnimeSectionGrid
        title="Recently Completed"
        subtitle="Finished airing"
        icon={CheckCircle}
        animeList={homeData?.latestCompleted || []}
        loading={loading}
        limit={12}
      />

      <AnimeSectionGrid
        title="Latest Episodes"
        subtitle="Newest releases"
        icon={Clock}
        animeList={homeData?.latestEpisode || []}
        loading={loading}
        limit={18}
      />
    </div>
  );
};

export default Index;
