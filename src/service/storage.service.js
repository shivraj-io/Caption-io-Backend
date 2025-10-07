const ImageKit = require('imagekit');

async function uploadFile(buffer, fileName) {
  try {
    // Check if ImageKit credentials exist
    if (!process.env.IMAGEKIT_PUBLIC_KEY || 
        !process.env.IMAGEKIT_PRIVATE_KEY || 
        !process.env.IMAGEKIT_URL_ENDPOINT) {
      console.error('✗ ImageKit credentials missing in .env');
      throw new Error('ImageKit credentials not configured. Please add IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT to .env file');
    }

    console.log('✓ Initializing ImageKit...');
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    console.log('⏳ Uploading to ImageKit...', fileName);
    
    const result = await imagekit.upload({
      file: buffer, // Buffer or base64 string
      fileName: fileName,
      useUniqueFileName: true,
      folder: '/caption-io/posts' // Organize in folder
    });

    console.log('✓ ImageKit upload successful!');
    console.log('  URL:', result.url);
    console.log('  File ID:', result.fileId);
    
    return result;

  } catch (error) {
    console.error('✗ Storage Service Error:', error.message);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

async function deleteFile(fileId) {
  try {
    if (!process.env.IMAGEKIT_PUBLIC_KEY || 
        !process.env.IMAGEKIT_PRIVATE_KEY || 
        !process.env.IMAGEKIT_URL_ENDPOINT) {
      throw new Error('ImageKit credentials not configured');
    }

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    await imagekit.deleteFile(fileId);
    console.log('✓ File deleted from ImageKit:', fileId);
    
  } catch (error) {
    console.error('✗ Delete file error:', error.message);
    throw error;
  }
}

module.exports = {
  uploadFile,
  deleteFile
};