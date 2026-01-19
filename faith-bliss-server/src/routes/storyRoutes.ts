import express from 'express';
import { createStory, getActiveStories, markStoryViewed } from '../controllers/storyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// GET active stories grouped by user
router.get('/', protect, getActiveStories);

// POST create a new story
// Note: Media upload is handled separately by the upload routes which return a URL.
// The client then sends that URL here.
router.post('/', protect, createStory);

// POST mark story as viewed
router.post('/:id/view', protect, markStoryViewed);

export default router;
