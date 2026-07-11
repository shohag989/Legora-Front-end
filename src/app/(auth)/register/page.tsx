"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { FiUser, FiMail, FiLock, FiImage, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  photoURL: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, googleLogin, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      photoURL: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data.name, data.email, data.password, data.photoURL || undefined);
    } catch (err) {
      // Error is toasted inside AuthProvider
    }
  };

  const handleGoogleSignIn = () => {
    if (typeof window !== 'undefined' && (window as any).google) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: '926884022510-qmal4mnr9fst53jmsu5ngt89qraeftf1.apps.googleusercontent.com',
          scope: 'openid email profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              await googleLogin(tokenResponse.access_token);
            }
          },
        });
        client.requestAccessToken();
      } catch (err) {
        console.error('Google token initialization error:', err);
        toast.error('Google Sign-In initialization failed');
      }
    } else {
      toast.error('Google library is still loading. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-text flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Gradients & Matrix Patterns */}
      <div className="absolute top-0 left-0 w-full h-[950px] bg-gradient-to-b from-brand-blue/40 via-brand-blue/15 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[950px] bg-grid-pattern -z-10 opacity-70 pointer-events-none" />
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Centered White Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-[32px] border border-border p-8 md:p-14 max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10"
      >
        
        {/* Left Column: Doodle Visual (Login and registration.webm) */}
        <div className="flex justify-center w-full relative">
          {/* Background Soft Glow */}
          <div className="absolute w-64 h-64 bg-gradient-to-tr from-brand-blue to-accent/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
          
          <div className="w-full max-w-sm aspect-square flex items-center justify-center overflow-hidden">
            <video 
              src="/assets/Animation/Login%20and%20registration.webm" 
              loop 
              muted 
              autoPlay 
              playsInline 
              className="w-full h-full object-contain mix-blend-multiply relative z-10"
            />
          </div>
        </div>

        {/* Right Column: details and form */}
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Create an account
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm font-semibold">
              Enter your details below to join our vetted creative designer workspace.
            </p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl bg-white py-3 px-4 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <FcGoogle className="w-4 h-4" />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl bg-white py-3 px-4 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <FaGithub className="w-4 h-4" />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 font-bold tracking-wider uppercase">
              OR REGISTER WITH EMAIL
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            
            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                FULL NAME
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiUser className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className={`block w-full rounded-xl border ${
                    errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                  } bg-slate-50/40 py-3.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-semibold`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.name.message}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiMail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`block w-full rounded-xl border ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                  } bg-slate-50/40 py-3.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-semibold`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`block w-full rounded-xl border ${
                    errors.password ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                  } bg-slate-50/40 py-3.5 pl-10 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-semibold`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* PhotoURL field */}
            <div>
              <label htmlFor="photoURL" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                PROFILE PHOTO URL (OPTIONAL)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiImage className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="photoURL"
                  type="text"
                  {...register('photoURL')}
                  className={`block w-full rounded-xl border ${
                    errors.photoURL ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                  } bg-slate-50/40 py-3.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-semibold`}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              {errors.photoURL && (
                <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.photoURL.message}</p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full flex justify-center items-center px-6 py-3.5 bg-primary hover:bg-secondary text-white rounded-full font-bold transition-all text-sm shadow-md shadow-primary/10"
              >
                {isSubmitting || loading ? 'Creating Account...' : 'Register'}
              </Button>
            </div>

          </form>

          <p className="text-center text-xs text-slate-500 font-bold pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:text-accent/80 font-black transition-colors">
              Sign In
            </Link>
          </p>
        </div>

      </motion.div>

    </div>
  );
}
