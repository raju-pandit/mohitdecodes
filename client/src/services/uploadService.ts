import api from './api';

export interface UploadResponse {
  url: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
}

/**
 * Universal Image Upload helper for all admin panels
 * Uploads directly to backend -> Cloudinary (with local disk fallback)
 * @param file - Selected File from <input type="file" />
 * @param folder - Cloudinary folder name (optional, defaults to mohitdecodes/uploads)
 * @returns Promise<string> - The public image URL
 */
export const uploadImage = async (file: File, folder = 'mohitdecodes/uploads'): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const res: any = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // Extract secure url from response structure
  const url = res?.url || res?.data?.url || res?.data?.imageUrl || res?.imageUrl || '';
  if (!url) {
    throw new Error(res?.message || 'Failed to obtain image URL from server');
  }

  return url;
};

export default uploadImage;
