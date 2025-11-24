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
    const link = document.createElement('a');
    link.href = data.url;
    link.download = `polaroid-${data.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          style={isAnimating ? { "--tx": `${deltaX}px`, "--ty": `${deltaY}px` } as React.CSSProperties : {}}
          onAnimationEnd={() => setIsAnimating(false)}
        >
          <div 
            className="bg-white p-3 pb-12 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl w-64 relative"
            style={{
              transform: `rotate(${data.rotation}deg)`,
            }}
          >
            {/* Pin Indicator (Visible when pinned) */}
            {data.isPinned && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 text-red-500 drop-shadow-md">
                <Pin size={24} fill="currentColor" />
              </div>
            )}

            <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-2">
              <img
                src={data.url}
                alt="Polaroid"
                className="w-full h-full object-cover pointer-events-none"
              />
              
              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  aria-label={data.isPinned ? "Unpin photo" : "Pin photo"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(data.id);
                  }}
                  className={`p-1.5 rounded-full text-white transition-colors shadow-sm ${
                    data.isPinned ? 'bg-blue-500 hover:bg-blue-600' : 'bg-black/30 hover:bg-blue-500'
                  }`}
                  title={data.isPinned ? "Unpin" : "Pin"}
                >
                  <Pin size={14} className={data.isPinned ? "fill-current" : ""} />
                </button>
                <button
                  aria-label="Download photo"
                  onClick={handleDownload}
                  className="bg-black/30 hover:bg-green-500 text-white p-1.5 rounded-full transition-colors shadow-sm"
                  title="Download"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
            <div className="text-center font-serif text-gray-600 text-sm">
              {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes flyIn {
            0% {
              transform: translate(var(--tx), var(--ty)) scale(0.5);
              opacity: 0;
            }
            100% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
          }
          .animate-fly-in {
            animation: flyIn 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
        `}</style>
      </div>
    </Draggable>
  );
};
