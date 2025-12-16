import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Episode } from "@/types/anime";

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisode: string;
  onEpisodeClick: (episodeNo: number) => void;
  totalEpisodes: number;
  hasSubbed?: boolean;
  hasDubbed?: boolean;
}

type FilterType = "all" | "sub" | "dub";

const EpisodeList = ({
  episodes,
  currentEpisode,
  onEpisodeClick,
  totalEpisodes,
  hasSubbed = true,
  hasDubbed = false,
}: EpisodeListProps) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchNum, setSearchNum] = useState("");
  const [selectedRange, setSelectedRange] = useState(0);

  // Create episode ranges (chunks of 100)
  const ranges = useMemo(() => {
    const rangeSize = 100;
    const totalRanges = Math.ceil(totalEpisodes / rangeSize);
    return Array.from({ length: totalRanges }, (_, i) => ({
      start: i * rangeSize + 1,
      end: Math.min((i + 1) * rangeSize, totalEpisodes),
    }));
  }, [totalEpisodes]);

  // Filter episodes by current range
  const filteredEpisodes = useMemo(() => {
    if (ranges.length === 0) return episodes;
    const range = ranges[selectedRange];
    if (!range) return episodes;
    return episodes.filter(
      (ep) => ep.episode_no >= range.start && ep.episode_no <= range.end
    );
  }, [episodes, ranges, selectedRange]);

  // Search for specific episode
  const handleSearch = () => {
    const num = parseInt(searchNum);
    if (num && num > 0 && num <= totalEpisodes) {
      onEpisodeClick(num);
      setSearchNum("");
    }
  };

  const filterLabels: Record<FilterType, string> = {
    all: "Sub & Dub",
    sub: "Only Sub",
    dub: "Only Dub",
  };

  return (
    <div className="flex flex-col h-full bg-[#191826]">
      {/* Filters Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border/30">
        {/* Sub/Dub Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-secondary/50 border-border/30 text-xs"
            >
              {filterLabels[filter]}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter("all")}>
              Sub & Dub
            </DropdownMenuItem>
            {hasSubbed && (
              <DropdownMenuItem onClick={() => setFilter("sub")}>
                Only Sub
              </DropdownMenuItem>
            )}
            {hasDubbed && (
              <DropdownMenuItem onClick={() => setFilter("dub")}>
                Only Dub
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Episode Range Selector */}
        {ranges.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-secondary/50 border-border/30 text-xs"
              >
                {ranges[selectedRange]
                  ? `${String(ranges[selectedRange].start).padStart(3, "0")}-${String(ranges[selectedRange].end).padStart(3, "0")}`
                  : "001-100"}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ranges.map((range, idx) => (
                <DropdownMenuItem
                  key={idx}
                  onClick={() => setSelectedRange(idx)}
                >
                  {String(range.start).padStart(3, "0")}-
                  {String(range.end).padStart(3, "0")}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Find Number */}
        <div className="flex items-center gap-1 ml-auto">
          <Input
            type="number"
            placeholder="Find"
            value={searchNum}
            onChange={(e) => setSearchNum(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-8 w-16 bg-secondary/50 border-border/30 text-xs"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 bg-secondary/50 border-border/30"
            onClick={handleSearch}
          >
            <Search className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Episode List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredEpisodes.map((ep) => {
            const isActive = String(ep.episode_no) === currentEpisode;
            return (
              <button
                key={ep.id}
                onClick={() => onEpisodeClick(ep.episode_no)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all mb-1 ${
                  isActive
                    ? "bg-primary/20 text-primary border-l-2 border-primary"
                    : "hover:bg-secondary/50 text-foreground/80 hover:text-foreground"
                }`}
              >
                <span
                  className={`text-sm font-medium min-w-[24px] ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {ep.episode_no}
                </span>
                <span className="text-sm truncate">
                  {ep.title || `Episode ${ep.episode_no}`}
                </span>
                {isActive && (
                  <span className="ml-auto text-primary">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EpisodeList;
