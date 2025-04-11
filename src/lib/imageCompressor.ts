
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { generateUniqueId } from './utils';
import { CompressedImageData } from '@/components/ImageGrid';

export async function compressImage(
  file: File, 
  quality: number, 
  onProgress?: (progress: number) => void
): Promise<CompressedImageData> {
  const options = {
    maxSizeMB: 10,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    onProgress,
    initialQuality: quality / 100,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const previewUrl = URL.createObjectURL(compressedBlob);

    return {
      id: generateUniqueId(),
      originalFile: file,
      compressedBlob,
      originalSize: file.size,
      compressedSize: compressedBlob.size,
      previewUrl,
    };
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}

export async function createZipFile(images: CompressedImageData[]): Promise<Blob> {
  const zip = new JSZip();

  images.forEach((image) => {
    // Use the original filename but with a suffix to indicate it's compressed
    let filename = image.originalFile.name;
    const lastDotIndex = filename.lastIndexOf('.');
    
    if (lastDotIndex !== -1) {
      const name = filename.substring(0, lastDotIndex);
      const ext = filename.substring(lastDotIndex);
      filename = `${name}-compressed${ext}`;
    } else {
      filename = `${filename}-compressed`;
    }

    zip.file(filename, image.compressedBlob);
  });

  return zip.generateAsync({ type: 'blob' });
}

export function downloadZip(zipBlob: Blob, filename = 'compressed-images.zip'): void {
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function revokeObjectURLs(images: CompressedImageData[]): void {
  images.forEach(image => {
    URL.revokeObjectURL(image.previewUrl);
  });
}
