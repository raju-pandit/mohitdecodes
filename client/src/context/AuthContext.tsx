import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ApiResponse } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<ApiResponse<{ user: User; token: string }>>;
  register: (name: string, email: string, password: string) => Promise<ApiResponse<{ user: User; token: string }>>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  googleAuth: (credential: string) => Promise<ApiResponse<{ user: User; token: string }>>;
  socialLogin: (name: string, email: string, avatar: string, provider: string) => Promise<ApiResponse<{ user: User; token: string }>>;
  signupSms: (name: string, phone: string) => Promise<ApiResponse<{ user: User; token: string }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.data.user);
        } catch (error) {
          console.error('Failed to load user', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    const token = res.token || (res as any).data?.token;
    const userData = res.data?.user || (res as any).user;
    if (token) {
      localStorage.setItem('token', token);
    }
    if (userData) {
      setUser(userData);
    }
    return res;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authService.register(name, email, password);
    const token = res.token || (res as any).data?.token;
    const userData = res.data?.user || (res as any).user;
    if (token) {
      localStorage.setItem('token', token);
    }
    if (userData) {
      setUser(userData);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const googleAuth = async (credential: string) => {
    const res = await authService.googleLogin(credential);
    const token = res.token || (res as any).data?.token;
    const userData = res.data?.user || (res as any).user;
    if (token) {
      localStorage.setItem('token', token);
    }
    if (userData) {
      setUser(userData);
    }
    return res;
  };

  const socialLogin = async (name: string, email: string, avatar: string, provider: string) => {
    const res = await authService.socialLogin(name, email, avatar, provider);
    const token = res.token || (res as any).data?.token;
    const userData = res.data?.user || (res as any).user;
    if (token) {
      localStorage.setItem('token', token);
    }
    if (userData) {
      setUser(userData);
    }
    return res;
  };

  const signupSms = async (name: string, phone: string) => {
    const res = await authService.signupSms(name, phone);
    const token = res.token || (res as any).data?.token;
    const userData = res.data?.user || (res as any).user;
    if (token) {
      localStorage.setItem('token', token);
    }
    if (userData) {
      setUser(userData);
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, googleAuth, socialLogin, signupSms }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
