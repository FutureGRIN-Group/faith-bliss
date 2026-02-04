import { Request, Response } from 'express';
import StoryModel from '../models/Story';
import UserModel from '../models/User';
import { Types } from 'mongoose';
import { z } from 'zod';

// Zod Schema for Create Story
const createStorySchema = z.object({
  mediaUrl: z.string().url({ message: 'Invalid media URL' }),
  mediaType: z.enum(['image', 'video']).optional().default('image'),
});

// Create a new story
export const createStory = async (req: Request, res: Response) => {
  try {
    // 1. Validate Input
    const parseResult = createStorySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: (parseResult.error as any).errors 
      });
    }

    const { mediaUrl, mediaType } = parseResult.data;
    const firebaseUid = req.userId; // From authMiddleware

    if (!firebaseUid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await UserModel.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const story = await StoryModel.create({
      user: user._id,
      mediaUrl,
      mediaType: mediaType || 'image',
      expiresAt,
      viewers: [],
    });

    await story.populate('user', 'name profilePhoto1');

    res.status(201).json(story);
  } catch (error: any) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
};

// Get active stories grouped by user
export const getActiveStories = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.userId;
    if (!firebaseUid) return res.status(401).json({ error: 'Unauthorized' });

    // Ensure current user exists to get their Mongo ID
    const currentUser = await UserModel.findOne({ firebaseUid });
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    const now = new Date();

    // Fetch all active stories, populated with user info
    const stories = await StoryModel.find({ expiresAt: { $gt: now } })
      .populate('user', 'name profilePhoto1')
      .sort({ createdAt: 1 }); // Oldest first within a user's stack usually

    // Group by user
    const storiesByUser: Record<string, any> = {};

    stories.forEach((story) => {
      const userId = (story.user as any)._id.toString();
      
      if (!storiesByUser[userId]) {
        storiesByUser[userId] = {
          user: story.user,
          stories: [],
          hasUnviewed: false,
        };
      }

      storiesByUser[userId].stories.push(story);

      // Check if current user has viewed this story
      const hasViewed = story.viewers.some((viewerId) => 
        viewerId.toString() === currentUser._id.toString()
      );

      if (!hasViewed) {
        storiesByUser[userId].hasUnviewed = true;
      }
    });

    // Convert map to array
    const result = Object.values(storiesByUser);

    // Sort: Users with unviewed stories first, then by latest story update? 
    // Usually, the current user is first (if they have stories), then others.
    // For simplicity, let's just return the list. The frontend can sort.
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

// Mark story as viewed
export const markStoryViewed = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const firebaseUid = req.userId;

    const user = await UserModel.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const story = await StoryModel.findById(id);
    if (!story) return res.status(404).json({ error: 'Story not found' });

    // Add user to viewers if not already present
    if (!story.viewers.includes(user._id as Types.ObjectId)) {
      story.viewers.push(user._id as Types.ObjectId);
      await story.save();
    }

    res.status(200).json({ message: 'Marked as viewed' });
  } catch (error: any) {
    console.error('Error marking story as viewed:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
};
