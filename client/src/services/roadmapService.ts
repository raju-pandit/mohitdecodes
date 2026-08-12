import api from './api';
import { Roadmap, ApiResponse } from '../types';

export const getRoadmaps = async (params?: Record<string, any>): Promise<ApiResponse<Roadmap[]>> => {
  return await api.get('/roadmaps', { params });
};

export const getRoadmap = async (slug: string): Promise<ApiResponse<Roadmap>> => {
  return await api.get(`/roadmaps/${slug}`);
};

export const createRoadmap = async (data: Partial<Roadmap>): Promise<ApiResponse<Roadmap>> => {
  return await api.post('/roadmaps', data);
};

export const updateRoadmap = async (id: string, data: Partial<Roadmap>): Promise<ApiResponse<Roadmap>> => {
  return await api.put(`/roadmaps/${id}`, data);
};

export const deleteRoadmap = async (id: string): Promise<ApiResponse<null>> => {
  return await api.delete(`/roadmaps/${id}`);
};

export const updateProgress = async (id: string, stepId: string, completed: boolean): Promise<ApiResponse<null>> => {
  return await api.put(`/roadmaps/${id}/progress`, { stepId, completed });
};
