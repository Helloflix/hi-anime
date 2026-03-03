import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Player from "@/components/player/Player";
import EpisodeList from "@/components/watch/EpisodeList";
import ServerSelector from "@/components/watch/ServerSelector";
import WatchControls from "@/components/watch/WatchControls";
import RelatedAnime from "@/components/watch/RelatedAnime";
import AnimeInfoSection from "@/components/watch/AnimeInfoSection";
import { getEpisodes, getStreamingInfo, getAnimeDetails, getServers } from "@/services/animeApi";
import type { Episode, Server, AnimeBasic } from "@/types/anime";
import { Skeleton } from "@/components/ui/skeleton";

const slugifyServer = (name?: string) =>
  (name || "").toString().trim().toLowerCase().replace(/\s+/g, "-");

const WatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const epParam = searchParams.get("ep");

  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(0);
  const [relatedAnime, setRelatedAnime] = useState<AnimeBasic[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [currentEpisodeNo, setCurrentEpisodeNo] = useState<number>(1);
  const currentEpisode = episodes.find((ep) => ep.episode_no === currentEpisodeNo);
  const [currentType, setCurrentType] = useState<"sub" | "dub">("sub");
  const [servers, setServers] = useState<Server[]>([]);
  const [currentServer, setCurrentServer] = useState<string>("hd-1");
  const [streamingData, setStreamingData] = useState<any>(null);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [loadingStream, setLoadingStream] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [autoSkip, setAutoSkip] = useState(true);

  // Fetch anime details
  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!id) return;
      setLoadingAnime(true);
      try {
        const result = await getAnimeDetails(id);
        setAnime(result.data);
        setRelatedAnime(result.related_data || []);
        setSeasons(result.seasons || []);
      } catch (error) {
        console.error("Failed to fetch anime details:", error);
      } finally {
        setLoadingAnime(false);
      }
    };
    fetchAnimeDetails();
  }, [id]);

  // Fetch episodes
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!id) return;
      setLoadingEpisodes(true);
      try {
        const data = await getEpisodes(id);
        const eps = data.episodes || [];
        setEpisodes(eps);
        setTotalEpisodes(data.totalEpisodes || eps.length);
        const initialEp = epParam ? parseInt(epParam) : 1;
        const validEp = eps.find((ep) => ep.episode_no === initialEp)?.episode_no || eps[0]?.episode_no || 1;
        setCurrentEpisodeNo(validEp);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      } finally {
        setLoadingEpisodes(false);
      }
    };
    fetchEpisodes();
  }, [id]);

  useEffect(() => {
    if (currentEpisodeNo) {
      setSearchParams({ ep: String(currentEpisodeNo) }, { replace: true });
    }
  }, [currentEpisodeNo, setSearchParams]);

  const getEpisodeIdForApi = useCallback(() => {
    if (!currentEpisode?.id) return null;
    return currentEpisode.id;
  }, [currentEpisode]);

  // Fetch servers
  useEffect(() => {
    const fetchServers = async () => {
      const episodeApiId = getEpisodeIdForApi();
      if (!episodeApiId) return;
      try {
        const serverList = await getServers(episodeApiId);
        if (serverList && serverList.length > 0) {
          setServers(serverList);
          const subServers = serverList.filter((s) => s.type === "sub");
          const dubServers = serverList.filter((s) => s.type === "dub");
          if (currentType === "sub" && subServers.length > 0) {
            setCurrentServer(slugifyServer(subServers[0].server_name || subServers[0].serverName));
          } else if (currentType === "dub" && dubServers.length > 0) {
            setCurrentServer(slugifyServer(dubServers[0].server_name || dubServers[0].serverName));
          } else if (subServers.length > 0) {
            setCurrentType("sub");
            setCurrentServer(slugifyServer(subServers[0].server_name || subServers[0].serverName));
          } else if (dubServers.length > 0) {
            setCurrentType("dub");
            setCurrentServer(slugifyServer(dubServers[0].server_name || dubServers[0].serverName));
          }
        }
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      }
    };
    fetchServers();
  }, [currentEpisode?.id, getEpisodeIdForApi]);

  // Fetch streaming info
  useEffect(() => {
    const fetchStream = async () => {
      const episodeApiId = getEpisodeIdForApi();
      if (!episodeApiId || !currentServer) return;
      setLoadingStream(true);
      try {
        const info = await getStreamingInfo(episodeApiId, currentServer, currentType);
        if (info.servers && info.servers.length > 0) setServers(info.servers);
        setStreamingData(info);
      } catch (error) {
        console.error("Failed to fetch streaming info:", error);
        setStreamingData(null);
      } finally {
        setLoadingStream(false);
      }
    };
    fetchStream();
  }, [currentEpisode?.id, currentServer, currentType, getEpisodeIdForApi]);

  const handleEpisodeChange = useCallback((episodeNo: number) => {
    setCurrentEpisodeNo(episodeNo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goPrev = () => {
    const idx = episodes.findIndex((ep) => ep.episode_no === currentEpisodeNo);
    if (idx > 0) handleEpisodeChange(episodes[idx - 1].episode_no);
  };

  const goNext = () => {
    const idx = episodes.findIndex((ep) => ep.episode_no === currentEpisodeNo);
    if (idx < episodes.length - 1) handleEpisodeChange(episodes[idx + 1].episode_no);
  };

  const playNextEpisode = useCallback(
    (nextEpId: string) => {
      const match = nextEpId.match(/ep=(\d+)/);
      if (match) handleEpisodeChange(parseInt(match[1]));
    },
    [handleEpisodeChange]
  );

  const handleServerChange = (serverId: string, type: "sub" | "dub") => {
    setCurrentServer(serverId);
    setCurrentType(type);
  };

  const handleTypeChange = (type: "sub" | "dub") => {
    setCurrentType(type);
    const available = servers.filter((s) => s.type === type);
    if (available.length > 0) {
      setCurrentServer(slugifyServer(available[0].server_name || available[0].serverName));
    }
  };

  const streamUrl = streamingData?.streamingLink?.link?.file;
  const allTracks = streamingData?.streamingLink?.tracks || [];
  const subtitles = allTracks.filter((t: any) => t.kind === "captions" || t.kind === "subtitles");
  const thumbnailTrack = allTracks.find((t: any) => t.kind === "thumbnails");
  const intro = streamingData?.streamingLink?.intro;
  const outro = streamingData?.streamingLink?.outro;
  const thumbnail = thumbnailTrack?.file || streamingData?.streamingLink?.thumbnail;

  const currentIdx = episodes.findIndex((ep) => ep.episode_no === currentEpisodeNo);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < episodes.length - 1;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* Header Bar */}
      <div className="glass-panel border-b border-border/20">
        <div className="max-w-full px-3 sm:px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="sm" asChild className="shrink-0 hover:bg-primary/10">
              <Link to={`/anime/${id}`}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline text-sm">Back</span>
              </Link>
            </Button>
            {anime?.title && (
              <h1 className="text-xs sm:text-sm text-muted-foreground truncate min-w-0 font-medium">
                {anime.title}
                <span className="text-primary ml-1.5">EP {currentEpisodeNo}</span>
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full px-2 sm:px-4 py-3 sm:py-4">
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_300px] gap-3 sm:gap-4">
          {/* Left Sidebar - Episode List */}
          <div className="hidden xl:block">
            <div className="sticky top-4 h-[calc(100vh-120px)] rounded-xl overflow-hidden glass-panel">
              {loadingEpisodes ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <EpisodeList
                  episodes={episodes}
                  currentEpisode={String(currentEpisodeNo)}
                  onEpisodeClick={handleEpisodeChange}
                  totalEpisodes={totalEpisodes}
                  hasSubbed={servers.some((s) => s.type === "sub")}
                  hasDubbed={servers.some((s) => s.type === "dub")}
                />
              )}
            </div>
          </div>

          {/* Center - Player Area */}
          <div className="space-y-3 sm:space-y-4 min-w-0 overflow-hidden">
            {/* Video Player */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden max-w-full shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              {loadingStream ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : streamUrl ? (
                <Player
                  streamUrl={streamUrl}
                  subtitles={subtitles}
                  thumbnail={thumbnail}
                  intro={intro}
                  outro={outro}
                  autoSkipIntro={autoSkip}
                  autoPlay={autoPlay}
                  autoNext={autoNext}
                  episodeId={String(currentEpisodeNo)}
                  episodes={episodes.map((ep) => ({
                    ...ep,
                    id: `${id}?ep=${ep.data_id}`,
                  }))}
                  playNext={playNextEpisode}
                  animeInfo={anime}
                  episodeNum={currentEpisodeNo}
                  streamInfo={streamingData}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4">
                  <p className="text-center mb-2">
                    {loadingEpisodes
                      ? "Loading..."
                      : servers.length === 0
                      ? "Loading servers..."
                      : "No stream available. Try another server."}
                  </p>
                </div>
              )}
            </div>

            {/* Controls */}
            <WatchControls
              autoPlay={autoPlay}
              setAutoPlay={setAutoPlay}
              autoNext={autoNext}
              setAutoNext={setAutoNext}
              autoSkip={autoSkip}
              setAutoSkip={setAutoSkip}
              onPrev={goPrev}
              onNext={goNext}
              hasPrev={hasPrev}
              hasNext={hasNext}
            />

            {/* Server Selector */}
            <ServerSelector
              servers={servers}
              activeServerId={currentServer}
              onServerChange={handleServerChange}
              currentType={currentType}
              onTypeChange={handleTypeChange}
              loading={loadingStream}
              episodeNumber={currentEpisodeNo}
            />

            {/* Mobile Episode List */}
            <div className="xl:hidden">
              <div className="glass-panel rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border/20">
                  <h3 className="font-semibold text-sm">
                    Episodes {totalEpisodes ? `(${totalEpisodes})` : ""}
                  </h3>
                </div>
                <div className="p-3 max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
                    {episodes.map((ep) => {
                      const isActive = ep.episode_no === currentEpisodeNo;
                      return (
                        <button
                          key={ep.id || ep.episode_no}
                          onClick={() => handleEpisodeChange(ep.episode_no)}
                          className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.5)]"
                              : "bg-secondary/30 hover:bg-secondary/60 text-foreground"
                          }`}
                        >
                          {ep.episode_no}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Anime Info */}
            <AnimeInfoSection anime={anime} seasons={seasons} currentAnimeId={id} />
          </div>

          {/* Right Sidebar - Related Anime */}
          <div className="hidden xl:block">
            <div className="sticky top-4">
              {loadingAnime ? (
                <div className="glass-panel rounded-xl p-4 space-y-4">
                  <Skeleton className="h-6 w-24" />
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-16 h-20 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <RelatedAnime relatedAnime={relatedAnime} />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Related Anime */}
        <div className="xl:hidden mt-6">
          <RelatedAnime relatedAnime={relatedAnime} />
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
