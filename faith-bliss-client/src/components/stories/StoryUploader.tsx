import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/contexts/ToastContext';
import { getApiClient } from '@/services/api-client';
import { useAuth } from '@/hooks/useAuth';

interface StoryUploaderProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

const StoryUploader: React.FC<StoryUploaderProps> = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { accessToken } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file || !accessToken) return;

    setIsUploading(true);
    try {
      // 1. Upload to Cloudinary (Need a helper for this or generic upload endpoint)
      // Since we don't have a direct "upload story media" endpoint that handles the file + DB in one go in our controller plan,
      // we usually upload to /api/uploads first, get URL, then create story.
      // Let's assume we use the existing upload route or a generic one.
      
      const formData = new FormData();
      formData.append('image', file); // The existing upload middleware expects 'image' field

      // We'll use the generic upload endpoint if available, or a specific story upload endpoint
      // For now, let's assume we fetch a generic upload URL from our client service or just use fetch directly
      // Checking existing upload routes... /api/uploads/single might exist?
      
      const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/single`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload media');
      
      const uploadData = await uploadResponse.json();
      const mediaUrl = uploadData.url; 
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';

      // 2. Create Story in DB
      const apiClient = getApiClient(accessToken);
      await apiClient.Story.createStory({
        mediaUrl,
        mediaType,
        caption
      });

      showToast('Story posted successfully!', 'success');
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to post story', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-md rounded-2xl overflow-hidden relative border border-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">Create Story</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center space-y-6">
            {!preview ? (
                <div 
                    className="w-full h-64 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition-colors bg-gray-800/50"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Camera className="w-8 h-8 text-pink-500" />
                    </div>
                    <p className="text-gray-400 font-medium">Take a photo or upload</p>
                    <p className="text-gray-600 text-xs mt-2">Supports JPG, PNG, MP4</p>
                </div>
            ) : (
                <div className="relative w-full h-80 bg-black rounded-xl overflow-hidden">
                    {file?.type.startsWith('video') ? (
                        <video src={preview} className="w-full h-full object-contain" controls />
                    ) : (
                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    )}
                    <button 
                        onClick={() => { setFile(null); setPreview(null); }}
                        className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,video/*" 
                onChange={handleFileChange}
            />

            <Input 
                placeholder="Add a caption..." 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
            />

            <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4 mr-2" />
                        Share to Story
                    </>
                )}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryUploader;
