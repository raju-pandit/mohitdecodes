import api from './api';
import { Blog, ApiResponse } from '../types';

export const getBlogs = async (params?: Record<string, any>): Promise<ApiResponse<Blog[]>> => {
  return await api.get('/blogs', { params });
};

export const getBlog = async (slug: string): Promise<ApiResponse<Blog>> => {
  return await api.get(`/blogs/${slug}`);
};

export const createBlog = async (data: Partial<Blog>): Promise<ApiResponse<Blog>> => {
  return await api.post('/blogs', data);
};

export const updateBlog = async (id: string, data: Partial<Blog>): Promise<ApiResponse<Blog>> => {
  return await api.put(`/blogs/${id}`, data);
};

export const deleteBlog = async (id: string): Promise<ApiResponse<null>> => {
  return await api.delete(`/blogs/${id}`);
};

export const addComment = async (id: string, data: any): Promise<ApiResponse<Blog>> => {
  return await api.post(`/blogs/${id}/comment`, data);
};

export const toggleSaveBlog = async (id: string): Promise<ApiResponse<null>> => {
  return await api.post(`/blogs/${id}/save`);
};

export const getAdminBlogs = async (): Promise<ApiResponse<Blog[]>> => {
  return await api.get('/blogs/admin/all');
};
