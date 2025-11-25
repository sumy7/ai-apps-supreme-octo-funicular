import React from 'react';
import Draggable, { type DraggableEvent, type DraggableData } from 'react-draggable';
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
  isPlaced?: boolean; // Whether photo has been placed on canvas
}

interface PhotoProps {
  data: PhotoData;
  onDragStart?: () => void;
  onDrag?: (id: string, x: number, y: number) => void;
  onDragStop: (id: string, x: number, y: number, e: DraggableEvent) => void;
  onTogglePin: (id: string) => void;
}

export const Photo: React.FC<PhotoProps> = ({ data, onDragStart, onDrag, onDragStop, onTogglePin }) => {
  const nodeRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a canvas to render the photo with polaroid border
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      // Polaroid Mimi proportions:
      // Image area: 46mm × 62mm, Total: 54mm × 86mm
      // Side borders: (54-46)/2 = 4mm each = 7.4% of total width
      // Top border: ~4mm = 4.7% of total height
      // Bottom border: ~20mm = 23.3% of total height
      const BORDER_SIDE_RATIO = 4 / 54; // 7.4%
      const BORDER_TOP_RATIO = 4 / 86; // 4.7%
      const BORDER_BOTTOM_RATIO = 20 / 86; // 23.3%
      const TIMESTAMP_FONT_SIZE_RATIO = 0.04;
      const TIMESTAMP_VERTICAL_POSITION_DIVISOR = 2.5;
      
      // Calculate dimensions
      const imageWidth = img.width;
      const imageHeight = img.height;
      const borderSide = imageWidth * BORDER_SIDE_RATIO;
      const borderTop = imageHeight * BORDER_TOP_RATIO;
      const borderBottom = imageHeight * BORDER_BOTTOM_RATIO;
      
      const canvasWidth = imageWidth + (borderSide * 2);
      const canvasHeight = imageHeight + borderTop + borderBottom;
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Draw white background (polaroid border)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw the image in the center with borders
      ctx.drawImage(img, borderSide, borderTop, imageWidth, imageHeight);
      
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
        canvasHeight - borderBottom / TIMESTAMP_VERTICAL_POSITION_DIVISOR
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

  const handleDragStart = () => {
    setIsDragging(true);
    if (onDragStart) {
      onDragStart();
    }
  };

  const handleDrag = (_e: DraggableEvent, dragData: DraggableData) => {
    if (onDrag) {
      onDrag(data.id, dragData.x, dragData.y);
    }
  };

  const handleDragStop = (e: DraggableEvent, dragData: DraggableData) => {
    setIsDragging(false);
    onDragStop(data.id, dragData.x, dragData.y, e);
  };

  // Photo is straight when dragging, rotation applied when placed and not dragging
  const shouldApplyRotation = data.isPlaced && !isDragging;

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: data.x, y: data.y }}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      disabled={data.isPinned}
    >
      <div
        ref={nodeRef}
        className={`absolute ${data.isPinned ? '' : 'cursor-move'} group transition-transform duration-200`}
        style={{
          zIndex: isDragging ? 100 : 10,
          transform: shouldApplyRotation ? `rotate(${data.rotation}deg)` : 'rotate(0deg)',
        }}
      >
        <div 
          className="bg-white p-3.5 pb-8 md:p-5 md:pb-11 shadow-xl hover:shadow-2xl w-48 md:w-64 relative"
        >
          {/* Pin Indicator (Visible when pinned) */}
          {data.isPinned && (
            <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 z-20 text-red-500 drop-shadow-md">
              <Pin size={20} className="md:w-6 md:h-6" fill="currentColor" />
            </div>
          )}

          <div className="relative aspect-[46/62] bg-gray-100 overflow-hidden mb-2">
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
    </Draggable>
  );
};
