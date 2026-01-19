import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getApiClient } from '@/services/api-client';
import { useAuth } from '@/hooks/useAuth';
import type { StoryGroup } from '@/types/app-stories';
import StoryAvatar from './StoryAvatar';
import StoryViewer from './StoryViewer';
import StoryUploader from './StoryUploader';
import { useToast } from '@/contexts/ToastContext';

const StoryFeed: React.FC = () => {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [initialGroupIndex, setInitialGroupIndex] = useState(0);
  const { accessToken, user } = useAuth();
  const { showToast } = useToast();

  const fetchStories = async () => {
    if (!accessToken) return;
    try {
      const apiClient = getApiClient(accessToken);
      const data = await apiClient.Story.getStories();
      setStoryGroups(data);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      // Optional: showToast('Failed to load stories', 'error');
    }
  };

  useEffect(() => {
    fetchStories();
  }, [accessToken]);

  const handleStoryClick = (index: number) => {
    setInitialGroupIndex(index);
    setIsViewerOpen(true);
  };

  const handleCreateClick = () => {
    setIsUploaderOpen(true);
  };

  const handleViewStory = async (storyId: string) => {
    if (!accessToken) return;
    try {
      const apiClient = getApiClient(accessToken);
      await apiClient.Story.markAsViewed(storyId);
      
      // Optimistic update
      setStoryGroups(prev => prev.map(group => ({
        ...group,
        stories: group.stories.map(s => 
          s._id === storyId ? { ...s, isViewed: true } : s
        ),
        // Recalculate hasUnviewed? 
        // Ideally we should check if ALL are viewed now, but for UI feedback usually just marking the specific story is enough
        // Or we re-fetch when viewer closes.
      })));
    } catch (error) {
      console.error('Failed to mark story viewed:', error);
    }
  };

  const currentUserHasStory = storyGroups.some(g => g.user._id === user?._id);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        
        {/* Create Story Button (Always first) */}
        {!currentUserHasStory && (
           <StoryAvatar 
             name="Add Story"
             isSelf={true}
             image={user?.photo1} // Use user's avatar
             onClick={handleCreateClick}
           />
        )}

        {/* Story List */}
        {storyGroups.map((group, index) => (
          <StoryAvatar
            key={group.user._id}
            name={group.user._id === user?._id ? "My Story" : group.user.firstName}
            image={group.user.avatar}
            isViewed={!group.hasUnviewed}
            isSelf={group.user._id === user?._id}
            onClick={() => handleStoryClick(index)}
          />
        ))}
      </div>

      {/* Modals */}
      {isViewerOpen && storyGroups.length > 0 && (
        <StoryViewer
          storyGroups={storyGroups}
          initialStoryGroupIndex={initialGroupIndex}
          onClose={() => {
              setIsViewerOpen(false);
              fetchStories(); // Refresh to update viewed status rings
          }}
          onViewStory={handleViewStory}
        />
      )}

      {isUploaderOpen && (
        <StoryUploader
          onClose={() => setIsUploaderOpen(false)}
          onUploadSuccess={fetchStories}
        />
      )}
    </div>
  );
};

export default StoryFeed;
