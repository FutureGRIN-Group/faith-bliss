import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStory extends Document {
  user: Types.ObjectId;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  viewers: Types.ObjectId[];
  createdAt: Date;
  expiresAt: Date;
}

const StorySchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    viewers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: { type: Date, required: true, index: true }, // Index for efficient querying/TTL
  },
  {
    timestamps: true,
  }
);

const StoryModel = mongoose.model<IStory>('Story', StorySchema);
export default StoryModel;
