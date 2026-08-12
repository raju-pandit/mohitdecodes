import api from './api';
import { Resource, ApiResponse } from '../types';

export const getResources = async (params?: Record<string, any>): Promise<ApiResponse<Resource[]>> => {
  return await api.get('/resources', { params });
};

export const getResource = async (id: string): Promise<ApiResponse<Resource>> => {
  return await api.get(`/resources/${id}`);
};

export const createResource = async (data: Partial<Resource>): Promise<ApiResponse<Resource>> => {
  return await api.post('/resources', data);
};

export const updateResource = async (id: string, data: Partial<Resource>): Promise<ApiResponse<Resource>> => {
  return await api.put(`/resources/${id}`, data);
};

export const deleteResource = async (id: string): Promise<ApiResponse<null>> => {
  return await api.delete(`/resources/${id}`);
};

export const downloadResource = async (id: string): Promise<ApiResponse<{ fileUrl: string }>> => {
  return await api.post(`/resources/${id}/download`);
};

export const getAdminResources = async (): Promise<ApiResponse<Resource[]>> => {
  return await api.get('/resources/admin/all');
};
