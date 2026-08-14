import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadImage, uploadFile } from '../middleware/upload.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

/**
 * @desc    Upload image to Cloudinary (Admin protected)
 * @route   POST /api/upload
 * @route   POST /api/upload/image
 * @access  Private/Admin
 */
const handleImageUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image file to upload'
      });
    }

    const folder = req.body.folder || 'mohitdecodes/uploads';
    const uploadResult = await uploadToCloudinary(req.file.path, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: uploadResult.secure_url,
      data: {
        url: uploadResult.secure_url,
        imageUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id
      }
    });
  } catch (error) {
    next(error);
  }
};

router.post('/', protect, authorize('admin'), uploadImage.single('image'), handleImageUpload);
router.post('/image', protect, authorize('admin'), uploadImage.single('image'), handleImageUpload);

export default router;
