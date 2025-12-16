import { useState } from "react";
import { Captions, Mic, Download, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Server } from "@/types/anime";

interface ServerSelectorProps {
  servers: Server[];
  activeServerId: string;
  onServerChange: (serverId: string, type: "sub" | "dub") => void;
  currentType: "sub" | "dub";
  onTypeChange: (type: "sub" | "dub") => void;
  loading?: boolean;
}

const ServerSelector = ({
  servers,
  activeServerId,
  onServerChange,
  currentType,
  onTypeChange,
  loading = false,
}: ServerSelectorProps) => {
  const subServers = servers.filter((s) => s.type === "sub");
  const dubServers = servers.filter((s) => s.type === "dub");

  const slugifyServer = (name?: string) =>
    (name || "").toString().trim().toLowerCase().replace(/\s+/g, "-");

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

  return (
    <div className="bg-[#11101A] rounded-lg p-4 space-y-4">
      <div className="text-center text-sm text-muted-foreground mb-4">
        You're watching <span className="text-primary font-semibold">Episode</span>.
        <br />
        If current servers doesn't work, please try other servers beside.
      </div>

      <div className="space-y-3">
        {/* SUB Servers */}
        {renderServerButtons(
          subServers,
          "sub",
          "SUB",
          <Captions className="h-4 w-4" />,
          "sub"
        )}

        {/* DUB Servers */}
        {renderServerButtons(
          dubServers,
          "dub",
          "DUB",
          <Mic className="h-4 w-4" />,
          "dub"
        )}
      </div>
    </div>
  );
};

export default ServerSelector;
