import { z } from 'zod';
import { describe, it, expect } from 'vitest';

describe('Story Validation Logic', () => {
  // Define the schema (copy from controller for testing)
  const createStorySchema = z.object({
    mediaUrl: z.string().url({ message: 'Invalid media URL' }),
    mediaType: z.enum(['image', 'video']).optional().default('image'),
  });

  it('should validate a correct story payload', () => {
    const validPayload = {
      mediaUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      mediaType: 'image'
    };
    const result = createStorySchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should reject an invalid URL', () => {
    const invalidPayload = {
      mediaUrl: 'not-a-url',
      mediaType: 'image'
    };
    const result = createStorySchema.safeParse(invalidPayload);
    
    // Debugging output
    if (!result.success) {
       console.log('Validation Error:', JSON.stringify(result.error, null, 2));
    }

    expect(result.success).toBe(false);
    
    if (!result.success) {
      // Use .issues instead of .errors to be safe, though .errors should work
      expect(result.error.issues[0].message).toBe('Invalid media URL');
    }
  });

  it('should default mediaType to image if missing', () => {
    const validPayload = {
      mediaUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    };
    const result = createStorySchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.mediaType).toBe('image');
    }
  });

  it('should reject invalid mediaType', () => {
    const invalidPayload = {
      mediaUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      mediaType: 'audio' // Not allowed
    };
    const result = createStorySchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });
});
