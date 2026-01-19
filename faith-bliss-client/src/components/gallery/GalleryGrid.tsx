import React from 'react';
import { cn } from '@/lib/utils';
import { Maximize2 } from 'lucide-react';

interface GalleryGridProps {
  photos: string[];
  onPhotoClick: (index: number) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ photos, onPhotoClick }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 p-1">
      {/* Main Feature Photo (First one spans 2 cols on mobile if there are enough photos) */}
      {photos.map((photo, index) => {
        // Layout logic: First photo can be featured
        const isFeatured = index === 0;
        
        return (
          <div
            key={index}
            className={cn(
              "relative group cursor-pointer overflow-hidden rounded-xl bg-gray-800 aspect-[3/4]",
              isFeatured && "col-span-2 row-span-2 md:col-span-2 md:row-span-2"
            )}
            onClick={() => onPhotoClick(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onPhotoClick(index);
              }
            }}
            aria-label={`View photo ${index + 1}`}
          >
            <img
              src={photo}
              alt={`Gallery item ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
               <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 drop-shadow-lg" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
