const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    imageKitFileId: {
      type: String, // Store ImageKit file ID for easier deletion
      required: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    }
  },
  { 
    timestamps: true 
  }
);

// Index for faster queries
postSchema.index({ userId: 1 });
postSchema.index({ createdAt: -1 });

// ✅ Only create model if it doesn't exist
const postModel = mongoose.models.posts || mongoose.model('posts', postSchema);

module.exports = postModel;