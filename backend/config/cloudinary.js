const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

// Verify Cloudinary configuration on startup
const hasCloudinaryEnv = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
if (!hasCloudinaryEnv) {
  console.warn(
    '\n===================================================================================\n' +
    '⚠️  WARNING: Cloudinary environment variables are missing!\n' +
    '   Make sure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.\n' +
    '   Without these, uploads will fail and local fallback is disabled in production.\n' +
    '===================================================================================\n'
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const memoryStorage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const audioFilter = (req, file, cb) => {
  const allowedTypes = /mp3|wav|m4a|webm|opus|ogg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('audio/');
  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed'));
  }
};

const imageUpload = multer({ 
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const audioUpload = multer({ 
  storage: memoryStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: audioFilter,
});

const uploadToCloudinary = async (file, folder) => {
  const isAudio = folder === 'audio' || (file.mimetype && file.mimetype.startsWith('audio/'));
  const resource_type = isAudio ? 'video' : 'auto';

  // Convert buffer to data URI
  const mimeType = file.mimetype || (isAudio ? 'audio/webm' : 'image/jpeg');
  const base64Data = file.buffer.toString('base64');
  const fileUri = `data:${mimeType};base64,${base64Data}`;

  return cloudinary.uploader.upload(fileUri, {
    folder: `reverse/${folder}`,
    resource_type,
  });
};

const deleteFromCloudinary = async (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    let pathPart = parts[1];
    
    if (pathPart.startsWith('v')) {
      const slashIndex = pathPart.indexOf('/');
      if (slashIndex !== -1) {
        pathPart = pathPart.substring(slashIndex + 1);
      }
    }
    
    const extIndex = pathPart.lastIndexOf('.');
    let publicId = extIndex !== -1 ? pathPart.substring(0, extIndex) : pathPart;
    
    let resource_type = 'image';
    if (url.includes('/video/')) {
      resource_type = 'video';
    } else if (url.includes('/raw/')) {
      resource_type = 'raw';
    }

    const result = await cloudinary.uploader.destroy(publicId, { resource_type });
    return result;
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error);
    return null;
  }
};

module.exports = { cloudinary, imageUpload, audioUpload, uploadToCloudinary, deleteFromCloudinary };