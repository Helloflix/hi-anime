import { Captions, Mic, Download, Monitor, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Server } from "@/types/anime";
import { M3U8_PROXY_URL } from "@/config/api";

interface ServerSelectorProps {
  servers: Server[];
  activeServerId: string;
  onServerChange: (serverId: string, type: "sub" | "dub") => void;
  currentType: "sub" | "dub";
  onTypeChange: (type: "sub" | "dub") => void;
  loading?: boolean;
  streamUrl?: string;
  subtitles?: Array<{ file: string; label: string; kind: string }>;
  streamHeaders?: Record<string, string>;
}

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
}: ServerSelectorProps) => {
  const subServers = servers.filter((s) => s.type === "sub");
  const dubServers = servers.filter((s) => s.type === "dub");

  const slugifyServer = (name?: string) =>
    (name || "").toString().trim().toLowerCase().replace(/\s+/g, "-");

  const handleDownloadVideo = () => {
    if (!streamUrl) return;
    const m3u8proxy = M3U8_PROXY_URL.split(",");
    const headers = streamHeaders || {};
    const proxyUrl =
      m3u8proxy[0] +
      encodeURIComponent(streamUrl) +
      "&headers=" +
      encodeURIComponent(JSON.stringify(headers));
    window.open(proxyUrl, "_blank");
  };

  const handleDownloadSubtitle = async (sub: { file: string; label: string }) => {
    try {
      const res = await fetch(sub.file);
      if (!res.ok) throw new Error("Failed to fetch subtitle");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sub.label || "subtitle"}.vtt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(sub.file, "_blank");
    }
  };

  const renderServerButtons = (
    serverList: Server[],
    type: "sub" | "dub",
    label: string,
    icon: React.ReactNode,
    variant: "sub" | "hsub" | "dub" | "adub"
  ) => {
    if (serverList.length === 0) return null;

    const variantStyles = {
      sub: "bg-primary/20 text-primary border-primary/30",
      hsub: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      dub: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      adub: "bg-purple-500/20 text-purple-400 border-purple-500/30",
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
                disabled={loading}
                className={`h-8 text-xs ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 hover:bg-secondary border-border/30"
                }`}
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

  const captionSubs = subtitles.filter(
    (t) => t.kind === "captions" || t.kind === "subtitles"
  );

  return (
    <div className="bg-[#11101A] rounded-lg p-4 space-y-4">
      <div className="text-center text-sm text-muted-foreground mb-4">
        You're watching <span className="text-primary font-semibold">Episode</span>.
        <br />
        If current servers doesn't work, please try other servers beside.
      </div>

      <div className="space-y-3">
        {renderServerButtons(
          subServers,
          "sub",
          "SUB",
          <Captions className="h-4 w-4" />,
          "sub"
        )}
        {renderServerButtons(
          dubServers,
          "dub",
          "DUB",
          <Mic className="h-4 w-4" />,
          "dub"
        )}
      </div>

      {/* Download Section */}
      {(streamUrl || captionSubs.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/20">
          {streamUrl && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 hover:text-green-300"
              onClick={handleDownloadVideo}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download Video
            </Button>
          )}
          {captionSubs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 hover:text-blue-300"
              onClick={() => {
                const englishSub =
                  captionSubs.find((s) => s.label?.toLowerCase() === "english") ||
                  captionSubs[0];
                if (englishSub) handleDownloadSubtitle(englishSub);
              }}
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Download Subtitle
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ServerSelector;
