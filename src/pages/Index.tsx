
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
    setCanCompress(true);
    toast({
      title: "Đã thêm hình ảnh",
      description: `${files.length} hình ảnh đã được thêm thành công.`,
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
          const overallProgress = ((currentImageIndex / totalImages) * 100) + (imageProgress / totalImages);
          setProgress(overallProgress);
        });
        
        compressedResults.push(result);
        setProgress(((i + 1) / totalImages) * 100);
      }
      
      setCompressedImages(compressedResults);
      setCanCompress(false);
      
      toast({
        title: "Nén hoàn tất",
        description: `Đã nén thành công ${totalImages} hình ảnh.`,
      });
    } catch (error) {
      console.error("Error during compression:", error);
      toast({
        title: "Nén thất bại",
        description: "Đã xảy ra lỗi khi nén hình ảnh của bạn.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setStartTime(null);
      setRemainingTime(null);
    }
  };
  
  const handleQualityChange = () => {
    setCanCompress(true);
  };
  
  const handleDownload = async () => {
    if (compressedImages.length === 0) return;
    
    try {
      const zipBlob = await createZipFile(compressedImages);
      downloadZip(zipBlob);
      
      toast({
        title: "Bắt đầu tải xuống",
        description: "Hình ảnh đã nén của bạn đã được đóng gói thành tệp ZIP.",
      });
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      toast({
        title: "Tải xuống thất bại",
        description: "Đã xảy ra lỗi khi tạo tệp ZIP.",
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
      title: "Đã xóa",
      description: "Tất cả hình ảnh đã được xóa.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Công Cụ Nén Hình Ảnh
        </h1>
        <p className="text-muted-foreground mt-2">
          Nén nhiều hình ảnh nhanh chóng với chất lượng có thể điều chỉnh
        </p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="compression-card">
          <CardHeader className="pb-2">
            <CardTitle>Tải lên hình ảnh</CardTitle>
            <CardDescription>
              Chọn hình ảnh để nén hoặc kéo và thả chúng vào bên dưới
            </CardDescription>
          </CardHeader>
          <CardContent className="card-content">
            <ImageUploader 
              onImagesSelected={handleImagesSelected}
              isProcessing={isProcessing}
            />
            
            {originalFiles.length > 0 && (
              <p className="text-sm mt-4">
                Đã chọn {originalFiles.length} hình ảnh
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="compression-card">
          <CardHeader className="pb-2">
            <CardTitle>Điều khiển nén</CardTitle>
            <CardDescription>
              Điều chỉnh cài đặt và bắt đầu nén
            </CardDescription>
          </CardHeader>
          <CardContent className="card-content">
            <CompressionControls
              onCompress={handleCompressionStart}
              onDownload={handleDownload}
              onDelete={handleDelete}
              hasImages={originalFiles.length > 0}
              isProcessing={isProcessing}
              isComplete={compressedImages.length > 0}
              onQualityChange={handleQualityChange}
            />
            
            {isProcessing && (
              <div className="mt-4">
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
              <CardTitle>Kết quả</CardTitle>
              <CardDescription>
                {compressedImages.length} hình ảnh đã được nén
              </CardDescription>
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center text-sm text-primary hover:underline"
            >
              <Download className="h-4 w-4 mr-1" />
              Tải xuống tất cả
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
