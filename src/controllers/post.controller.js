const { generateCaption } = require('../service/ai.service');
const { uploadFile, deleteFile } = require('../service/storage.service');
const postModel = require('../models/post.model');
const { v4: uuidv4 } = require('uuid');

// Generate caption only (without saving post)
async function generateCaptionController(req, res) {
  try {
    console.log('========================================');
    console.log('✓ Generate caption request received');
    console.log('  User ID:', req.user?.id);
    console.log('  User Email:', req.user?.email);
    
    const file = req.file;
    if (!file) {
      console.log('✗ ERROR: No file uploaded');
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    console.log('✓ File received:');
    console.log('  - Name:', file.originalname);
    console.log('  - Size:', `${(file.size / 1024).toFixed(2)} KB`);
    console.log('  - Type:', file.mimetype);

    if (!file.mimetype.startsWith('image/')) {
      console.log('✗ ERROR: Invalid file type');
      return res.status(400).json({ message: 'File must be an image' });
    }

    console.log('⏳ Converting image to base64...');
    const base64Image = Buffer.from(file.buffer).toString('base64');
    console.log('✓ Base64 conversion successful');
    
    console.log('⏳ Calling AI service to generate caption...');
    const caption = await generateCaption(base64Image);
    
    console.log('✓ Caption generated successfully!');
    console.log('  Caption preview:', caption.substring(0, 100) + '...');
    console.log('========================================');

    return res.status(200).json({
      message: 'Caption generated successfully',
      caption
    });

  } catch (error) {
    console.log('========================================');
    console.error('✗✗✗ GENERATE CAPTION ERROR ✗✗✗');
    console.error('Error message:', error.message);
    console.log('========================================');
    
    return res.status(500).json({
      message: 'Failed to generate caption',
      error: error.message
    });
  }
}

// Create/Save post with image and caption (uploads to ImageKit)
async function createPostController(req, res) {
  try {
    console.log('========================================');
    console.log('✓ Create/Save post request received');
    console.log('  User:', req.user?.email);
    
    const file = req.file;
    const { caption } = req.body;
    
    if (!file) {
      console.log('✗ No file uploaded');
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    if (!caption) {
      console.log('✗ No caption provided');
      return res.status(400).json({ message: 'Caption is required' });
    }

    console.log('✓ File received:', file.originalname);
    console.log('✓ Caption received:', caption.substring(0, 50) + '...');

    console.log('⏳ Uploading to ImageKit...');
    const uploadResult = await uploadFile(file.buffer, `post_${uuidv4()}_${file.originalname}`);
    console.log('✓ Upload successful!');
    console.log('  URL:', uploadResult.url);

    console.log('⏳ Saving post to database...');
    const post = await postModel.create({
      caption,
      image: uploadResult.url,
      imageKitFileId: uploadResult.fileId,
      userId: req.user.id
    });

    console.log('✓ Post saved to database!');
    console.log('  Post ID:', post._id);
    console.log('========================================');

    return res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post._id,
        caption: post.caption,
        image: post.image,
        createdAt: post.createdAt
      }
    });

  } catch (error) {
    console.log('========================================');
    console.error('✗✗✗ CREATE POST ERROR ✗✗✗');
    console.error('Error message:', error.message);
    console.log('========================================');
    
    return res.status(500).json({
      message: 'Failed to create post',
      error: error.message
    });
  }
}

// Get all posts
async function getAllPostsController(req, res) {
  try {
    console.log('✓ Get all posts request');
    const posts = await postModel.find({ userId: req.user.id }) // Only get current user's posts
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      message: 'Posts fetched successfully',
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('✗ Get posts error:', error.message);
    return res.status(500).json({
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
}

// Delete post
async function deletePostController(req, res) {
  try {
    console.log('========================================');
    console.log('✓ Delete post request received');
    console.log('  Post ID:', req.params.id);
    console.log('  User:', req.user?.email);

    const post = await postModel.findById(req.params.id);

    if (!post) {
      console.log('✗ Post not found');
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns this post
    if (post.userId.toString() !== req.user.id) {
      console.log('✗ Unauthorized: User does not own this post');
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Try to delete from ImageKit if fileId exists
    if (post.imageKitFileId) {
      try {
        await deleteFile(post.imageKitFileId);
        console.log('✓ Image deleted from ImageKit');
      } catch (error) {
        console.log('⚠️  Could not delete from ImageKit:', error.message);
        // Continue anyway - delete from DB
      }
    }

    // Delete from database
    await postModel.findByIdAndDelete(req.params.id);
    console.log('✓ Post deleted from database');
    console.log('========================================');

    return res.json({
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.log('========================================');
    console.error('✗✗✗ DELETE POST ERROR ✗✗✗');
    console.error('Error message:', error.message);
    console.log('========================================');
    
    return res.status(500).json({
      message: 'Failed to delete post',
      error: error.message
    });
  }
}

// ✅ MAKE SURE ALL FUNCTIONS ARE EXPORTED
module.exports = {
  createPostController,
  generateCaptionController,
  getAllPostsController,
  deletePostController  // ✅ This must be here!
};