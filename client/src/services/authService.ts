import api from './api';
import { User, ApiResponse } from '../types';

export const register = async (name: string, email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
  return await api.post('/auth/register', { name, email, password });
};

export const login = async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
  return await api.post('/auth/login', { email, password });
};

export const logout = async (): Promise<ApiResponse<null>> => {
  return await api.post('/auth/logout');
};

export const getMe = async (): Promise<ApiResponse<{ user: User }>> => {
  return await api.get('/auth/me');
};

export const forgotPassword = async (email: string): Promise<ApiResponse<null>> => {
  return await api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, password: string): Promise<ApiResponse<null>> => {
  return await api.post(`/auth/reset-password/${token}`, { password });
};

export const updateProfile = async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
  return await api.put('/auth/update-profile', data);
};

export const googleLogin = async (credential: string): Promise<ApiResponse<{ user: User; token: string }>> => {
  return await api.post('/auth/google', { credential });
};

export const socialLogin = async (name: string, email: string, avatar: string, provider: string): Promise<ApiResponse<{ user: User; token: string }>> => {
  return await api.post('/auth/social-login', { name, email, avatar, provider });
};
