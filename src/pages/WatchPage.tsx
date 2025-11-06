import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoPlayer from "@/components/VideoPlayer";
import { getEpisodes, getStreamingInfo, getAnimeDetails } from "@/services/animeApi";
import type { Episode, Server, StreamLink, AnimeDetails as AnimeDetailsType } from "@/types/anime";

const slugifyServer = (name?: string) =>
  (name || "").toString().trim().toLowerCase().replace(/\s+/g, "-");

const WatchPage = () => {
  const { id } = useParams<{ id: string }>();

  const [anime, setAnime] = useState<AnimeDetailsType | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [currentType, setCurrentType] = useState<'sub' | 'dub'>("sub");
  const [servers, setServers] = useState<Server[]>([]);
  const [currentServer, setCurrentServer] = useState<string>("hd-1");

  const [streamingLinks, setStreamingLinks] = useState<StreamLink[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(true);
  const [loadingStream, setLoadingStream] = useState<boolean>(false);

  // Fetch anime details (for title and poster)
  useEffect(() => {
    const run = async () => {
      if (!id) return;
      try {
        const details = await getAnimeDetails(id);
        setAnime(details.data);
      } catch (_) {}
    };
    run();
  }, [id]);

  // Fetch episodes for this anime
  useEffect(() => {
    const run = async () => {
      if (!id) return;
      try {
        setLoadingEpisodes(true);
        const data = await getEpisodes(id);
        setEpisodes(data.episodes || []);
        setTotalEpisodes(data.totalEpisodes || (data.episodes?.length ?? 0));
        setCurrentIndex(0);
      } catch (e) {
        console.error("Failed to load episodes", e);
      } finally {
        setLoadingEpisodes(false);
      }
    };
    run();
  }, [id]);

  const currentEpisode = episodes[currentIndex];

  const selectedStream: StreamLink | undefined = useMemo(() => {
    const linksArr = Array.isArray(streamingLinks) ? streamingLinks : [];
    if (linksArr.length === 0) return undefined;
    const m3u8 = linksArr.find((s) =>
      (s.link?.type || "").toLowerCase().includes("m3u8") || (s.link?.type || "").toLowerCase().includes("mpegurl")
    );
    return m3u8 || linksArr[0];
  }, [streamingLinks]);

  // Load streaming when episode/server/type changes
  useEffect(() => {
    const loadStream = async () => {
      if (!currentEpisode?.id) return;
      try {
        setLoadingStream(true);
        const info = await getStreamingInfo(currentEpisode.id, currentServer, currentType);
        // Set/merge servers once (or update if type changed)
        if (info.servers && info.servers.length > 0) {
          setServers(info.servers);
          // Ensure currentServer is valid for the current type
          const availableForType = info.servers.filter((s) => s.type === currentType);
          const names = availableForType.map((s) => slugifyServer(s.server_name || s.serverName));
          if (names.length > 0 && !names.includes(currentServer)) {
            setCurrentServer(names[0]);
          }
        }
        const links = info.streamingLink || [];
        setStreamingLinks(Array.isArray(links) ? links : []);
      } catch (e) {
        console.error("Failed to load streaming info", e);
        setStreamingLinks([]);
      } finally {
        setLoadingStream(false);
      }
    };
    loadStream();
  }, [currentEpisode?.id, currentServer, currentType]);

  const handleServerChange = (slug: string) => {
    setCurrentServer(slug);
  };

  const handleTypeChange = (type: 'sub' | 'dub') => {
    setCurrentType(type);
    // Try to switch to the first available server for this type if present
    const available = servers.filter((s) => s.type === type);
    if (available.length > 0) {
      setCurrentServer(slugifyServer(available[0].server_name || available[0].serverName));
    }
  };

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(episodes.length - 1, i + 1));

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to={`/anime/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Link>
          </Button>

          {anime?.title && (
            <h1 className="text-sm md:text-base text-muted-foreground line-clamp-1">{anime.title}</h1>
          )}
        </div>
      </div>

      {/* Video Player */}
      <div className="container px-4">
        <div className="space-y-3">
          <VideoPlayer
            streamingData={selectedStream}
            servers={servers}
            currentServer={currentServer}
            onServerChange={handleServerChange}
            currentType={currentType}
            onTypeChange={handleTypeChange}
          />

          {/* Quick Controls */}
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentIndex === 0} onClick={goPrev}>
                <SkipBack className="h-4 w-4 mr-1" /> Prev
              </Button>
              <Button variant="outline" size="sm" disabled={currentIndex >= episodes.length - 1} onClick={goNext}>
                Next <SkipForward className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {currentEpisode && (
              <Badge variant="secondary" className="text-xs">
                Episode {currentEpisode.episode_no}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Episode List */}
      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Placeholder for description or comments if needed */}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Episodes {totalEpisodes ? `(${totalEpisodes})` : ""}</h3>
            <div className="anime-card p-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-6 gap-2">
                {episodes.map((ep, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : "bg-secondary hover:bg-secondary/80 hover:scale-105"
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
      </div>
    </div>
  );
};

export default WatchPage;
