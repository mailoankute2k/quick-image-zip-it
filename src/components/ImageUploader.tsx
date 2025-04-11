
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

const ImageUploader = ({ onImagesSelected, isProcessing }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFiles = (files: FileList) => {
    const imageFiles: File[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        imageFiles.push(file);
      }
    });
    
    if (imageFiles.length > 0) {
      onImagesSelected(imageFiles);
    }
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-6 transition-all
        ${dragActive ? "border-primary bg-primary/10" : "border-gray-300 dark:border-gray-700"}
        ${isProcessing ? "opacity-50 pointer-events-none" : ""}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <Upload className="h-10 w-10 text-primary mb-2" />
        <h3 className="text-lg font-semibold">Kéo hình ảnh vào đây</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          hoặc nhấp để chọn tệp
        </p>
        <Button 
          variant="outline" 
          onClick={handleClick}
          disabled={isProcessing}
          className="mt-2"
        >
          Chọn hình ảnh
        </Button>
      </div>
      
      {dragActive && (
        <div 
          className="absolute inset-0 bg-primary/5 rounded-lg flex items-center justify-center"
        >
          <div className="bg-background p-4 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Thả để tải lên
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
