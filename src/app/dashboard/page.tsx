"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { Button } from '@/components/ui/Button';
import axiosSecure from '@/services/axiosSecure';
import toast from 'react-hot-toast';
import { 
  FiUser, 
  FiImage, 
  FiSettings, 
  FiPlus, 
  FiShoppingBag, 
  FiLayers, 
  FiInfo, 
  FiArrowRight, 
  FiUserCheck 
} from 'react-icons/fi';
import Link from 'next/link';
import { uploadImage } from '@/utils/uploadImage';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  photoURL: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ServiceItem {
  _id: string;
  title: string;
  category: string;
  shortDescription: string;
  price: number;
  location: string;
  image: string;
  createdBy: {
    name: string;
    photoURL?: string;
  };
}

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const [myServices, setMyServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      photoURL: user?.photoURL || '',
    }
  });

  const watchedPhotoURL = watch('photoURL') || '';

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const url = await uploadImage(file);
      setValue('photoURL', url);
      toast.success('Avatar uploaded successfully! Save changes to update your profile.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Image upload failed.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Sync default values when user loads
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('photoURL', user.photoURL || '');
    }
  }, [user, setValue]);

  // Fetch designer gigs if role === designer
  useEffect(() => {
    if (user && user.role === 'designer') {
      const fetchMyServices = async () => {
        try {
          setServicesLoading(true);
          try {
            const response = await axiosSecure.get('services/my-services');
            setMyServices(response.data);
          } catch (apiError: any) {
            // Fallback if my-services endpoint is not yet deployed on the remote server
            if (apiError.response?.status === 404) {
              console.log('my-services endpoint not deployed, falling back to local filtering of all services');
              const response = await axiosSecure.get('services');
              const allServices = response.data?.services || [];
              const userGigs = allServices.filter((s: any) => 
                s.createdBy?._id === user._id || 
                s.createdBy?._id === user.id ||
                s.createdBy?.name === user.name
              );
              setMyServices(userGigs);
            } else {
              throw apiError;
            }
          }
        } catch (error) {
          console.error('Failed to fetch user services:', error);
          toast.error('Could not load your gigs list.');
        } finally {
          setServicesLoading(false);
        }
      };
      fetchMyServices();
    }
  }, [user]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      const response = await axiosSecure.put('auth/profile', {
        name: data.name,
        photoURL: data.photoURL || undefined
      });
      
      // Update global context state
      updateUser({
        name: response.data.name,
        photoURL: response.data.photoURL
      });

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      const message = error.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background font-sans text-text overflow-hidden relative">
        {/* Background Gradients & Grid Pattern */}
        <div className="absolute top-0 left-0 w-full h-[950px] bg-gradient-to-b from-brand-blue/45 via-brand-blue/15 to-transparent -z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[950px] bg-grid-pattern -z-10 opacity-75 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          
          {/* Welcome Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Welcome back, <span className="text-accent">{user.name}</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Manage your credentials, update your designer profile, or view client order workflows.
              </p>
            </div>
            
            {user.role === 'designer' && (
              <Link href="/services/add">
                <Button className="flex items-center gap-2 px-6 py-3.5 bg-primary hover:bg-secondary text-white rounded-full font-bold text-sm shadow-md shadow-primary/10">
                  <FiPlus className="w-4 h-4" />
                  Add New Gig
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Section A: Edit Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-md shadow-slate-100/50">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
                    <FiSettings className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-none">Edit Profile</h2>
                    <span className="text-xs font-medium text-slate-400">Update account credentials</span>
                  </div>
                </div>

                {/* Avatar Preview */}
                <div className="flex flex-col items-center mb-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 hover:border-[#E53935] relative bg-slate-50 mb-3 cursor-pointer group transition-all duration-300 shadow-sm"
                    title="Click to change avatar"
                  >
                    {watchedPhotoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={watchedPhotoURL} 
                        alt={user.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E53935&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-extrabold text-3xl">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Hover Camera Icon Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <FiImage className="text-white w-6 h-6" />
                    </div>

                    {/* Upload spinner */}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#E53935] hover:underline mb-1"
                  >
                    Upload Avatar Image
                  </button>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role} Account</span>
                </div>

                <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label htmlFor="profile-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      DISPLAY NAME
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiUser className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="profile-name"
                        type="text"
                        {...register('name')}
                        className={`block w-full rounded-xl border ${
                          errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                        } bg-slate-50/40 py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-semibold`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Hidden Photo URL field (kept in form state) */}
                  <input type="hidden" {...register('photoURL')} />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center items-center px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all text-xs shadow-sm cursor-pointer"
                    >
                      {isSubmitting ? 'Saving changes...' : 'Save Profile'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Section B: Role-Based Activity Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Designer Gigs Block */}
              {user.role === 'designer' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-md shadow-slate-100/50 min-h-[480px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
                        <FiLayers className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-none">My Gigs / Services</h2>
                        <span className="text-xs font-medium text-slate-400">Total active listings in the marketplace</span>
                      </div>
                    </div>
                    
                    <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                      {myServices.length} {myServices.length === 1 ? 'Gig' : 'Gigs'}
                    </span>
                  </div>

                  {servicesLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <div className="w-8 h-8 border-3 border-[#E53935] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-slate-400">Loading active services...</span>
                    </div>
                  ) : myServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myServices.map((service) => (
                        <ServiceCard
                          key={service._id}
                          title={service.title}
                          designerName={user.name}
                          price={`$${service.price}/hr`}
                          rating={5.0}
                          location={service.location}
                          imageUrl={service.image}
                          avatarUrl={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E53935&color=fff`}
                          href={`/services/edit/${service._id}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-6">
                      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <FiLayers className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-800 text-base">No services listed yet</h3>
                        <p className="text-xs text-slate-400 font-medium max-w-sm">
                          You haven't posted any services to the marketplace. Publish your first gig to start onboarding clients.
                        </p>
                      </div>
                      <Link href="/services/add">
                        <Button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-secondary text-white rounded-full font-bold text-xs shadow-sm">
                          <FiPlus className="w-3.5 h-3.5" />
                          Publish First Gig
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Visitor Orders Block */}
              {user.role === 'visitor' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-md shadow-slate-100/50 min-h-[480px] flex flex-col">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
                      <FiShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-none">Recent Orders</h2>
                      <span className="text-xs font-medium text-slate-400">Track active deliverables and design progress</span>
                    </div>
                  </div>

                  {/* EmptyState Component */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 relative">
                      <FiShoppingBag className="w-10 h-10" />
                      <div className="absolute top-1 right-1 w-4.5 h-4.5 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px] text-slate-500 font-bold">
                        0
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-slate-800 text-lg">You haven't placed any orders yet.</h3>
                      <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                        Search and discover top designer portfolios in our vetted creative marketplace. Initiate orders to begin collaborating.
                      </p>
                    </div>

                    <Link href="/services">
                      <Button className="flex items-center gap-2 px-6 py-3.5 bg-primary hover:bg-secondary text-white rounded-full font-bold text-sm shadow-md shadow-primary/10">
                        Explore Designers
                        <FiArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
