
import React, { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1024 }, height: { ideal: 1024 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onImageSelect(dataUrl);
        stopCamera();
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {!previewUrl && !isCameraActive ? (
        <div className="w-full max-w-md flex flex-col gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square rounded-3xl border-4 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer glass hover:bg-white/10 transition-all group"
          >
            <div className="bg-white/10 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg">Upload from Device</span>
          </div>

          <button
            onClick={startCamera}
            className="w-full py-4 rounded-2xl glass hover:bg-white/10 text-white font-bold flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use Live Camera
          </button>
        </div>
      ) : isCameraActive ? (
        <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden glass shadow-2xl ring-4 ring-blue-400/30">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6">
            <button
              onClick={stopCamera}
              className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              className="bg-white text-navy-900 px-8 py-2 rounded-full font-black hover:scale-105 transition-all shadow-xl"
            >
              Capture Ego
            </button>
          </div>
        </div>
      ) : (
        <div className="relative group w-full max-w-md aspect-square rounded-3xl overflow-hidden glass shadow-2xl border-2 border-white/20">
          <img
            src={previewUrl!}
            alt="Original Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full font-bold hover:bg-white/30 transition-colors text-sm"
            >
              Swap File
            </button>
            <button
              onClick={startCamera}
              className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full font-bold hover:bg-white/30 transition-colors text-sm"
            >
              Use Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
