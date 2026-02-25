import { useState, type ReactNode } from "react";
import { Captions, Mic, Download, Monitor, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Server } from "@/types/anime";
import { PROXY_URL } from "@/config/api";
import { downloadM3u8AsTs } from "@/services/m3u8Downloader";

interface SubtitleTrack {
  file: string;
  label: string;
  kind: string;
}

interface ServerSelectorProps {
  servers: Server[];
  activeServerId: string;
  onServerChange: (serverId: string, type: "sub" | "dub") => void;
  currentType: "sub" | "dub";
  onTypeChange: (type: "sub" | "dub") => void;
  loading?: boolean;
  streamUrl?: string;
  subtitles?: SubtitleTrack[];
  streamHeaders?: Record<string, string>;
  animeTitle?: string;
  episodeNumber?: number;
}

const slugifyServer = (name?: string) =>
  (name || "").toString().trim().toLowerCase().replace(/\s+/g, "-");

const ServerSelector = ({
  servers,
  activeServerId,
  onServerChange,
  currentType,
  onTypeChange,
  loading = false,
  streamUrl,
  subtitles = [],
  streamHeaders,
  animeTitle,
  episodeNumber,
}: ServerSelectorProps) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const subServers = servers.filter((s) => s.type === "sub");
  const dubServers = servers.filter((s) => s.type === "dub");

  const captionSubs = subtitles.filter(
    (track) => track.kind === "captions" || track.kind === "subtitles"
  );

  const downloadSubtitle = async (subtitle: SubtitleTrack, filenameBase: string) => {
    const subtitleUrls = [subtitle.file, `${PROXY_URL}${encodeURIComponent(subtitle.file)}`];

    for (const url of subtitleUrls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;

        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${filenameBase}.vtt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        return;
      } catch {
        // try next URL
      }
    }
  };

  const handleVideoDownload = async () => {
    if (!streamUrl || isDownloading) return;

    const cleanTitle = (animeTitle || "anime").replace(/\s+/g, "-");
    const filenameBase = `${cleanTitle}-ep-${episodeNumber || "1"}`;

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStatus("Preparing download...");

    try {
      await downloadM3u8AsTs({
        streamUrl,
        headers: streamHeaders,
        filename: filenameBase,
        onProgress: (progress, status) => {
          setDownloadProgress(progress);
          setDownloadStatus(status);
        },
      });

      const englishSubtitle =
        captionSubs.find((sub) => sub.label?.toLowerCase() === "english") || captionSubs[0];
      if (englishSubtitle) {
        await downloadSubtitle(englishSubtitle, filenameBase);
      }

      setDownloadStatus("Video downloaded (.ts) with subtitle (.vtt)");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Download failed. Please try another streaming server.";
      setDownloadStatus(message);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderServerButtons = (
    serverList: Server[],
    type: "sub" | "dub",
    label: string,
    icon: ReactNode,
    variant: "sub" | "hsub" | "dub" | "adub"
  ) => {
    if (serverList.length === 0) return null;

    const variantStyles = {
      sub: "bg-primary/20 text-primary border-primary/30",
      hsub: "bg-secondary text-secondary-foreground border-border",
      dub: "bg-accent text-accent-foreground border-border",
      adub: "bg-muted text-muted-foreground border-border",
    };

    return (
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${variantStyles[variant]}`}
        >
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {serverList.map((server) => {
            const serverId = slugifyServer(server.server_name || server.serverName);
            const isActive = activeServerId === serverId && currentType === type;
            return (
              <Button
                key={server.data_id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onTypeChange(type);
                  onServerChange(serverId, type);
                }}
                disabled={loading || isDownloading}
                className="h-8 text-xs"
              >
                <Monitor className="h-3 w-3 mr-1.5" />
                {server.server_name || server.serverName || `Server ${server.server_id}`}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg p-4 space-y-4 border border-border/50">
      <div className="text-center text-sm text-muted-foreground mb-4">
        You're watching <span className="text-primary font-semibold">Episode {episodeNumber}</span>.
        <br />
        If current server doesn't work, please try another one.
      </div>

      <div className="space-y-3">
        {renderServerButtons(subServers, "sub", "SUB", <Captions className="h-4 w-4" />, "sub")}
        {renderServerButtons(dubServers, "dub", "DUB", <Mic className="h-4 w-4" />, "dub")}
      </div>

      {streamUrl && (
        <div className="pt-2 border-t border-border/30 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="default"
              size="sm"
              onClick={handleVideoDownload}
              disabled={isDownloading}
              className="h-8 text-xs"
            >
              {isDownloading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}
              {isDownloading ? `Downloading ${downloadProgress}%` : "Download Video"}
            </Button>

            {captionSubs.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  const englishSubtitle =
                    captionSubs.find((sub) => sub.label?.toLowerCase() === "english") || captionSubs[0];
                  if (!englishSubtitle) return;
                  const cleanTitle = (animeTitle || "anime").replace(/\s+/g, "-");
                  const filenameBase = `${cleanTitle}-ep-${episodeNumber || "1"}`;
                  void downloadSubtitle(englishSubtitle, filenameBase);
                }}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Download Subtitle
              </Button>
            )}
          </div>

          {downloadStatus && <p className="text-xs text-muted-foreground">{downloadStatus}</p>}
          <p className="text-xs text-muted-foreground/80">
            Downloads as <span className="font-medium">.ts</span> (video) + <span className="font-medium">.vtt</span> (subtitle).
          </p>
        </div>
      )}
    </div>
  );
};

export default ServerSelector;
