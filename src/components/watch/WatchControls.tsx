import {
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WatchControlsProps {
  autoPlay: boolean;
  setAutoPlay: (value: boolean) => void;
  autoNext: boolean;
  setAutoNext: (value: boolean) => void;
  autoSkip: boolean;
  setAutoSkip: (value: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const WatchControls = ({
  autoPlay,
  setAutoPlay,
  autoNext,
  setAutoNext,
  autoSkip,
  setAutoSkip,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: WatchControlsProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 glass-panel rounded-xl px-4 py-3">
      {/* Left Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Switch id="auto-play" checked={autoPlay} onCheckedChange={setAutoPlay} className="scale-75" />
          <Label htmlFor="auto-play" className="text-xs text-muted-foreground cursor-pointer">
            Auto Play
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="auto-next" checked={autoNext} onCheckedChange={setAutoNext} className="scale-75" />
          <Label htmlFor="auto-next" className="text-xs text-muted-foreground cursor-pointer">
            Auto Next
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="auto-skip"
            checked={autoSkip}
            onCheckedChange={setAutoSkip}
            className="scale-75 data-[state=checked]:bg-primary"
          />
          <Label
            htmlFor="auto-skip"
            className={`text-xs cursor-pointer ${autoSkip ? "text-primary" : "text-muted-foreground"}`}
          >
            Auto Skip
          </Label>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrev}
          disabled={!hasPrev}
          className="h-8 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          disabled={!hasNext}
          className="h-8 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default WatchControls;
