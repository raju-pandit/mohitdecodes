import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Upload local file to Cloudinary and cleanup local file
 * @param {string} localFilePath - Path of file on local disk
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadToCloudinary = async (localFilePath, folder = 'mohitdecodes/topmate') => {
  try {
    if (!isCloudinaryConfigured()) {
      // Return relative path as fallback
      const relativePath = `/${localFilePath.replace(/\\/g, '/')}`;
      return {
        secure_url: relativePath,
        public_id: ''
      };
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    // Remove local file after successful Cloudinary upload
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.warn('Failed to delete temp local upload file:', err);
      }
    }

    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Fallback to local file URL if Cloudinary fails
    const relativePath = `/${localFilePath.replace(/\\/g, '/')}`;
    return {
      secure_url: relativePath,
      public_id: ''
    };
  }
};

/**
 * Delete image from Cloudinary by public ID or URL
 * @param {string} publicIdOrUrl
 */
export const deleteFromCloudinary = async (publicIdOrUrl) => {
  if (!publicIdOrUrl || !isCloudinaryConfigured()) return;

  try {
    let publicId = publicIdOrUrl;
    if (publicIdOrUrl.startsWith('http')) {
      // Extract public_id from Cloudinary URL
      const parts = publicIdOrUrl.split('/upload/');
      if (parts[1]) {
        const pathWithoutVersion = parts[1].replace(/^v\d+\//, '');
        publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.')) || pathWithoutVersion;
      }
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.warn('Cloudinary delete error:', error);
  }
};

export default cloudinary;
