
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import CompressionControls from "@/components/CompressionControls";
import ProgressIndicator from "@/components/ProgressIndicator";
import ImageGrid, { CompressedImageData } from "@/components/ImageGrid";
import { useToast } from "@/components/ui/use-toast";
import { compressImage, createZipFile, downloadZip, revokeObjectURLs } from "@/lib/imageCompressor";
import { Download } from "lucide-react";

const Index = () => {
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [canCompress, setCanCompress] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    let timer: number | undefined;
    
    if (isProcessing && startTime) {
      timer = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setElapsedTime(elapsed);
        
        if (progress > 0) {
          // Estimate remaining time based on elapsed time and progress
          const estimatedTotalTime = elapsed / (progress / 100);
          const remainingSeconds = estimatedTotalTime - elapsed;
          setRemainingTime(remainingSeconds > 0 ? remainingSeconds : 0);
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isProcessing, progress, startTime]);
  
  const handleImagesSelected = (files: File[]) => {
    setOriginalFiles((prevFiles) => [...prevFiles, ...files]);
    setCanCompress(true); // Ensure we can compress when new images are added
    toast({
      title: "Images added",
      description: `${files.length} image${files.length > 1 ? 's' : ''} added successfully.`,
    });
  };
  
  const handleCompressionStart = async (quality: number) => {
    if (originalFiles.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    setStartTime(Date.now());
    
    try {
      const totalImages = originalFiles.length;
      const compressedResults: CompressedImageData[] = [];
      
      for (let i = 0; i < totalImages; i++) {
        const file = originalFiles[i];
        const currentImageIndex = i;
        
        const result = await compressImage(file, quality, (imageProgress) => {
          // Calculate overall progress
          const overallProgress = ((currentImageIndex / totalImages) * 100) + (imageProgress / totalImages);
          setProgress(overallProgress);
        });
        
        compressedResults.push(result);
        setProgress(((i + 1) / totalImages) * 100);
      }
      
      setCompressedImages(compressedResults);
      setCanCompress(false); // Set to false after completion
      
      toast({
        title: "Compression complete",
        description: `Successfully compressed ${totalImages} image${totalImages > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error("Error during compression:", error);
      toast({
        title: "Compression failed",
        description: "An error occurred while compressing your images.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setStartTime(null);
      setRemainingTime(null);
    }
  };
  
  const handleQualityChange = () => {
    // Allow compression again when quality changes
    setCanCompress(true);
  };
  
  const handleDownload = async () => {
    if (compressedImages.length === 0) return;
    
    try {
      const zipBlob = await createZipFile(compressedImages);
      downloadZip(zipBlob);
      
      toast({
        title: "Download started",
        description: "Your compressed images have been packaged into a ZIP file.",
      });
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      toast({
        title: "Download failed",
        description: "An error occurred while creating the ZIP file.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = () => {
    if (compressedImages.length > 0) {
      revokeObjectURLs(compressedImages);
    }
    
    setOriginalFiles([]);
    setCompressedImages([]);
    setProgress(0);
    setCanCompress(true);
    
    toast({
      title: "Cleared",
      description: "All images have been removed.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Quick Image Zip It
        </h1>
        <p className="text-muted-foreground mt-2">
          Compress multiple images quickly with adjustable quality
        </p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
            <CardDescription>
              Select images to compress or drag and drop them below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader 
              onImagesSelected={handleImagesSelected}
              isProcessing={isProcessing}
            />
            
            {originalFiles.length > 0 && (
              <p className="text-sm mt-4">
                {originalFiles.length} image{originalFiles.length > 1 ? 's' : ''} selected
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Compression Controls</CardTitle>
            <CardDescription>
              Adjust settings and start compression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompressionControls
              onCompress={handleCompressionStart}
              onDownload={handleDownload}
              onDelete={handleDelete}
              hasImages={originalFiles.length > 0}
              isProcessing={isProcessing}
              isComplete={compressedImages.length > 0 && !canCompress}
              onQualityChange={handleQualityChange}
            />
            
            {isProcessing && (
              <div className="mt-6">
                <ProgressIndicator
                  currentProgress={progress}
                  isProcessing={isProcessing}
                  remainingTime={remainingTime}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {compressedImages.length > 0 && (
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                {compressedImages.length} compressed image{compressedImages.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center text-sm text-primary hover:underline"
            >
              <Download className="h-4 w-4 mr-1" />
              Download All
            </button>
          </CardHeader>
          <CardContent>
            <ImageGrid images={compressedImages} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
