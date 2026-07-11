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
      router.push('/services');
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, photoURL?: string) => {
    try {
      setLoading(true);
      const response = await axiosSecure.post('/auth/register', { name, email, password, photoURL });
      const { token, ...userData } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('legora_token', token);
      }
      setUser(userData);
      toast.success('Registered successfully!');
      router.push('/services');
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (token: string) => {
    try {
      setLoading(true);
      const response = await axiosSecure.post('/auth/google', { token });
      const { token: jwtToken, ...userData } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('legora_token', jwtToken);
      }
      setUser(userData);
      toast.success('Logged in with Google!');
      router.push('/services');
    } catch (error: any) {
      console.error('Google login error:', error);
      const message = error.response?.data?.message || 'Google login failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
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
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
