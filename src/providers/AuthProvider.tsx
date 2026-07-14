"use client";

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosSecure from '@/services/axiosSecure';
import { User, AuthContextType } from '@/types/auth';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Dynamically load Google Client library if not already present
    if (typeof window !== 'undefined' && !(window as any).google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const fetchUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('legora_token') : null;
      if (token) {
        try {
          const response = await axiosSecure.get('/auth/me');
          // Backend returns the user object directly, which has _id, name, email, role, photoURL
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('legora_token');
          }
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axiosSecure.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('legora_token', token);
      }
      setUser(userData);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, photoURL?: string, role?: string) => {
    try {
      setLoading(true);
      const response = await axiosSecure.post('/auth/register', { name, email, password, photoURL, role });
      const { token, ...userData } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('legora_token', token);
      }
      setUser(userData);
      toast.success('Registered successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (token: string, role?: string) => {
    try {
      setLoading(true);
      const response = await axiosSecure.post('/auth/google', { token, role });
      const { token: jwtToken, ...userData } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('legora_token', jwtToken);
      }
      setUser(userData);
      toast.success('Logged in with Google!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google login error:', error);
      const message = error.response?.data?.message || 'Google login failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('legora_token');
    }
    setUser(null);
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
