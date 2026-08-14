import api from './api';
import { TopmateCard, ApiResponse } from '../types';

export const DEFAULT_TOPMATE_URL = 'https://topmate.io/mohitdecodes';

/**
 * Fetch public active Topmate cards
 */
export const getPublicTopmateCards = async (): Promise<TopmateCard[]> => {
  try {
    const res: any = await api.get('/topmate');
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    return [];
  } catch (error) {
    console.error('Failed to fetch public Topmate cards:', error);
    return [];
  }
};

/**
 * Fetch all Topmate cards for Admin (including inactive)
 */
export const getAdminTopmateCards = async (): Promise<TopmateCard[]> => {
  try {
    const res: any = await api.get('/topmate?all=true');
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    return [];
  } catch (error) {
    console.error('Failed to fetch admin Topmate cards:', error);
    return [];
  }
};

/**
 * Fetch single Topmate card by ID
 */
export const getTopmateCardById = async (id: string): Promise<TopmateCard> => {
  const res: any = await api.get(`/topmate/${id}`);
  return res?.data?.data || res?.data || res;
};

/**
 * Create new Topmate card (Admin)
 */
export const createTopmateCard = async (data: Partial<TopmateCard>): Promise<TopmateCard> => {
  const res: any = await api.post('/topmate', data);
  return res?.data?.data || res?.data || res;
};

/**
 * Update Topmate card (Admin)
 */
export const updateTopmateCard = async (id: string, data: Partial<TopmateCard>): Promise<TopmateCard> => {
  const res: any = await api.put(`/topmate/${id}`, data);
  return res?.data?.data || res?.data || res;
};

/**
 * Delete Topmate card (Admin)
 */
export const deleteTopmateCard = async (id: string): Promise<void> => {
  await api.delete(`/topmate/${id}`);
};

/**
 * Toggle Topmate card active/inactive status (Admin)
 */
export const toggleTopmateStatus = async (id: string): Promise<TopmateCard> => {
  const res: any = await api.patch(`/topmate/${id}/status`);
  return res?.data?.data || res?.data || res;
};

/**
 * Upload Topmate Card image to Cloudinary
 */
export const uploadTopmateImage = async (file: File): Promise<{ imageUrl: string; cloudinaryPublicId: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const res: any = await api.post('/topmate/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const data = res?.data?.data || res?.data || res || {};
  return {
    imageUrl: data.imageUrl || '',
    cloudinaryPublicId: data.cloudinaryPublicId || ''
  };
};
