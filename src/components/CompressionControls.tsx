
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CompressionControlsProps {
  onCompress: (quality: number) => void;
  onDownload: () => void;
  onDelete: () => void;
  hasImages: boolean;
  isProcessing: boolean;
  isComplete: boolean;
  onQualityChange?: (quality: number) => void;
}

const CompressionControls = ({
  onCompress,
  onDownload,
  onDelete,
  hasImages,
  isProcessing,
  isComplete,
  onQualityChange,
}: CompressionControlsProps) => {
  const [quality, setQuality] = useState(80);
  const { toast } = useToast();

  const handleQualityChange = (value: number[]) => {
    const newQuality = value[0];
    setQuality(newQuality);
    if (onQualityChange) {
      onQualityChange(newQuality);
    }
  };

  const handleCompress = () => {
    if (!hasImages) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image first.",
        variant: "destructive",
      });
      return;
    }
    onCompress(quality);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Compression Ratio</label>
          <span className="text-sm font-medium">{quality}%</span>
        </div>
        <Slider
          value={[quality]}
          min={1}
          max={100}
          step={1}
          onValueChange={handleQualityChange}
          className="py-2"
          disabled={isProcessing}
        />
        <p className="text-xs text-muted-foreground">
          Higher values preserve more quality but result in larger file sizes
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={handleCompress}
          disabled={!hasImages || isProcessing || isComplete}
          className="flex-1"
        >
          <Play className="mr-2 h-4 w-4" />
          Start Compression
        </Button>
        
        <Button
          onClick={onDownload}
          disabled={!isComplete}
          variant="outline"
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Download ZIP
        </Button>

        <Button
          onClick={onDelete}
          disabled={(!hasImages && !isComplete) || isProcessing}
          variant="destructive"
          className="flex-1"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default CompressionControls;
