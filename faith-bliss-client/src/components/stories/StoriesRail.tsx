import React, { useEffect, useState, useCallback } from 'react';
import { useStoryStore } from '../../store/storyStore';
import StoryAvatar from './StoryAvatar';
import CreateStoryModal from './CreateStoryModal';
import { useAuth } from '../../hooks/useAuth';
import StoryViewer from './StoryViewer';
import type { StoryGroup } from '../../types/app-stories';

const StoriesRail: React.FC = () => {
  const { storyGroups, fetchStories, isLoading } = useStoryStore();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeStoryGroup, setActiveStoryGroup] = useState<StoryGroup | null>(null);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleStoryClick = (group: StoryGroup) => {
    setActiveStoryGroup(group);
  };


  const handleCloseViewer = useCallback(() => {
    setActiveStoryGroup(null);
    fetchStories(); // Refresh to update viewed status
  }, [fetchStories]);

  return (
    <div className="w-full py-4 bg-white border-b border-gray-100 overflow-x-auto no-scrollbar">
      <div className="flex space-x-4 px-4 min-w-max">
        {/* Current User's "Add Story" Bubble */}
        <StoryAvatar 
          image={user?.profilePhoto1 || ""} 
          name="Your Story" 
          isAddStory 
          onClick={handleCreateClick} 
        />

        {/* Other Users' Stories */}
        {storyGroups.map((group) => (
          <StoryAvatar
            key={group.user._id}
            image={group.user.profilePhoto1}
            name={group.user.name}
            hasUnviewed={group.hasUnviewed}
            onClick={() => handleStoryClick(group)}
          />
        ))}

        {isLoading && storyGroups.length === 0 && (
          <div className="flex space-x-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex flex-col items-center space-y-2">
                 <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                 <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
               </div>
             ))}
          </div>
        )}
      </div>

      <CreateStoryModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {activeStoryGroup && (
        <StoryViewer 
          initialGroup={activeStoryGroup} 
          allGroups={storyGroups}
          onClose={handleCloseViewer} 
        />
      )}
    </div>
  );
};

export default StoriesRail;
