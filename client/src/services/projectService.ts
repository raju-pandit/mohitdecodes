import api from './api';
import { Project, ApiResponse } from '../types';

export const getProjects = async (params?: Record<string, any>): Promise<ApiResponse<Project[]>> => {
  return await api.get('/projects', { params });
};

export const getProject = async (slug: string): Promise<ApiResponse<Project>> => {
  return await api.get(`/projects/${slug}`);
};

export const createProject = async (data: Partial<Project>): Promise<ApiResponse<Project>> => {
  return await api.post('/projects', data);
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<ApiResponse<Project>> => {
  return await api.put(`/projects/${id}`, data);
};

export const deleteProject = async (id: string): Promise<ApiResponse<null>> => {
  return await api.delete(`/projects/${id}`);
};
