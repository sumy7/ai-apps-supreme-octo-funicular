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
        // Ensure isNew is false for loaded photos so they don't animate again
        return parsed.map((p: PhotoData) => ({ ...p, isNew: false }));
      } catch (e) {
        console.error('Failed to load photos', e);
        return [];
      }
    }
    return [];
  });
  const trashRef = useRef<HTMLDivElement>(null);
  const [isDraggingOverTrash, setIsDraggingOverTrash] = useState(false);

  // Save photos to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('polaroid-photos', JSON.stringify(photos));
  }, [photos]);

  const handleTakePhoto = (photoUrl: string) => {
    const newPhoto: PhotoData = {
      id: Date.now().toString(),
      url: photoUrl,
      timestamp: Date.now(),
      x: Math.random() * (window.innerWidth - 300) + 100,
      y: Math.random() * (window.innerHeight - 400) + 100,
      rotation: (Math.random() - 0.5) * 20, // Random rotation between -10 and 10 degrees
      isNew: true,
    };
    
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, isPinned: !photo.isPinned } : photo
      )
    );
  };

  const handleDragStop = (id: string, x: number, y: number, e: DraggableEvent) => {
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

    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, x, y } : photo
      )
    );
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
        />
      </div>
    </div>
  );
}

export default App;
