import React, { useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoGridProps {
  photos: string[];
  onUpload: (file: File) => void;
  onRemove: (index: number) => void;
  maxPhotos?: number;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos, 
  onUpload, 
  onRemove, 
  maxPhotos = 6 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const slots = Array.from({ length: maxPhotos });

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {slots.map((_, index) => {
        const photo = photos[index];
        const isMain = index === 0;

        return (
          <div 
            key={index} 
            className={cn(
              "relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/50 transition-all",
              !photo && "border-dashed hover:border-pink-500/50 hover:bg-gray-800 cursor-pointer group"
            )}
            onClick={() => !photo && fileInputRef.current?.click()}
          >
            {photo ? (
              <>
                <img 
                  src={photo} 
                  alt={`Profile ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(index);
                    }}
                    className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    <X size={16} />
                  </button>
                </div>
                {isMain && (
                   <div className="absolute top-2 left-2 px-2 py-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                     MAIN
                   </div>
                )}
              </>
            ) : (
              <div 
                className="w-full h-full flex flex-col items-center justify-center text-gray-500 group-hover:text-pink-400 transition-colors"
                role="button"
                aria-label={`Add photo to slot ${index + 1}`}
              >
                <Plus size={24} className="mb-1" />
                <span className="text-xs font-medium">Add</span>
              </div>
            )}
          </div>
        );
      })}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
        disabled={photos.length >= maxPhotos}
        aria-hidden="true"
      />
    </div>
  );
};
