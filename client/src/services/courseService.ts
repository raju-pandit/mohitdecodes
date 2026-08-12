import api from './api';
import { Course, ApiResponse } from '../types';

export const getCourses = async (params?: Record<string, any>): Promise<ApiResponse<Course[]>> => {
  return await api.get('/courses', { params });
};

export const getCourse = async (slug: string): Promise<ApiResponse<Course>> => {
  return await api.get(`/courses/${slug}`);
};

export const createCourse = async (data: Partial<Course>): Promise<ApiResponse<Course>> => {
  return await api.post('/courses', data);
};

export const updateCourse = async (id: string, data: Partial<Course>): Promise<ApiResponse<Course>> => {
  return await api.put(`/courses/${id}`, data);
};

export const deleteCourse = async (id: string): Promise<ApiResponse<null>> => {
  return await api.delete(`/courses/${id}`);
};

export const enrollCourse = async (id: string): Promise<ApiResponse<null>> => {
  return await api.post(`/courses/${id}/enroll`);
};

export const getAdminCourses = async (): Promise<ApiResponse<Course[]>> => {
  return await api.get('/courses/admin/all');
};
