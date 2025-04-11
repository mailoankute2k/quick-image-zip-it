
import React from "react";
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
      <h3 className="text-lg font-semibold">Hình ảnh đã nén</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden flex flex-col">
            <div className="relative aspect-square">
              <img
                src={image.previewUrl}
                alt={`Đã nén ${image.originalFile.name}`}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-3 bg-muted/30 text-sm">
              <p className="font-medium truncate mb-1">{image.originalFile.name}</p>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-1">Kích thước gốc:</TableCell>
                    <TableCell className="py-1 text-right">{formatFileSize(image.originalSize)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1">Sau khi nén:</TableCell>
                    <TableCell className="py-1 text-right">{formatFileSize(image.compressedSize)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1">Đã giảm:</TableCell>
                    <TableCell className="py-1 text-right font-medium text-green-600 dark:text-green-400">
                      {calculateSavings(image.originalSize, image.compressedSize)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
