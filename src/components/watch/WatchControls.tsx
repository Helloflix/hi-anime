import {
  Play,
  SkipForward,
  SkipBack,
  Maximize,
  Sun,
  Plus,
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
  lightMode: boolean;
  setLightMode: (value: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  onExpand?: () => void;
  onAddToList?: () => void;
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
  lightMode,
  setLightMode,
  onPrev,
  onNext,
  onExpand,
  onAddToList,
  hasPrev,
  hasNext,
}: WatchControlsProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 bg-[#11101A] rounded-lg px-4 py-3">
      {/* Left Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Expand */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onExpand}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <Maximize className="h-4 w-4 mr-1.5" />
          Expand
        </Button>

        {/* Auto Play */}
        <div className="flex items-center gap-2">
          <Switch
            id="auto-play"
            checked={autoPlay}
            onCheckedChange={setAutoPlay}
            className="scale-75"
          />
          <Label
            htmlFor="auto-play"
            className="text-xs text-muted-foreground cursor-pointer"
          >
            Auto Play
          </Label>
        </div>

        {/* Auto Next */}
        <div className="flex items-center gap-2">
          <Switch
            id="auto-next"
            checked={autoNext}
            onCheckedChange={setAutoNext}
            className="scale-75"
          />
          <Label
            htmlFor="auto-next"
            className="text-xs text-muted-foreground cursor-pointer"
          >
            Auto Next
          </Label>
        </div>

        {/* Auto Skip */}
        <div className="flex items-center gap-2">
          <Switch
            id="auto-skip"
            checked={autoSkip}
            onCheckedChange={setAutoSkip}
            className="scale-75 data-[state=checked]:bg-primary"
          />
          <Label
            htmlFor="auto-skip"
            className={`text-xs cursor-pointer ${
              autoSkip ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Auto Skip
          </Label>
        </div>

        {/* Light Mode */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLightMode(!lightMode)}
          className={`h-8 text-xs ${
            lightMode ? "text-yellow-400" : "text-muted-foreground"
          } hover:text-foreground`}
        >
          <Sun className="h-4 w-4 mr-1.5" />
          Light
        </Button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Prev */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrev}
          disabled={!hasPrev}
          className="h-8 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>

        {/* Next */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          disabled={!hasNext}
          className="h-8 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        {/* Add to List */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddToList}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add to list
        </Button>
      </div>
    </div>
  );
};

export default WatchControls;
