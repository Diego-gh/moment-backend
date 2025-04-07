import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const commentSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'post',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('comment', commentSchema);
