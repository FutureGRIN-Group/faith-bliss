import axios from './axios';
import type { Story, StoryGroup } from '../types/app-stories';

export const fetchActiveStories = async (): Promise<StoryGroup[]> => {
  const response = await axios.get('/stories');
  return response.data;
};

export const createStory = async (mediaUrl: string, mediaType: 'image' | 'video' = 'image'): Promise<Story> => {
  const response = await axios.post('/stories', { mediaUrl, mediaType });
  return response.data;
};

export const markStoryAsViewed = async (storyId: string): Promise<void> => {
  await axios.post(`/stories/${storyId}/view`);
};
