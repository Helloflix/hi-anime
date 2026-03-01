import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Eye, ThumbsUp, ThumbsDown, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getVideoDetails, getThumbnailUrl, formatDuration, type PeerTubeVideo } from "@/services/peertubeApi";

const PROXY_BASE = `https://vqzdpbcftwvyerxwkhsj.supabase.co/functions/v1/peertube-proxy`;

const PeerTubeWatch = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [video, setVideo] = useState<PeerTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Build the PeerTube embed URL (goes directly to the PeerTube instance embed)
  // We need to proxy through our edge function to add the ngrok header
  const getEmbedSrc = () => {
    if (!uuid) return "";
    // The embed URL needs to go through the proxy to bypass ngrok
    const url = new URL(PROXY_BASE);
    url.searchParams.set("path", `/videos/embed/${uuid}`);
    return url.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive text-lg">{error || "Video not found"}</p>
        <Button asChild>
          <Link to="/az-list">Back to Videos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/az-list">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-sm text-muted-foreground truncate">{video.name}</h1>
          </div>
        </div>
      </div>

      {/* Video Player - PeerTube Embed */}
      <div className="w-full bg-black">
        <div className="container px-0 md:px-4">
          <div className="relative w-full aspect-video">
            <iframe
              ref={iframeRef}
              src={getEmbedSrc()}
              className="w-full h-full"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title={video.name}
            />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="container px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title & Stats */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{video.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{video.views?.toLocaleString() || 0} views</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{video.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsDown className="h-4 w-4" />
                <span>{video.dislikes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(video.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Channel */}
          {video.channel && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {video.channel.displayName?.[0]?.toUpperCase() || "C"}
              </div>
              <div>
                <p className="font-semibold">{video.channel.displayName}</p>
                <p className="text-xs text-muted-foreground">@{video.channel.name}</p>
              </div>
            </div>
          )}

          {/* Tags & Category */}
          <div className="flex flex-wrap gap-2">
            {video.category?.label && (
              <Badge variant="default">{video.category.label}</Badge>
            )}
            {video.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {video.language?.label && (
              <Badge variant="outline">{video.language.label}</Badge>
            )}
          </div>

          <Separator />

          {/* Description */}
          {video.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {video.description}
              </p>
            </div>
          )}

          {/* Streaming Info (for direct playback debugging) */}
          {(video.files && video.files.length > 0) && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Available Quality</h2>
              <div className="flex flex-wrap gap-2">
                {video.files.map((file: any, i: number) => (
                  <Badge key={i} variant="outline">
                    {file.resolution?.label || `File ${i + 1}`} — {file.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : ""}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {video.streamingPlaylists && video.streamingPlaylists.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">HLS Streams</h2>
              <div className="flex flex-wrap gap-2">
                {video.streamingPlaylists[0]?.files?.map((file: any, i: number) => (
                  <Badge key={i} variant="outline">
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
