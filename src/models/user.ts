import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const userSchema = new Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    profileImage: {
      url: String,
      publicId: String,
      default: 'https://example.com/default-profile.jpg',
    },
    bannerImage: {
      url: String,
      publicId: String,
      default: 'https://example.com/default-banner.jpg',
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
