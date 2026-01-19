import React from 'react';
import { Sparkles } from 'lucide-react';
import { PhotoGrid } from './PhotoGrid';

interface PhotosSectionProps {
  photos: string[];
  onUpload: (file: File) => void;
  onRemove: (index: number) => void;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ photos, onUpload, onRemove }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Your Photos</h2>
          <p className="text-gray-400">Add up to 6 photos that show your personality</p>
        </div>

        <PhotoGrid 
          photos={photos} 
          onUpload={onUpload} 
          onRemove={onRemove}
          maxPhotos={6}
        />

        {/* Photo Tips Section */}
        <div className="mt-8 p-6 bg-linear-to-r from-pink-500/10 to-purple-500/10 rounded-2xl border border-pink-500/20">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-pink-400 mt-1" />
            <div>
              <h3 className="font-semibold text-pink-300 mb-1">Photo Tips</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Use recent photos that clearly show your face</li>
                <li>• Include variety - close-ups, full body, doing activities you love</li>
                <li>• Smile naturally and let your personality shine</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotosSection;
