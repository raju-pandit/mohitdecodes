import api from './api';
import { TopmateCard, ApiResponse } from '../types';

export const DEFAULT_TOPMATE_URL = 'https://topmate.io/mohitdecodes';

/**
 * Fetch public active Topmate cards
 */
export const getPublicTopmateCards = async (): Promise<TopmateCard[]> => {
  try {
    const res = await api.get<ApiResponse<TopmateCard[]>>('/topmate');
    return (res as any)?.data?.data || (res as any)?.data || [];
  } catch (error) {
    console.error('Failed to fetch public Topmate cards:', error);
    return [];
  }
};

/**
 * Fetch all Topmate cards for Admin (including inactive)
 */
export const getAdminTopmateCards = async (): Promise<TopmateCard[]> => {
  const res = await api.get<ApiResponse<TopmateCard[]>>('/topmate?all=true');
  return (res as any)?.data?.data || (res as any)?.data || [];
};

/**
 * Fetch single Topmate card by ID
 */
export const getTopmateCardById = async (id: string): Promise<TopmateCard> => {
  const res = await api.get<ApiResponse<TopmateCard>>(`/topmate/${id}`);
  return (res as any)?.data?.data || (res as any)?.data;
};

/**
 * Create new Topmate card (Admin)
 */
export const createTopmateCard = async (data: Partial<TopmateCard>): Promise<TopmateCard> => {
  const res = await api.post<ApiResponse<TopmateCard>>('/topmate', data);
  return (res as any)?.data?.data || (res as any)?.data;
};

/**
 * Update Topmate card (Admin)
 */
export const updateTopmateCard = async (id: string, data: Partial<TopmateCard>): Promise<TopmateCard> => {
  const res = await api.put<ApiResponse<TopmateCard>>(`/topmate/${id}`, data);
  return (res as any)?.data?.data || (res as any)?.data;
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
  const res = await api.patch<ApiResponse<TopmateCard>>(`/topmate/${id}/status`);
  return (res as any)?.data?.data || (res as any)?.data;
};

/**
 * Upload Topmate Card image
 */
export const uploadTopmateImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await api.post('/topmate/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return (res as any)?.data?.data?.imageUrl || (res as any)?.data?.imageUrl || '';
};
