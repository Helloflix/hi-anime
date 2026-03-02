import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Eye, ThumbsUp, ThumbsDown, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

  // Extract HLS playlist URL from video details
  const getHlsUrl = (): string | null => {
    if (!video) return null;
    if (video.streamingPlaylists && video.streamingPlaylists.length > 0) {
      return video.streamingPlaylists[0].playlistUrl;
    }
    // Fallback to direct file URL
    if (video.files && video.files.length > 0) {
      const videoFile = video.files.find((f: any) => f.hasVideo);
      if (videoFile) return videoFile.fileUrl;
    }
    return null;
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

  const hlsUrl = getHlsUrl();

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

      {/* Video Player */}
      <div className="w-full bg-black">
        <div className="container px-0 md:px-4">
          {hlsUrl ? (
            <PeerTubePlayer
              hlsUrl={hlsUrl}
              poster={video.previewPath}
              title={video.name}
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center text-muted-foreground">
              <p>No playable stream found for this video.</p>
            </div>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="container px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
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

          {video.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {video.description}
              </p>
            </div>
          )}

          {video.streamingPlaylists && video.streamingPlaylists.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Available Quality</h2>
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
