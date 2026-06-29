const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { uploadToCloudinary } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Helper to upload a file with Cloudinary and local fallback.
 */
const handleUploadWithFallback = async (req, file, folder) => {
  // 1. Try Cloudinary
  try {
    console.log(`Cloudinary: Uploading to folder "${folder}"...`);
    const result = await uploadToCloudinary(file, folder);
    console.log(`✅ Cloudinary: Upload succeeded for ${file.originalname}`);
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      storage: 'cloudinary'
    };
  } catch (cloudinaryErr) {
    console.error('❌ Cloudinary upload failed completely:', cloudinaryErr);

    const isProduction = process.env.NODE_ENV === 'production' || req.get('host')?.includes('render.com') || req.get('host')?.includes('onrender.com');
    if (isProduction) {
      console.error('❌ Local fallback is disabled in production due to ephemeral filesystem on Render.');
      throw new Error(`Cloudinary upload failed: ${cloudinaryErr.message}. Local storage fallback is disabled on Render.`);
    }

    console.warn(`⚠️ Falling back to local storage (Development mode)...`);

    // 2. Try Local Server Storage
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const originalExt = file.originalname ? file.originalname.substring(file.originalname.lastIndexOf('.')) : '';
      const ext = originalExt || (file.mimetype && file.mimetype.startsWith('audio/') ? '.webm' : '.jpg');
      const fileName = `${file.fieldname || 'file'}-${uniqueSuffix}${ext}`;
      
      const uploadDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      console.log(`✅ Local Storage: Saved to ${filePath}`);

      const host = req.get('host');
      const protocol = req.protocol;
      const secure_url = `${protocol}://${host}/uploads/${fileName}`;

      return {
        secure_url,
        public_id: fileName,
        storage: 'local'
      };
    } catch (localErr) {
      console.error(`❌ Local Storage: Save failed: ${localErr.message}`);
      throw new Error(`Upload failed completely: ${localErr.message}`);
    }
  }
};

router.post('/product', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const result = await handleUploadWithFallback(req, req.file, 'product');
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      storage: result.storage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/review-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const result = await handleUploadWithFallback(req, req.file, 'review');
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      storage: result.storage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/review-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio uploaded' });
    }
    const result = await handleUploadWithFallback(req, req.file, 'audio');
    res.json({
      message: 'Audio uploaded successfully',
      audioUrl: result.secure_url,
      publicId: result.public_id,
      storage: result.storage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/whatsapp', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const result = await handleUploadWithFallback(req, req.file, 'whatsapp');
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      storage: result.storage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;