
import { Progress } from "@/components/ui/progress";
import { formatDuration } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentProgress: number;
  isProcessing: boolean;
  remainingTime: number | null;
}

const ProgressIndicator = ({ 
  currentProgress, 
  isProcessing,
  remainingTime 
}: ProgressIndicatorProps) => {
  if (!isProcessing) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Compressing Images</h3>
        <p className="text-sm font-medium">{Math.round(currentProgress)}%</p>
      </div>
      
      <Progress value={currentProgress} className="h-2" />
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <p>Processing...</p>
        {remainingTime !== null && (
          <p>Est. time remaining: {formatDuration(remainingTime)}</p>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;
