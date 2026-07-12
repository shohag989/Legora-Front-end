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
  FiUserCheck,
  FiTrash2,
  FiCheck,
  FiX
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
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
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

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setOrdersLoading(true);
      const endpoint = user.role === 'admin' 
        ? '/admin/orders' 
        : user.role === 'designer' 
        ? '/orders/designer' 
        : '/orders/client';
      const response = await axiosSecure.get(endpoint);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Could not load orders list.');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'accepted' | 'rejected') => {
    try {
      await axiosSecure.patch(`/orders/${orderId}`, { status });
      toast.success(`Order request has been ${status === 'accepted' ? 'accepted' : 'declined'} successfully.`);
      fetchOrders();
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status.');
    }
  };

  const handleAdminUpdateOrderStatus = async (orderId: string, status: 'accepted' | 'rejected' | 'pending') => {
    try {
      await axiosSecure.patch(`/admin/orders/${orderId}/status`, { status });
      toast.success(`Order request status updated to ${status}.`);
      fetchOrders();
    } catch (error: any) {
      console.error('Failed to update order status by admin:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status.');
    }
  };

  const handleAdminDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel and remove this order?")) return;
    try {
      await axiosSecure.delete(`/admin/orders/${orderId}`);
      toast.success("Order removed successfully.");
      fetchOrders();
    } catch (error: any) {
      console.error('Failed to delete order by admin:', error);
      toast.error(error.response?.data?.message || 'Failed to delete order.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
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
              
              {/* Designer Dashboard Sections */}
              {user.role === 'designer' && (
                <div className="space-y-6">
                  {/* Received Order Requests Block */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-md shadow-slate-100/50">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-brand-blue/30 rounded-xl border border-brand-blue/50 text-accent">
                          <FiShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900 leading-none">Received Order Requests</h2>
                          <span className="text-xs font-medium text-slate-400">Manage inbound orders from clients</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                        {orders.length} Requests
                      </span>
                    </div>

                    {ordersLoading ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold text-slate-400">Loading order requests...</span>
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-wider">
                              <th className="pb-3">Client</th>
                              <th className="pb-3">Gig / Service</th>
                              <th className="pb-3">Hourly Rate</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-600">
                            {orders.map((order) => (
                              <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full overflow-hidden relative bg-slate-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                      src={order.client?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.client?.name || 'Client')}&background=0F172A&color=fff`} 
                                      alt={order.client?.name}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-extrabold text-slate-900">{order.client?.name}</div>
                                    <div className="text-[10px] text-slate-400 font-bold">{order.client?.email}</div>
                                  </div>
                                </td>
                                <td className="py-4">
                                  {order.service ? (
                                    <Link href={`/services/${order.service._id}`} className="hover:underline font-extrabold text-slate-800">
                                      {order.service.title}
                                    </Link>
                                  ) : (
                                    <span className="text-slate-450 italic font-semibold">Deleted Gig</span>
                                  )}
                                </td>
                                <td className="py-4 text-slate-900 font-extrabold">
                                  {order.service ? `$${order.service.price}/hr` : 'N/A'}
                                </td>
                                <td className="py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                                    order.status === 'accepted' 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                      : order.status === 'rejected' 
                                      ? 'bg-red-50 text-red-700 border-red-200' 
                                      : 'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}>
                                    {order.status === 'accepted' ? 'Accepted' : order.status === 'rejected' ? 'Declined' : 'Pending'}
                                  </span>
                                </td>
                                <td className="py-4 text-right">
                                  {order.status === 'pending' ? (
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => handleUpdateOrderStatus(order._id, 'accepted')}
                                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-sm"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => handleUpdateOrderStatus(order._id, 'rejected')}
                                        className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-sm"
                                      >
                                        Decline
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-400 font-bold italic">Resolved</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 font-medium py-4">No order requests received yet.</p>
                    )}
                  </div>

                  {/* Designer Gigs Block */}
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
                            You haven&apos;t posted any services to the marketplace. Publish your first gig to start onboarding clients.
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
                </div>
              )}

              {/* Visitor Orders Block */}
              {user.role === 'visitor' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-md shadow-slate-100/50 min-h-[480px] flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
                        <FiShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-none">Recent Orders</h2>
                        <span className="text-xs font-medium text-slate-400">Track active deliverables and design progress</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                      {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                    </span>
                  </div>

                  {ordersLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-slate-400">Loading your orders...</span>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-wider">
                            <th className="pb-3">Designer</th>
                            <th className="pb-3">Gig / Service</th>
                            <th className="pb-3">Hourly Rate</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-600">
                          {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full overflow-hidden relative bg-slate-100">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={order.designer?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.designer?.name || 'Designer')}&background=E53935&color=fff`} 
                                    alt={order.designer?.name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900">{order.designer?.name}</div>
                                  <div className="text-[10px] text-slate-400 font-bold">{order.designer?.email}</div>
                                </div>
                              </td>
                              <td className="py-4">
                                {order.service ? (
                                  <Link href={`/services/${order.service._id}`} className="hover:underline font-extrabold text-slate-800">
                                    {order.service.title}
                                  </Link>
                                ) : (
                                  <span className="text-slate-450 italic font-semibold">Deleted Gig</span>
                                )}
                              </td>
                              <td className="py-4 text-slate-900 font-extrabold">
                                {order.service ? `$${order.service.price}/hr` : 'N/A'}
                              </td>
                              <td className="py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                                  order.status === 'accepted' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : order.status === 'rejected' 
                                    ? 'bg-red-50 text-red-700 border-red-200' 
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {order.status === 'accepted' ? 'Order Placed' : order.status === 'rejected' ? 'Declined' : 'Pending Approval'}
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                {order.service && (
                                  <Link href={`/services/${order.service._id}`}>
                                    <button className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-sm">
                                      View Gig
                                    </button>
                                  </Link>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* EmptyState Component */
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 space-y-6">
                      <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 relative">
                        <FiShoppingBag className="w-10 h-10" />
                        <div className="absolute top-1 right-1 w-4.5 h-4.5 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px] text-slate-500 font-bold">
                          0
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-extrabold text-slate-800 text-lg">You haven&apos;t placed any orders yet.</h3>
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
                  )}
                </div>
              )}

              {/* Admin Orders Management Block */}
              {user.role === 'admin' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-md shadow-slate-100/50 min-h-[480px] flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-150 text-indigo-600">
                        <FiShoppingBag className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-none">Global Orders Registry</h2>
                        <span className="text-xs font-medium text-slate-400">Track and manage recent transactions across the platform</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-750 bg-indigo-55/40 px-3 py-1 rounded-full border border-indigo-100">
                      {orders.length} Active Orders
                    </span>
                  </div>

                  {ordersLoading ? (
                     <div className="flex flex-col items-center justify-center py-20 gap-3">
                       <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                       <span className="text-xs font-bold text-slate-400">Loading order database...</span>
                     </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order._id} className="bg-slate-50/40 border border-slate-200/80 rounded-3xl p-6 md:p-8 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-300 transition-all duration-350 relative text-left group flex flex-col gap-6">
                          
                          {/* Top Row: Order ID & Date & Delete Button */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100/80 pb-4">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Order #{order._id.slice(-6).toUpperCase()}
                              </span>
                              <span className="w-1.5 h-1.5 bg-slate-200 rounded-full hidden sm:block" />
                              <span className="text-xs font-semibold text-slate-505">
                                Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* Status Badge */}
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                order.status === 'accepted' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/5' 
                                  : order.status === 'rejected' 
                                  ? 'bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-500/5' 
                                  : 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-500/5 animate-pulse'
                              }`}>
                                {order.status === 'accepted' ? 'Order Placed' : order.status === 'rejected' ? 'Declined' : 'Pending Approval'}
                              </span>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleAdminDeleteOrder(order._id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                title="Delete Order"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Connected User Flow Row */}
                          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-white border border-slate-200/50 rounded-3xl p-5 md:p-6 shadow-sm relative">
                            {/* Client Block */}
                            <div className="md:col-span-4 flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-full overflow-hidden relative bg-slate-100 border border-slate-200 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={order.client?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.client?.name || 'Client')}&background=0F172A&color=fff`} 
                                  alt={order.client?.name}
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(order.client?.name || 'Client')}&background=0F172A&color=fff`;
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">Buyer Client</div>
                                <div className="font-extrabold text-slate-900 text-sm truncate">{order.client?.name || 'Deleted User'}</div>
                                <div className="text-[10px] text-slate-400 font-bold truncate">{order.client?.email}</div>
                              </div>
                            </div>

                            {/* Connector Arrow */}
                            <div className="md:col-span-3 flex flex-col items-center justify-center py-2 md:py-0">
                              <svg className="w-8 h-8 text-slate-300 md:rotate-0 rotate-90 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </div>

                            {/* Designer Block */}
                            <div className="md:col-span-4 flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-full overflow-hidden relative bg-slate-100 border border-slate-200 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={order.designer?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.designer?.name || 'Designer')}&background=E53935&color=fff`} 
                                  alt={order.designer?.name}
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(order.designer?.name || 'Designer')}&background=E53935&color=fff`;
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[9px] font-black text-accent uppercase tracking-widest mb-0.5">Seller Designer</div>
                                <div className="font-extrabold text-slate-900 text-sm truncate">{order.designer?.name || 'Deleted Designer'}</div>
                                <div className="text-[10px] text-slate-400 font-bold truncate">{order.designer?.email}</div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row: Gig & Administrative Status Controls */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/80 border border-slate-200/40 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-450 shrink-0">
                                <FiLayers className="w-5 h-5 text-slate-500" />
                              </div>
                              <div>
                                {order.service ? (
                                  <Link href={`/services/${order.service._id}`} className="hover:underline font-extrabold text-slate-800 text-sm block">
                                    {order.service.title}
                                  </Link>
                                ) : (
                                  <span className="text-slate-450 italic font-semibold text-sm block">Deleted Gig Listing</span>
                                )}
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {order.service ? `Hourly Rate: $${order.service.price}/hr` : 'Rate: N/A'}
                                </span>
                              </div>
                            </div>

                            {/* Admin Custom Button Controllers */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 hidden md:block">
                                Admin Control:
                              </span>
                              {order.status === 'pending' ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleAdminUpdateOrderStatus(order._id, 'accepted')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/10 cursor-pointer border border-emerald-600/10 hover:-translate-y-0.5 active:translate-y-0"
                                  >
                                    <FiCheck className="w-3.5 h-3.5" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleAdminUpdateOrderStatus(order._id, 'rejected')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                                  >
                                    <FiX className="w-3.5 h-3.5" />
                                    Decline
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xs text-slate-400 font-bold italic">Override:</span>
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleAdminUpdateOrderStatus(order._id, e.target.value as any)}
                                    className="block rounded-lg border border-slate-300 bg-white py-1.5 px-2.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer hover:border-slate-400 transition-colors"
                                  >
                                    <option value="pending">Set Pending</option>
                                    <option value="accepted">Set Accepted</option>
                                    <option value="rejected">Set Rejected</option>
                                  </select>
                                </div>
                              )}
                            </div>

                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 font-medium py-4">No orders placed on the platform yet.</p>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
