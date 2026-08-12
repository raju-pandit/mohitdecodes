import api from './api';
import { Tutorial, ApiResponse } from '../types';

export const getTutorials = async (params?: Record<string, any>): Promise<ApiResponse<Tutorial[]>> => {
  return await api.get('/tutorials', { params });
};

export const getTutorial = async (slug: string): Promise<ApiResponse<Tutorial>> => {
  return await api.get(`/tutorials/${slug}`);
};

export const createTutorial = async (data: Partial<Tutorial>): Promise<ApiResponse<Tutorial>> => {
  return await api.post('/tutorials', data);
};

export const updateTutorial = async (id: string, data: Partial<Tutorial>): Promise<ApiResponse<Tutorial>> => {
  return await api.put(`/tutorials/${id}`, data);
};

export const deleteTutorial = async (id: string): Promise<ApiResponse<null>> => {
  return await api.delete(`/tutorials/${id}`);
};

export const getAdminTutorials = async (): Promise<ApiResponse<Tutorial[]>> => {
  return await api.get('/tutorials/admin/all');
};
