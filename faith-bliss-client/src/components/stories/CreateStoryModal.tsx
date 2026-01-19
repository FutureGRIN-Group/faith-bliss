import React, { useRef, useState } from 'react';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadPhotosToCloudinary } from '../../api/cloudinaryUpload';
import { useStoryStore } from '../../store/storyStore';
import { useAuth } from '../../hooks/useAuth';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addStory, isUploading } = useStoryStore();
  const { user } = useAuth(); // Assuming this hook gives us the current user

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // 1. Upload to Cloudinary
      // The API expects an array of files, returns array of URLs
      const urls = await uploadPhotosToCloudinary([file]);
      const mediaUrl = urls[0];

      // 2. Create Story in Backend
      await addStory(mediaUrl, 'image'); // Defaulting to image for now

      // 3. Cleanup and Close
      setFile(null);
      setPreview(null);
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload story. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl m-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Create Story</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[300px] bg-gray-50">
          {preview ? (
            <div className="relative w-full aspect-[9/16] bg-black rounded-lg overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <ImageIcon className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-500 font-medium">Click to select photo</p>
              <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG</p>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white">
          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${
              !file || isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              'Share to Story'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
