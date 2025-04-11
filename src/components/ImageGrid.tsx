
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import ImageLightBox from "./ImageLightBox";

export interface CompressedImageData {
  id: string;
  originalFile: File;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  previewUrl: string;
}

interface ImageGridProps {
  images: CompressedImageData[];
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};

const ImageGrid = ({ images }: ImageGridProps) => {
  const [selectedImage, setSelectedImage] = useState<CompressedImageData | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) return null;

  const calculateSavings = (original: number, compressed: number): string => {
    const savingsPercent = ((original - compressed) / original) * 100;
    return savingsPercent.toFixed(1) + "%";
  };

  const handleImageClick = (image: CompressedImageData) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Hình ảnh đã nén</h3>
      
      <div className="grid grid-cols-10 gap-4">
        {images.map((image) => (
          <Card 
            key={image.id} 
            className="overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
            onClick={() => handleImageClick(image)}
          >
            <div className="relative aspect-square">
              <img
                src={image.previewUrl}
                alt={`Đã nén ${image.originalFile.name}`}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-2 bg-muted/30 text-xs">
              <p className="font-medium truncate mb-1">{image.originalFile.name}</p>
              <p className="text-muted-foreground">
                {formatFileSize(image.originalSize)} → {formatFileSize(image.compressedSize)}
              </p>
              <p className="text-green-600 dark:text-green-400 font-medium">
                -{calculateSavings(image.originalSize, image.compressedSize)}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <ImageLightBox 
        image={selectedImage} 
        isOpen={lightboxOpen} 
        onClose={handleLightboxClose} 
      />
    </div>
  );
};

export default ImageGrid;
