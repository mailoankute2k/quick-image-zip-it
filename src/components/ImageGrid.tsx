
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

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

const ImageGrid = ({ images }: ImageGridProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const calculateSavings = (original: number, compressed: number): string => {
    const savingsPercent = ((original - compressed) / original) * 100;
    return savingsPercent.toFixed(1) + "%";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Compressed Images</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-4">
        {images.map((image, index) => (
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <Card 
                className="aspect-square cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                onClick={() => setSelectedImageIndex(index)}
              >
                <div className="relative w-full h-full">
                  <img
                    src={image.previewUrl}
                    alt={`Compressed ${image.originalFile.name}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1">
                    <div className="truncate">{calculateSavings(image.originalSize, image.compressedSize)} saved</div>
                    <div className="truncate text-[10px]">{formatFileSize(image.originalSize)} → {formatFileSize(image.compressedSize)}</div>
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            
            <DialogContent className="max-w-3xl">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col h-full">
                  <h3 className="font-medium mb-2">{image.originalFile.name}</h3>
                  <div className="flex-grow bg-muted rounded-md overflow-hidden">
                    <img 
                      src={image.previewUrl} 
                      alt={`Compressed ${image.originalFile.name}`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead colSpan={2} className="text-center">Compression Report</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Original Size</TableCell>
                        <TableCell>{formatFileSize(image.originalSize)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Compressed Size</TableCell>
                        <TableCell>{formatFileSize(image.compressedSize)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Space Saved</TableCell>
                        <TableCell>
                          {formatFileSize(image.originalSize - image.compressedSize)} ({calculateSavings(image.originalSize, image.compressedSize)})
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">File Type</TableCell>
                        <TableCell>{image.originalFile.type}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
