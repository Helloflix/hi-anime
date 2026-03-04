import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Eye, ThumbsUp, ThumbsDown, Calendar, Clock, Tag, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getVideoDetails, getThumbnailUrl, formatDuration, type PeerTubeVideo } from "@/services/peertubeApi";
import PeerTubePlayer from "@/components/PeerTubePlayer";

const PeerTubeWatch = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [video, setVideo] = useState<PeerTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!uuid) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getVideoDetails(uuid);
        setVideo(data);
      } catch (err: any) {
        console.error("Failed to fetch video:", err);
        setError(err.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [uuid]);

  const getHlsUrl = (): string | null => {
    if (!video) return null;
    if (video.streamingPlaylists && video.streamingPlaylists.length > 0) {
      return video.streamingPlaylists[0].playlistUrl;
    }
    if (video.files && video.files.length > 0) {
      const videoFile = video.files.find((f: any) => f.hasVideo);
      if (videoFile) return videoFile.fileUrl;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-destructive font-medium">{error || "Video not found"}</p>
        <Button variant="outline" size="sm" asChild>
          <Link to="/az-list">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Link>
        </Button>
      </div>
    );
  }

  const hlsUrl = getHlsUrl();

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="glass-panel border-b border-border/10">
        <div className="container max-w-7xl px-4 py-2.5 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link to="/az-list">
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </Link>
          </Button>
          <span className="text-xs text-muted-foreground truncate">{video.name}</span>
        </div>
      </div>

      {/* Player */}
      <div className="w-full bg-black/50">
        <div className="container max-w-7xl px-0 md:px-4 py-0 md:py-4">
          {hlsUrl ? (
            <PeerTubePlayer hlsUrl={hlsUrl} poster={video.previewPath} title={video.name} />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center text-muted-foreground glass-panel rounded-lg">
              <div className="text-center space-y-2">
                <Tv className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="text-sm">No playable stream found</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="container max-w-7xl px-4 py-6">
        <div className="max-w-4xl space-y-5">
          <div className="space-y-3">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{video.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{video.views?.toLocaleString() || 0} views</span>
              <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" />{video.likes || 0}</span>
              <span className="flex items-center gap-1"><ThumbsDown className="h-3.5 w-3.5" />{video.dislikes || 0}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDuration(video.duration)}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(video.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="h-px bg-border/30" />

          {video.channel && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                {video.channel.displayName?.[0]?.toUpperCase() || "C"}
              </div>
              <div>
                <p className="text-sm font-semibold">{video.channel.displayName}</p>
                <p className="text-[10px] text-muted-foreground">@{video.channel.name}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {video.category?.label && <Badge className="text-[10px]">{video.category.label}</Badge>}
            {video.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                <Tag className="h-2.5 w-2.5 mr-0.5" />
                {tag}
              </Badge>
            ))}
            {video.language?.label && <Badge variant="outline" className="text-[10px]">{video.language.label}</Badge>}
          </div>

          {video.description && (
            <>
              <div className="h-px bg-border/30" />
              <div className="glass-panel rounded-lg p-4">
                <h2 className="text-sm font-semibold mb-2">Description</h2>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {video.description}
                </p>
              </div>
            </>
          )}

          {video.streamingPlaylists && video.streamingPlaylists.length > 0 && video.streamingPlaylists[0]?.files?.length > 0 && (
            <div className="glass-panel rounded-lg p-4">
              <h2 className="text-sm font-semibold mb-2">Available Quality</h2>
              <div className="flex flex-wrap gap-1.5">
                {video.streamingPlaylists[0].files.map((file: any, i: number) => (
                  <Badge key={i} variant="outline" className="text-[10px]">
                    {file.resolution?.label || `Stream ${i + 1}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerTubeWatch;
