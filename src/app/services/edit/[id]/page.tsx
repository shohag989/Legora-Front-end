"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosSecure from '@/services/axiosSecure';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import {
  FiFileText,
  FiDollarSign,
  FiFolder,
  FiMapPin,
  FiImage,
  FiArrowLeft,
  FiEdit3,
} from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { uploadImage } from '@/utils/uploadImage';

const serviceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(80, 'Title must be under 80 characters'),
  category: z.enum(['UI Design', 'Mobile Design', 'Dashboard', 'SaaS', 'E-commerce', 'Brand Identity'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  price: z.number().min(5, 'Price must be at least $5/hr').max(999, 'Price must be under $999/hr'),
  shortDescription: z
    .string()
    .min(10, 'Short description must be at least 10 characters')
    .max(100, 'Short description cannot exceed 100 characters'),
  fullDescription: z.string().min(20, 'Full description must be at least 20 characters'),
  location: z.string().min(3, 'Location is required'),
  coverImageUrl: z.string().url('Please upload a valid cover image'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const categories = ['UI Design', 'Mobile Design', 'Dashboard', 'SaaS', 'E-commerce', 'Brand Identity'];

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
  });

  const watchedCoverUrl = watch('coverImageUrl') || '';

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingCover(true);
      const url = await uploadImage(file);
      setValue('coverImageUrl', url);
      toast.success('Cover image uploaded!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Image upload failed.');
    } finally {
      setUploadingCover(false);
    }
  };

  // Preload gig data
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`services/${id}`);
        const data = response.data;
        setValue('title', data.title);
        setValue('category', data.category);
        setValue('price', data.price);
        setValue('shortDescription', data.shortDescription);
        setValue('fullDescription', data.fullDescription);
        setValue('location', data.location);
        setValue('coverImageUrl', data.image);
      } catch (error: any) {
        console.error('Failed to load gig data for editing:', error);
        toast.error('Could not pre-load gig details.');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchServiceData();
    }
  }, [id, setValue, router]);

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      const payload = {
        title: data.title,
        category: data.category,
        price: data.price,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        location: data.location,
        image: data.coverImageUrl,
      };
      await axiosSecure.put(`services/${id}`, payload);
      toast.success('Gig updated successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Service update error:', error);
      const message = error.response?.data?.message || 'Failed to update gig. Please try again.';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['designer']}>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-400">Loading gig data...</span>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['designer']}>
      <div className="min-h-screen bg-background font-sans text-text overflow-hidden relative">

        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[950px] bg-gradient-to-b from-brand-blue/40 via-brand-blue/15 to-transparent -z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[950px] bg-grid-pattern -z-10 opacity-70 pointer-events-none" />
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">

          {/* Header navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#E53935]/15 border border-[#E53935]/30 px-4 py-1.5 rounded-full text-[#E53935] text-xs font-bold uppercase tracking-wider">
                <FiEdit3 className="w-3.5 h-3.5" />
                Update Listing
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Edit your <span className="text-accent">gig.</span>
              </h1>
              <p className="text-base text-slate-500 leading-relaxed max-w-xl font-medium">
                Modify pricing tiers, project summaries, visual covers, or detailed scopes of work.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl border border-border p-8 md:p-10 shadow-lg shadow-slate-100/50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Title */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      GIG TITLE
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiFileText className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="title"
                        type="text"
                        {...register('title')}
                        className={`block w-full rounded-xl border ${
                          errors.title ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                        } bg-slate-50/40 py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-semibold`}
                        placeholder="e.g., Premium UI/UX Design for SaaS Dashboards"
                      />
                    </div>
                    {errors.title && (
                      <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      CATEGORY
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiFolder className="h-5 w-5 text-slate-400" />
                      </div>
                      <select
                        id="category"
                        {...register('category')}
                        className={`block w-full rounded-xl border ${
                          errors.category ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                        } bg-slate-50/40 py-3 pl-10 pr-3 text-slate-900 focus:outline-none focus:ring-2 sm:text-sm transition-all cursor-pointer font-bold`}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.category && (
                      <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      HOURLY RATE (USD)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiDollarSign className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="price"
                        type="number"
                        {...register('price', { valueAsNumber: true })}
                        className={`block w-full rounded-xl border ${
                          errors.price ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                        } bg-slate-50/40 py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-semibold`}
                        placeholder="e.g., 50"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.price.message}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      LOCATION
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiMapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="location"
                        type="text"
                        {...register('location')}
                        className={`block w-full rounded-xl border ${
                          errors.location ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                        } bg-slate-50/40 py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-semibold`}
                        placeholder="e.g., London, UK (or Remote)"
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.location.message}</p>
                    )}
                  </div>

                  {/* Cover Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      COVER IMAGE
                    </label>
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
                      <input
                        ref={coverFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                      <input type="hidden" {...register('coverImageUrl')} />

                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Replace cover image</p>
                          <p className="text-xs text-slate-500">PNG, JPG, or WebP files are supported.</p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => coverFileInputRef.current?.click()}
                          disabled={uploadingCover}
                          className="w-full md:w-auto rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                        >
                          {uploadingCover ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                              Uploading...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <FiImage className="w-4 h-4" />
                              Upload Image
                            </span>
                          )}
                        </Button>
                      </div>

                      {watchedCoverUrl ? (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 relative h-48">
                          <Image src={watchedCoverUrl} alt="Cover preview" fill className="object-cover" unoptimized />
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-slate-400 italic">No cover image loaded yet.</p>
                      )}

                      {errors.coverImageUrl && (
                        <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.coverImageUrl.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="md:col-span-2">
                    <label htmlFor="shortDescription" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      SHORT SUMMARY (MAX 100 CHARS)
                    </label>
                    <textarea
                      id="shortDescription"
                      rows={2}
                      {...register('shortDescription')}
                      maxLength={100}
                      className={`block w-full rounded-xl border ${
                        errors.shortDescription ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                      } bg-slate-50/40 py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-semibold`}
                      placeholder="e.g., Visual identity consulting and guidelines booklets for Series-A start-ups..."
                    />
                    {errors.shortDescription && (
                      <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.shortDescription.message}</p>
                    )}
                  </div>

                  {/* Full Description */}
                  <div className="md:col-span-2">
                    <label htmlFor="fullDescription" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      DETAILED SCOPE / DESCRIPTION
                    </label>
                    <textarea
                      id="fullDescription"
                      rows={6}
                      {...register('fullDescription')}
                      className={`block w-full rounded-xl border ${
                        errors.fullDescription ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-accent focus:ring-accent/30'
                      } bg-slate-50/40 py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-semibold`}
                      placeholder="Detail your workflow, scoping terms, standard packages, revisions capacity, and software specializations..."
                    />
                    {errors.fullDescription && (
                      <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.fullDescription.message}</p>
                    )}
                  </div>

                </div>

                <div className="pt-4 flex gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex justify-center items-center px-8 py-3.5 bg-primary hover:bg-secondary text-white rounded-full font-bold transition-all text-sm shadow-md shadow-primary/10 cursor-pointer"
                  >
                    {isSubmitting ? 'Updating Gig...' : 'Save Changes'}
                  </Button>

                  <Link href="/dashboard">
                    <button
                      type="button"
                      className="px-6 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full font-bold transition-all text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  </Link>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
