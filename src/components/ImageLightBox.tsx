
import React from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { formatFileSize } from "@/components/ImageGrid";
import { CompressedImageData } from "@/components/ImageGrid";

interface ImageLightBoxProps {
  image: CompressedImageData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageLightBox = ({ image, isOpen, onClose }: ImageLightBoxProps) => {
  if (!image) return null;

  const calculateSavings = (original: number, compressed: number): string => {
    const savingsPercent = ((original - compressed) / original) * 100;
    return savingsPercent.toFixed(1) + "%";
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetOverlay className="bg-black/80" />
      <SheetContent
        side="bottom"
        className="h-[90vh] w-full max-w-none p-0 border-none"
      >
        <div className="flex flex-col h-full relative bg-background">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/40">
            <img
              src={image.previewUrl}
              alt={`Đã nén ${image.originalFile.name}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="p-4 bg-background">
            <h3 className="text-xl font-semibold mb-2 truncate">{image.originalFile.name}</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-sm text-muted-foreground">Kích thước gốc</p>
                <p className="text-lg font-medium">{formatFileSize(image.originalSize)}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-sm text-muted-foreground">Sau khi nén</p>
                <p className="text-lg font-medium">{formatFileSize(image.compressedSize)}</p>
              </div>
              <div className="p-3 bg-green-100/30 dark:bg-green-900/30 rounded-md">
                <p className="text-sm text-muted-foreground">Đã giảm</p>
                <p className="text-lg font-medium text-green-600 dark:text-green-400">
                  {calculateSavings(image.originalSize, image.compressedSize)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ImageLightBox;
