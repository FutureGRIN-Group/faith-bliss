import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle, MapPin } from 'lucide-react';
import { FaithBlissMark } from '@/components/branding/FaithBlissLogo';
import { cn } from '@/lib/utils';
import type { User } from '@/services/api';

interface FullScreenGalleryProps {
  isOpen: boolean;
  initialIndex: number;
  photos: string[];
  user: User;
  onClose: () => void;
  onLike?: () => void;
  onPass?: () => void;
  onMessage?: () => void;
}

export const FullScreenGallery: React.FC<FullScreenGalleryProps> = ({
  isOpen,
  initialIndex,
  photos,
  user,
  onClose,
  onLike,
  onPass,
  onMessage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setIsLoaded(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setIsLoaded(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-linear-to-b from-black/60 to-transparent">
        <div className="text-white/80 text-sm font-medium">
          {currentIndex + 1} / {photos.length}
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          aria-label="Close gallery"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-0 md:p-8">
        {/* Navigation Buttons (Desktop) */}
        {photos.length > 1 && (
            <>
                <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 hidden md:flex p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all z-10"
                aria-label="Previous photo"
                >
                <ChevronLeft size={32} />
                </button>
                <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 hidden md:flex p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all z-10"
                aria-label="Next photo"
                >
                <ChevronRight size={32} />
                </button>
            </>
        )}

        {/* Image */}
        <div className="relative w-full h-full max-w-4xl max-h-[85vh]">
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-pink-500 rounded-full animate-spin" />
                </div>
            )}
            <img
            src={photos[currentIndex]}
            alt={`${user.name} - Photo ${currentIndex + 1}`}
            className={cn(
                "w-full h-full object-contain transition-opacity duration-300",
                isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsLoaded(true)}
            onTouchEnd={(e) => {
                // Simple swipe detection could go here
            }}
            />
        </div>
      </div>

      {/* Bottom Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black via-black/80 to-transparent pt-20 pb-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* User Info */}
            <div className="text-white space-y-1">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                    {user.name}, {user.age}
                </h2>
                {user.location && (
                    <div className="flex items-center text-gray-300 text-sm">
                        <MapPin size={16} className="mr-1" />
                        {typeof user.location === 'string' ? user.location : (user.location as any).address}
                    </div>
                )}
                 {/* Indicator Dots */}
                <div className="flex space-x-1.5 mt-3">
                    {photos.map((_, idx) => (
                    <div
                        key={idx}
                        className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                        )}
                    />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 justify-center md:justify-end pb-2">
                {onPass && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onPass(); }}
                        className="p-4 bg-gray-800/80 hover:bg-gray-700 text-red-400 rounded-full border border-red-500/30 transition-transform hover:scale-110"
                        aria-label="Pass"
                    >
                        <X size={28} />
                    </button>
                )}
                 {onMessage && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onMessage(); }}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 flex items-center gap-2"
                        aria-label="Message"
                    >
                        <MessageCircle size={24} />
                        <span>Message</span>
                    </button>
                )}
                {onLike && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onLike(); }}
                        className="p-4 bg-gray-800/80 hover:bg-gray-700 text-pink-400 rounded-full border border-pink-500/30 transition-transform hover:scale-110"
                        aria-label="Like"
                    >
                        <FaithBlissMark className="w-7 h-7" alt="Like" />
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
