import api from './api';
import { ApiResponse } from '../types';

export const globalSearch = async (q: string): Promise<ApiResponse<any>> => {
  return await api.get('/search', { params: { q } });
};
