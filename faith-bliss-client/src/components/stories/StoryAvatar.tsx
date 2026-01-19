import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoryAvatarProps {
  image?: string;
  name: string;
  isViewed?: boolean;
  isSelf?: boolean;
  onClick: () => void;
}

const StoryAvatar: React.FC<StoryAvatarProps> = ({
  image,
  name,
  isViewed = false,
  isSelf = false,
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center space-y-1 cursor-pointer" onClick={onClick}>
      <div
        className={cn(
          "relative p-[3px] rounded-full transition-all duration-300",
          isSelf 
            ? "border-2 border-dashed border-gray-400" 
            : isViewed 
              ? "bg-gray-300" 
              : "bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-500 animate-gradient-xy"
        )}
      >
        <div className="relative w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-gray-100">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-xl">
              {name.charAt(0)}
            </div>
          )}
          
          {isSelf && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
              <div className="bg-white rounded-full p-1 shadow-sm">
                 <Plus className="w-4 h-4 text-pink-500" />
              </div>
            </div>
          )}
        </div>
      </div>
      <span className="text-xs font-medium text-gray-700 truncate w-16 text-center">
        {isSelf ? "My Story" : name}
      </span>
    </div>
  );
};

export default StoryAvatar;
