// src/types/StoryTypes.ts

export type Story = {
  _id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: string;
  isViewed: boolean;
};

export type StoryUser = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

export type GroupedStory = {
  user: StoryUser;
  stories: Story[];
  hasUnviewed: boolean;
};

export type UserStoryGroup = GroupedStory;
