import React from 'react';
import Draggable, { type DraggableEvent } from 'react-draggable';
import { Pin, Download } from 'lucide-react';

export interface PhotoData {
  id: string;
  url: string;
  timestamp: number;
  x: number;
  y: number;
  rotation: number;
  isNew?: boolean;
  isPinned?: boolean;
}

interface PhotoProps {
  data: PhotoData;
  onDragStop: (id: string, x: number, y: number, e: DraggableEvent) => void;
  onTogglePin: (id: string) => void;
}

// Animation constants
const ANIMATION_POP_UP_DISTANCE = 80; // pixels to pop up during animation

export const Photo: React.FC<PhotoProps> = ({ data, onDragStop, onTogglePin }) => {
  const nodeRef = React.useRef(null);
  const [isAnimating, setIsAnimating] = React.useState(!!data.isNew);

  // Calculate start position (Camera is at bottom-left)
  const startX = 56; // 40px margin + half camera width - half photo width
  const startY = typeof window !== 'undefined' ? window.innerHeight - 300 : 0;
  
  const deltaX = startX - data.x;
  const deltaY = startY - data.y;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a canvas to render the photo with polaroid border
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      // Polaroid proportions: image is 4:5 aspect ratio, with white border
      // Border: 8% on sides, 8% on top, 16% on bottom
      const borderTop = 0.08;
      const borderSide = 0.08;
      const borderBottom = 0.16;
      const TIMESTAMP_FONT_SIZE_RATIO = 0.04;
      const TIMESTAMP_VERTICAL_POSITION_DIVISOR = 2.5;
      
      // Calculate dimensions
      const imageWidth = img.width;
      const imageHeight = img.height;
      const canvasWidth = imageWidth * (1 + 2 * borderSide);
      const canvasHeight = imageHeight * (1 + borderTop + borderBottom);
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Draw white background (polaroid border)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw the image in the center with borders
      const x = imageWidth * borderSide;
      const y = imageHeight * borderTop;
      ctx.drawImage(img, x, y, imageWidth, imageHeight);
      
      // Add timestamp at bottom
      const timestamp = new Date(data.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      ctx.fillStyle = '#6b7280'; // gray-500
      ctx.font = `${imageHeight * TIMESTAMP_FONT_SIZE_RATIO}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(
        timestamp, 
        canvasWidth / 2, 
        canvasHeight - imageHeight * borderBottom / TIMESTAMP_VERTICAL_POSITION_DIVISOR
      );
      
      // Download the canvas as image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `polaroid-${data.timestamp}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };
    
    img.src = data.url;
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: data.x, y: data.y }}
      onStop={(e, d) => onDragStop(data.id, d.x, d.y, e)}
      disabled={data.isPinned}
    >
      <div
        ref={nodeRef}
        className={`absolute ${data.isPinned ? '' : 'cursor-move'} group`}
        style={{
          zIndex: 10,
        }}
      >
        <div
          className={isAnimating ? "animate-fly-in" : ""}
          style={isAnimating ? { 
            "--tx": `${deltaX}px`, 
            "--ty": `${deltaY}px`,
            "--rotation": `${data.rotation}deg`,
            "--pop-distance": `-${ANIMATION_POP_UP_DISTANCE}px`
          } as React.CSSProperties : {}}
          onAnimationEnd={() => setIsAnimating(false)}
        >
          <div 
            className="bg-white p-2 pb-8 md:p-3 md:pb-12 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl w-48 md:w-64 relative"
            style={{
              transform: isAnimating ? 'none' : `rotate(${data.rotation}deg)`,
            }}
          >
            {/* Pin Indicator (Visible when pinned) */}
            {data.isPinned && (
              <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 z-20 text-red-500 drop-shadow-md">
                <Pin size={20} className="md:w-6 md:h-6" fill="currentColor" />
              </div>
            )}

            <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-2">
              <img
                src={data.url}
                alt="Polaroid"
                className="w-full h-full object-cover pointer-events-none"
              />
              
              {/* Action Buttons - Always visible on mobile, hover on desktop */}
              <div className="absolute top-1 right-1 md:top-2 md:right-2 flex gap-1 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  aria-label={data.isPinned ? "Unpin photo" : "Pin photo"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(data.id);
                  }}
                  className={`p-1 md:p-1.5 rounded-full text-white transition-colors shadow-sm ${
                    data.isPinned ? 'bg-blue-500 hover:bg-blue-600' : 'bg-black/30 hover:bg-blue-500'
                  }`}
                  title={data.isPinned ? "Unpin" : "Pin"}
                >
                  <Pin size={12} className="md:w-3.5 md:h-3.5" strokeWidth={data.isPinned ? 0 : 2} fill={data.isPinned ? "currentColor" : "none"} />
                </button>
                <button
                  aria-label="Download photo"
                  onClick={handleDownload}
                  className="bg-black/30 hover:bg-green-500 text-white p-1 md:p-1.5 rounded-full transition-colors shadow-sm"
                  title="Download"
                >
                  <Download size={12} className="md:w-3.5 md:h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-center font-serif text-gray-600 text-xs md:text-sm">
              {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes flyIn {
            0% {
              transform: translate(var(--tx), var(--ty)) scale(0.5) rotate(0deg);
              opacity: 0;
            }
            25% {
              transform: translate(var(--tx), calc(var(--ty) + var(--pop-distance))) scale(0.6) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: translate(calc(var(--tx) * 0.6), calc(var(--ty) * 0.6)) scale(0.8) rotate(calc(var(--rotation) * 0.3));
              opacity: 1;
            }
            100% {
              transform: translate(0, 0) scale(1) rotate(var(--rotation));
              opacity: 1;
            }
          }
          .animate-fly-in {
            animation: flyIn 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>
      </div>
    </Draggable>
  );
};
