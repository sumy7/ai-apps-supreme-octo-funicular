import React, { useRef, useEffect, useState } from 'react';

interface SkeuomorphicCameraProps {
  onTakePhoto: (photoUrl: string) => void;
}

const FILTERS = [
  { name: 'Normal', value: 'none', color: '#e5e5e5' },
  { name: 'BW', value: 'grayscale(100%)', color: '#525252' },
  { name: 'Sepia', value: 'sepia(80%) contrast(110%)', color: '#d97706' },
  { name: 'Film', value: 'contrast(120%) saturate(130%) brightness(110%)', color: '#2563eb' },
  { name: 'Cool', value: 'hue-rotate(180deg) contrast(90%)', color: '#4f46e5' },
];

export const SkeuomorphicCamera: React.FC<SkeuomorphicCameraProps> = ({ onTakePhoto }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [error, setError] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [printingPhotoUrl, setPrintingPhotoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      if (isOpen) {
        setError('');
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (!mounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play().catch(e => console.error("Play error:", e));
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
          if (mounted) {
            let errorMessage = '无法访问摄像头';
            if (err instanceof DOMException) {
              if (err.name === 'NotAllowedError') {
                errorMessage = '请允许访问摄像头';
              } else if (err.name === 'NotFoundError') {
                errorMessage = '未找到摄像头设备';
              } else if (err.name === 'NotReadableError') {
                errorMessage = '摄像头被占用';
              }
            }
            setError(errorMessage);
          }
        }
      } else {
        stopCamera();
      }
    };

    initCamera();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [isOpen]);

  const handleTakePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOpen(true);
      return;
    }

    if (isPrinting) return;

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Apply filter
        context.filter = activeFilter.value;
        
        // Draw
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const photoUrl = canvas.toDataURL('image/png');
        
        // Start printing animation
        setPrintingPhotoUrl(photoUrl);
        setIsPrinting(true);

        // Flash effect
        const flash = document.getElementById('camera-flash');
        if (flash) {
          flash.style.opacity = '1';
          setTimeout(() => {
            flash.style.opacity = '0';
          }, 100);
        }

        // Finish printing after animation
        setTimeout(() => {
          onTakePhoto(photoUrl);
          setIsPrinting(false);
          setPrintingPhotoUrl(null);
        }, 2000);
      }
    }
  };

  const toggleCamera = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className={`
        relative transition-all duration-500 ease-in-out
        ${isOpen ? 'w-72 h-64' : 'w-48 h-40'}
      `}
    >
      {/* Printing Photo Animation */}
      {isPrinting && printingPhotoUrl && (
        <div className="absolute left-1/2 top-8 transform -translate-x-1/2 w-40 h-48 bg-white p-2 shadow-xl z-10 animate-eject">
          <div className="w-full h-32 bg-neutral-900 overflow-hidden mb-2">
            <img src={printingPhotoUrl} className="w-full h-full object-cover" alt="Printing" />
          </div>
        </div>
      )}

      {/* Camera Body */}
      <div 
        onClick={toggleCamera}
        className={`
          absolute inset-0 bg-neutral-800 rounded-3xl shadow-2xl cursor-pointer 
          border-b-8 border-r-8 border-neutral-900 z-20
          ${isOpen ? 'ring-4 ring-red-500/50' : 'hover:scale-105 active:scale-95'}
          transition-all duration-300
        `}
      >
        {/* Top accent stripe */}
        <div className="absolute top-6 left-0 w-full h-4 bg-rainbow-gradient opacity-80 z-10"></div>
        
        {/* Lens Assembly */}
        <div className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-neutral-700 rounded-full border-4 border-neutral-600 shadow-inner 
          flex items-center justify-center transition-all duration-500
          ${isOpen ? 'w-48 h-48' : 'w-24 h-24'}
          z-20
        `}>
          <div className={`
            bg-black rounded-full border-2 border-neutral-800 
            flex items-center justify-center overflow-hidden relative transition-all duration-500
            ${isOpen ? 'w-44 h-44' : 'w-20 h-20'}
          `}>
            {isOpen ? (
              <>
                {error ? (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center p-4 text-center">
                    <p className="text-red-500 text-xs font-bold">{error}</p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                    style={{ filter: activeFilter.value }}
                  />
                )}
                {/* Flash Overlay */}
                <div id="camera-flash" className="absolute inset-0 bg-white opacity-0 transition-opacity duration-100 pointer-events-none"></div>
              </>
            ) : (
              <>
                {/* Lens Reflection */}
                <div className="absolute top-3 right-4 w-4 h-3 bg-white opacity-20 rounded-full transform rotate-45"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400 opacity-30 rounded-full"></div>
                {/* Inner Lens */}
                <div className="w-12 h-12 bg-neutral-900 rounded-full border border-neutral-700 opacity-80"></div>
              </>
            )}
          </div>
        </div>

        {/* Flash Unit */}
        <div className={`
          absolute top-4 right-4 bg-neutral-300 rounded-sm border-2 border-neutral-400 overflow-hidden transition-all duration-300
          ${isOpen ? 'w-10 h-8' : 'w-8 h-6'}
        `}>
          <div className="w-full h-full bg-gradient-to-br from-white to-neutral-400 opacity-80"></div>
        </div>

        {/* Viewfinder Window (Decorative) */}
        <div className={`
          absolute top-4 left-4 bg-neutral-900 rounded-sm border border-neutral-600 opacity-80 transition-all duration-300
          ${isOpen ? 'w-8 h-8' : 'w-6 h-6'}
        `}></div>

        {/* Shutter Button */}
        <button
          onClick={handleTakePhoto}
          disabled={!!error}
          className={`
            absolute -top-3 right-12 rounded-t-lg border-b shadow-sm
            transition-all duration-300 
            ${isOpen ? 'w-12 h-6' : 'w-8 h-4'}
            ${error 
              ? 'bg-neutral-500 border-neutral-700 cursor-not-allowed' 
              : 'bg-red-600 border-red-800 hover:bg-red-500 active:translate-y-1 cursor-pointer'
            }
            z-0
          `}
          title={error || "Take Photo"}
        ></button>

        {/* Filter Controls (Only visible when open) */}
        <div className={`
          absolute bottom-3 left-0 w-full flex justify-center gap-2 transition-all duration-300
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          z-30
        `}>
          {FILTERS.map((filter) => (
            <button
              key={filter.name}
              onClick={(e) => {
                e.stopPropagation();
                setActiveFilter(filter);
              }}
              className={`
                w-6 h-6 rounded-full border-2 shadow-lg transition-transform hover:scale-125
                ${activeFilter.name === filter.name ? 'border-white scale-110 ring-2 ring-white/50' : 'border-neutral-600'}
              `}
              style={{ backgroundColor: filter.color }}
              title={filter.name}
            />
          ))}
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <style>{`
        .bg-rainbow-gradient {
          background: linear-gradient(to bottom, 
            #ff3b30 20%, 
            #ff9500 20% 40%, 
            #ffcc00 40% 60%, 
            #4cd964 60% 80%, 
            #5ac8fa 80%
          );
        }
        @keyframes eject {
          0% {
            transform: translate(-50%, 0) scale(0.9);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -120%) scale(1);
            opacity: 1;
          }
        }
        .animate-eject {
          animation: eject 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
};

