import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { StoryGroup } from '../../types/app-stories';
import { useStoryStore } from '../../store/storyStore';
import { useAuth } from '../../hooks/useAuth';

interface StoryViewerProps {
  initialGroup: StoryGroup;
  allGroups: StoryGroup[];
  onClose: () => void;
}

const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewer: React.FC<StoryViewerProps> = ({ initialGroup, allGroups, onClose }) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(
    allGroups.findIndex(g => g.user._id === initialGroup.user._id)
  );
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { markAsViewed } = useStoryStore();
  const { user } = useAuth();
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  const currentGroup = allGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  // Start/Resume Timer
  const startTimer = () => {
    startTimeRef.current = Date.now() - pausedAtRef.current;
    timerRef.current = window.requestAnimationFrame(updateProgress);
  };

  // Pause Timer
  const pauseTimer = () => {
    if (timerRef.current) {
      window.cancelAnimationFrame(timerRef.current);
      pausedAtRef.current = Date.now() - startTimeRef.current;
    }
  };

  // Reset Timer
  const resetTimer = () => {
    if (timerRef.current) window.cancelAnimationFrame(timerRef.current);
    setProgress(0);
    startTimeRef.current = Date.now();
    pausedAtRef.current = 0;
    startTimer();
  };

  const updateProgress = () => {
    const elapsed = Date.now() - startTimeRef.current;
    const newProgress = (elapsed / STORY_DURATION) * 100;

    if (newProgress >= 100) {
      handleNext();
    } else {
      setProgress(newProgress);
      timerRef.current = window.requestAnimationFrame(updateProgress);
    }
  };

  // Mark viewed when story loads
  useEffect(() => {
    if (currentStory && user) {
      // If we haven't viewed it yet, mark it
      if (!currentStory.isViewed) {
        markAsViewed(currentStory._id, currentGroup.user._id);
      }
      resetTimer();
    }
    return () => {
      if (timerRef.current) window.cancelAnimationFrame(timerRef.current);
    };
  }, [currentStory?._id, currentGroup?._id]);

  useEffect(() => {
    if (isPaused) {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [isPaused]);

  const handleNext = () => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      // Next story in same group
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      // Next group
      if (currentGroupIndex < allGroups.length - 1) {
        setCurrentGroupIndex(prev => prev + 1);
        setCurrentStoryIndex(0);
      } else {
        // End of all stories
        onClose();
      }
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      // Previous story in same group
      setCurrentStoryIndex(prev => prev - 1);
    } else {
      // Previous group
      if (currentGroupIndex > 0) {
        setCurrentGroupIndex(prev => prev - 1);
        // Go to last story of previous group? Or first? usually first or last.
        // Let's go to first for simplicity, or last if we want "rewind" feel.
        setCurrentStoryIndex(0); 
      } else {
        // Start of all stories
        onClose();
      }
    }
  };

  if (!currentGroup || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Mobile-first Container */}
      <div className="relative w-full h-full md:w-[400px] md:h-[80vh] md:rounded-2xl overflow-hidden bg-gray-900">
        
        {/* Progress Bars */}
        <div className="absolute top-4 left-2 right-2 z-20 flex gap-1">
          {currentGroup.stories.map((story, idx) => (
            <div key={story._id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ 
                  width: idx < currentStoryIndex ? '100%' : 
                         idx === currentStoryIndex ? `${progress}%` : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 z-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src={currentGroup.user.profilePhoto1 || "https://via.placeholder.com/40"} 
              alt={currentGroup.user.name} 
              className="w-8 h-8 rounded-full border border-white/50"
            />
            <span className="text-white font-semibold text-sm shadow-black drop-shadow-md">
              {currentGroup.user.name}
            </span>
            <span className="text-white/70 text-xs ml-1">
               {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-black/20 text-white hover:bg-black/40">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Media Content */}
        <div 
          className="w-full h-full flex items-center justify-center bg-black"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentStory._id}
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover"
              initial={{ opacity: 0.8, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.8, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

        {/* Navigation Overlays */}
        <div className="absolute inset-0 z-10 flex">
          <div className="w-1/3 h-full" onClick={handlePrev} />
          <div className="w-2/3 h-full" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
