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

  // Anime data states
  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(0);
  const [relatedAnime, setRelatedAnime] = useState<AnimeBasic[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);

  // Current episode state
  const [currentEpisodeNo, setCurrentEpisodeNo] = useState<number>(1);
  const currentEpisode = episodes.find((ep) => ep.episode_no === currentEpisodeNo);

  // Server/streaming states
  const [currentType, setCurrentType] = useState<"sub" | "dub">("sub");
  const [servers, setServers] = useState<Server[]>([]);
  const [currentServer, setCurrentServer] = useState<string>("hd-1");
  const [streamingData, setStreamingData] = useState<any>(null);

  // Loading states
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [loadingStream, setLoadingStream] = useState(false);

  // Control states
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [autoSkip, setAutoSkip] = useState(true);
  const [lightMode, setLightMode] = useState(false);

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

        // Set initial episode from URL or default to 1
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

  // Update URL when episode changes
  useEffect(() => {
    if (currentEpisodeNo) {
      setSearchParams({ ep: String(currentEpisodeNo) }, { replace: true });
    }
  }, [currentEpisodeNo, setSearchParams]);

  // The episode.id from the API is already in the correct format: "anime-id?ep=data-id"
  const getEpisodeIdForApi = useCallback(() => {
    if (!currentEpisode?.id) return null;
    return currentEpisode.id;
  }, [currentEpisode]);

  // Fetch servers when episode changes
  useEffect(() => {
    const fetchServers = async () => {
      const episodeApiId = getEpisodeIdForApi();
      if (!episodeApiId) return;

      try {
        const serverList = await getServers(episodeApiId);
        if (serverList && serverList.length > 0) {
          setServers(serverList);
          // Set default server based on available types
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

  // Fetch streaming info when episode/server/type changes
  useEffect(() => {
    const fetchStream = async () => {
      const episodeApiId = getEpisodeIdForApi();
      if (!episodeApiId || !currentServer) return;

      setLoadingStream(true);
      try {
        const info = await getStreamingInfo(episodeApiId, currentServer, currentType);
        
        // Update servers from stream response if available
        if (info.servers && info.servers.length > 0) {
          setServers(info.servers);
        }

        setStreamingData(info);
        console.log("Stream data loaded:", info);
      } catch (error) {
        console.error("Failed to fetch streaming info:", error);
        setStreamingData(null);
      } finally {
        setLoadingStream(false);
      }
    };
    fetchStream();
  }, [currentEpisode?.id, currentServer, currentType, getEpisodeIdForApi]);

  // Episode navigation handlers
  const handleEpisodeChange = useCallback((episodeNo: number) => {
    setCurrentEpisodeNo(episodeNo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goPrev = () => {
    const currentIdx = episodes.findIndex((ep) => ep.episode_no === currentEpisodeNo);
    if (currentIdx > 0) {
      handleEpisodeChange(episodes[currentIdx - 1].episode_no);
    }
  };

  const goNext = () => {
    const currentIdx = episodes.findIndex((ep) => ep.episode_no === currentEpisodeNo);
    if (currentIdx < episodes.length - 1) {
      handleEpisodeChange(episodes[currentIdx + 1].episode_no);
    }
  };

  const playNextEpisode = useCallback(
    (nextEpId: string) => {
      const match = nextEpId.match(/ep=(\d+)/);
      if (match) {
        handleEpisodeChange(parseInt(match[1]));
      }
    },
    [handleEpisodeChange]
  );

  // Server handlers
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

  // Extract stream data for player
  const streamUrl = streamingData?.streamingLink?.link?.file;
  const allTracks = streamingData?.streamingLink?.tracks || [];
  // Separate caption tracks from thumbnail tracks
  const subtitles = allTracks.filter((t: any) => t.kind === "captions" || t.kind === "subtitles");
  const thumbnailTrack = allTracks.find((t: any) => t.kind === "thumbnails");
  const intro = streamingData?.streamingLink?.intro;
  const outro = streamingData?.streamingLink?.outro;
  const thumbnail = thumbnailTrack?.file || streamingData?.streamingLink?.thumbnail;

  const currentIdx = episodes.findIndex((ep) => ep.episode_no === currentEpisodeNo);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < episodes.length - 1;

  return (
    <div className={`min-h-screen overflow-x-hidden ${lightMode ? "bg-white" : "bg-background"}`}>
      {/* Header */}
      <div className="bg-[#191826] border-b border-border/30">
        <div className="max-w-full px-2 sm:px-4 py-3">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <Link to={`/anime/${id}`}>
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </Button>
            {anime?.title && (
              <h1 className="text-xs sm:text-sm text-muted-foreground truncate min-w-0">
                {anime.title} - Episode {currentEpisodeNo}
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full px-2 sm:px-4 py-2 sm:py-4">
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_280px] gap-2 sm:gap-4">
          {/* Left Sidebar - Episode List */}
          <div className="hidden xl:block">
            <div className="sticky top-4 h-[calc(100vh-120px)] rounded-lg overflow-hidden">
              {loadingEpisodes ? (
                <div className="bg-[#191826] h-full flex items-center justify-center">
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
          <div className="space-y-2 sm:space-y-4 min-w-0 overflow-hidden">
            {/* Video Player */}
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden max-w-full">
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
                  <p className="text-center mb-4">
                    {loadingEpisodes
                      ? "Loading..."
                      : servers.length === 0
                      ? "Loading servers..."
                      : "No stream available. Try another server."}
                  </p>
                  {servers.length > 0 && (
                    <p className="text-sm text-center">
                      Current: {currentServer} ({currentType})
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Watch Controls */}
            <WatchControls
              autoPlay={autoPlay}
              setAutoPlay={setAutoPlay}
              autoNext={autoNext}
              setAutoNext={setAutoNext}
              autoSkip={autoSkip}
              setAutoSkip={setAutoSkip}
              lightMode={lightMode}
              setLightMode={setLightMode}
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
              streamUrl={streamUrl}
              subtitles={allTracks}
              streamHeaders={{
                referer: streamingData?.streamingLink?.iframe
                  ? new URL(streamingData.streamingLink.iframe).origin + "/"
                  : window.location.origin + "/",
              }}
              animeTitle={anime?.title}
              episodeNumber={currentEpisodeNo}
            />

            {/* Mobile Episode List */}
            <div className="xl:hidden">
              <div className="bg-[#191826] rounded-lg overflow-hidden">
                <div className="px-3 sm:px-4 py-3 border-b border-border/30">
                  <h3 className="font-semibold text-sm sm:text-base">
                    Episodes {totalEpisodes ? `(${totalEpisodes})` : ""}
                  </h3>
                </div>
                <div className="p-2 sm:p-4 max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2">
                    {episodes.map((ep) => {
                      const isActive = ep.episode_no === currentEpisodeNo;
                      return (
                        <button
                          key={ep.id || ep.episode_no}
                          onClick={() => handleEpisodeChange(ep.episode_no)}
                          className={`aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-secondary/50 hover:bg-secondary text-foreground"
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

            {/* Anime Info Section */}
            <AnimeInfoSection
              anime={anime}
              seasons={seasons}
              currentAnimeId={id}
            />
          </div>

          {/* Right Sidebar - Related Anime */}
          <div className="hidden xl:block">
            <div className="sticky top-4">
              {loadingAnime ? (
                <div className="bg-[#191826] rounded-lg p-4 space-y-4">
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
