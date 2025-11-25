import { useState, useEffect, useRef } from 'react';
import { Photo, type PhotoData } from './components/Photo';
import { SkeuomorphicCamera } from './components/SkeuomorphicCamera';
import { SkeuomorphicTrash } from './components/SkeuomorphicTrash';
import { Camera as CameraIcon } from 'lucide-react';
import type { DraggableEvent } from 'react-draggable';
import './App.css';

// Helper function to extract client coordinates from DraggableEvent
function getClientCoordinates(e: DraggableEvent): { clientX: number; clientY: number } {
  if ('clientX' in e && 'clientY' in e) {
    // Mouse event
    return { clientX: e.clientX, clientY: e.clientY };
  } else if ('changedTouches' in e && e.changedTouches?.[0]) {
    // Touch event
    return { 
      clientX: e.changedTouches[0].clientX, 
      clientY: e.changedTouches[0].clientY 
    };
  }
  return { clientX: 0, clientY: 0 };
}

function App() {
  // Load photos from local storage on mount using lazy initializer
  const [photos, setPhotos] = useState<PhotoData[]>(() => {
    const savedPhotos = localStorage.getItem('polaroid-photos');
    if (savedPhotos) {
      try {
        const parsed = JSON.parse(savedPhotos);
        // Ensure isPlaced is true for loaded photos
        return parsed.map((p: PhotoData) => ({ ...p, isNew: false, isPlaced: true }));
      } catch (e) {
        console.error('Failed to load photos', e);
        return [];
      }
    }
    return [];
  });
  
  // Track if there's a pending photo that hasn't been placed yet
  const [hasPendingPhoto, setHasPendingPhoto] = useState(false);
  
  const trashRef = useRef<HTMLDivElement>(null);
  const [isDraggingOverTrash, setIsDraggingOverTrash] = useState(false);

  // Save photos to local storage whenever they change
  useEffect(() => {
    // Only save photos that have been placed
    const placedPhotos = photos.filter(p => p.isPlaced);
    localStorage.setItem('polaroid-photos', JSON.stringify(placedPhotos));
  }, [photos]);

  const handleTakePhoto = (photoUrl: string) => {
    const newPhoto: PhotoData = {
      id: Date.now().toString(),
      url: photoUrl,
      timestamp: Date.now(),
      x: 100, // Initial position near camera
      y: typeof window !== 'undefined' ? window.innerHeight - 350 : 100,
      rotation: (Math.random() - 0.5) * 20, // Random rotation between -10 and 10 degrees
      isNew: true,
      isPlaced: false, // Photo is not placed yet - needs to be dragged
    };
    
    setPhotos((prev) => [...prev, newPhoto]);
    setHasPendingPhoto(true);
  };

  const handleDeletePhoto = (id: string) => {
    const photo = photos.find(p => p.id === id);
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    
    // If deleting a pending photo, allow taking new photos
    if (photo && !photo.isPlaced) {
      setHasPendingPhoto(false);
    }
  };

  const handleTogglePin = (id: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, isPinned: !photo.isPinned } : photo
      )
    );
  };

  const handleDragStart = () => {
    // Optional: could add visual feedback when dragging starts
  };

  const handleDrag = (_id: string, x: number, y: number) => {
    // Check if near trash while dragging
    if (trashRef.current) {
      const trashRect = trashRef.current.getBoundingClientRect();
      const photoCenter = { x: x + 96, y: y + 120 }; // Approximate center
      
      const isNearTrash = 
        photoCenter.x >= trashRect.left - 50 &&
        photoCenter.x <= trashRect.right + 50 &&
        photoCenter.y >= trashRect.top - 50 &&
        photoCenter.y <= trashRect.bottom + 50;
      
      setIsDraggingOverTrash(isNearTrash);
    }
  };

  const handleDragStop = (id: string, x: number, y: number, e: DraggableEvent) => {
    const photo = photos.find(p => p.id === id);
    
    // Check collision with trash can
    if (trashRef.current) {
      const trashRect = trashRef.current.getBoundingClientRect();
      const { clientX, clientY } = getClientCoordinates(e);

      if (
        clientX >= trashRect.left &&
        clientX <= trashRect.right &&
        clientY >= trashRect.top &&
        clientY <= trashRect.bottom
      ) {
        handleDeletePhoto(id);
        setIsDraggingOverTrash(false);
        return;
      }
    }

    // Check if this was a pending photo being placed
    const wasPlaced = photo && !photo.isPlaced;

    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, x, y, isPlaced: true, isNew: false } : photo
      )
    );
    
    // If a pending photo was just placed, allow taking new photos
    if (wasPlaced) {
      setHasPendingPhoto(false);
    }
    
    setIsDraggingOverTrash(false);
  };

  return (
    <div className="min-h-screen bg-stone-200 overflow-hidden relative font-sans text-gray-800">
      {/* Main Content */}
      <main className="w-full h-screen relative">
        <div className="w-full h-full relative">
          {photos.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none px-4">
              <CameraIcon size={64} className="mb-4 opacity-20" />
              <p className="text-xl md:text-xl text-center font-light">Click the camera in the bottom left to start taking photos</p>
            </div>
          )}
          
          {photos.map((photo) => (
            <Photo
              key={photo.id}
              data={photo}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragStop={handleDragStop}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      </main>
      
      {/* Trash Can Drop Zone */}
      <div 
        ref={trashRef}
        className={`
          fixed bottom-4 right-4 md:bottom-10 md:right-10 z-40 transition-all duration-300
          flex items-center justify-center
          ${isDraggingOverTrash ? 'scale-110' : 'hover:scale-105'}
        `}
        onMouseEnter={() => setIsDraggingOverTrash(true)}
        onMouseLeave={() => setIsDraggingOverTrash(false)}
      >
        <SkeuomorphicTrash isOpen={isDraggingOverTrash} />
      </div>

      {/* Bottom Left Camera Trigger */}
      <div className="fixed bottom-4 left-4 md:bottom-10 md:left-10 z-50">
        <SkeuomorphicCamera 
          onTakePhoto={handleTakePhoto}
          hasPendingPhoto={hasPendingPhoto}
        />
      </div>
    </div>
  );
}

export default App;
