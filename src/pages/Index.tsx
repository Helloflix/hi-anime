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
    <>
      <HeroSection />
      
      {/* Trending Section */}
      <AnimeSectionGrid
        title="Trending Now"
        subtitle="Most watched anime this week"
        icon={TrendingUp}
        animeList={homeData?.trending || []}
        viewAllLink="/trending"
        loading={loading}
        limit={18}
      />

      {/* Top Airing Section */}
      <AnimeSectionGrid
        title="Top Airing"
        subtitle="Currently broadcasting anime"
        icon={Flame}
        animeList={homeData?.topAiring || []}
        viewAllLink="/tv-series"
        loading={loading}
        limit={12}
      />

      {/* Most Popular Section */}
      <AnimeSectionGrid
        title="Most Popular"
        subtitle="Fan favorites of all time"
        icon={Star}
        animeList={homeData?.mostPopular || []}
        viewAllLink="/most-popular"
        loading={loading}
        limit={12}
      />

      {/* Most Favorite Section */}
      <AnimeSectionGrid
        title="Most Favorite"
        subtitle="Highest rated by the community"
        icon={Heart}
        animeList={homeData?.mostFavorite || []}
        loading={loading}
        limit={12}
      />

      {/* Latest Completed Section */}
      <AnimeSectionGrid
        title="Recently Completed"
        subtitle="Finished airing anime"
        icon={CheckCircle}
        animeList={homeData?.latestCompleted || []}
        loading={loading}
        limit={12}
      />

      {/* Latest Episodes Section */}
      <AnimeSectionGrid
        title="Latest Episodes"
        subtitle="Newest episodes released"
        icon={Clock}
        animeList={homeData?.latestEpisode || []}
        loading={loading}
        limit={18}
      />
    </>
  );
};

export default Index;
