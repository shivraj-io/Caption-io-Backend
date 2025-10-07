const express = require('express');
const router = express.Router();

// ✅ Import all controllers
const { 
  createPostController, 
  generateCaptionController,
  getAllPostsController,
  deletePostController  // ✅ Make sure this is imported
} = require('../controllers/post.controller');

const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

console.log('✓ Post routes loaded');

// Generate caption route (doesn't save to DB or ImageKit)
router.post('/generate-caption', authMiddleware, upload.single('image'), generateCaptionController);

// Create/Save post route (uploads to ImageKit and saves to DB)
router.post('/create', authMiddleware, upload.single('image'), createPostController);

// Get all posts
router.get('/', authMiddleware, getAllPostsController);

// Delete post - ✅ Make sure deletePostController is a function
router.delete('/:id', authMiddleware, deletePostController);

console.log('✓ Post routes registered');

module.exports = router;