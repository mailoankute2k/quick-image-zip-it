
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Download, Trash2, Percent } from 'lucide-react';
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
        title: "Không có hình ảnh nào",
        description: "Vui lòng tải lên ít nhất một hình ảnh trước.",
        variant: "destructive",
      });
      return;
    }
    onCompress(quality);
  };

  const handleQuickQuality = (value: number) => {
    setQuality(value);
    if (onQualityChange) {
      onQualityChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Tỉ lệ nén</label>
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
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickQuality(80)}
            disabled={isProcessing}
            className="flex-1"
          >
            <Percent className="h-3 w-3 mr-1" /> 80%
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickQuality(50)}
            disabled={isProcessing}
            className="flex-1"
          >
            <Percent className="h-3 w-3 mr-1" /> 50%
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickQuality(30)}
            disabled={isProcessing}
            className="flex-1"
          >
            <Percent className="h-3 w-3 mr-1" /> 30%
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Giá trị cao hơn giữ lại nhiều chất lượng nhưng kích thước tệp sẽ lớn hơn
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={handleCompress}
          disabled={!hasImages || isProcessing}
          className="flex-1"
        >
          <Play className="mr-2 h-4 w-4" />
          Bắt đầu nén
        </Button>
        
        <Button
          onClick={onDownload}
          disabled={!isComplete}
          variant="outline"
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Tải xuống ZIP
        </Button>

        <Button
          onClick={onDelete}
          disabled={(!hasImages && !isComplete) || isProcessing}
          variant="destructive"
          className="flex-1"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa tất cả
        </Button>
      </div>
    </div>
  );
};

export default CompressionControls;
