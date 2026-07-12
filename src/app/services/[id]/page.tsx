"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosSecure from '@/services/axiosSecure';
import toast from 'react-hot-toast';
import { 
  FiMapPin, 
  FiDollarSign, 
  FiFolder, 
  FiStar, 
  FiArrowLeft, 
  FiSend, 
  FiUser, 
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import Image from 'next/image';

interface Creator {
  _id: string;
  name: string;
  photoURL?: string;
  email?: string;
}

interface ServiceDetail {
  _id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  location: string;
  image: string;
  createdBy: Creator;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
}

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        // Using relative endpoint path matching our axiosSecure baseURL configuration
        const response = await axiosSecure.get(`services/${params.id}`);
        setService(response.data);
      } catch (error: any) {
        console.error('Failed to load gig details:', error);
        toast.error('Could not fetch gig details.');
        router.push('/services');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchServiceDetails();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Loading gig details...</span>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center py-10 px-4 space-y-4">
        <h3 className="text-xl font-bold text-text">Gig Not Found</h3>
        <Link href="/services" className="text-sm font-bold text-accent hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-text overflow-hidden relative">
      {/* Background Gradients & Grid Pattern */}
      <div className="absolute top-0 left-0 w-full h-[950px] bg-gradient-to-b from-brand-blue/40 via-brand-blue/15 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[950px] bg-grid-pattern -z-10 opacity-70 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Gig Details */}
          <div className="lg:col-span-2 space-y-8 text-left">
            
            {/* Title & Metadata */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-brand-blue/30 border border-brand-blue/50 px-3.5 py-1 rounded-full text-accent text-xs font-bold uppercase tracking-wider">
                <FiFolder className="w-3.5 h-3.5" />
                {service.category}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {service.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-1">
                  <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-slate-900">{service.rating || 5.0}</span>
                  <span>({service.reviewsCount || 12} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiMapPin className="w-4 h-4" />
                  <span>{service.location}</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-md">
              <Image 
                src={service.image} 
                alt={service.title} 
                fill 
                priority
                unoptimized={service.image.startsWith('http')}
                className="object-cover"
              />
            </div>

            {/* Description Scope */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Project Description & Scope</h2>
              </div>
              
              {/* Short summary block */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 text-sm font-bold text-slate-600 italic">
                "{service.shortDescription}"
              </div>

              {/* Full Description text */}
              <div className="text-slate-600 text-base leading-relaxed whitespace-pre-line font-medium space-y-4">
                {service.fullDescription}
              </div>
            </div>

            {/* Designer Card Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden relative border-2 border-slate-100 bg-slate-50">
                {service.createdBy.photoURL ? (
                  <img 
                    src={service.createdBy.photoURL} 
                    alt={service.createdBy.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(service.createdBy.name)}&background=E53935&color=fff`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-extrabold text-2xl">
                    {service.createdBy.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left flex-1 space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-extrabold text-slate-900 text-xl leading-none">{service.createdBy.name}</h3>
                  <FiCheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" title="Vetted Designer" />
                </div>
                <p className="text-sm font-medium text-slate-400">Vetted Professional Creative Designer</p>
                
                {/* Skills tags */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-2">
                  {["Figma", "User Interface", "Typography", "Interaction Design"].map((tag) => (
                    <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 p-8 shadow-lg shadow-slate-100/50 text-left space-y-6">
              
              {/* Hourly pricing */}
              <div className="space-y-1">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">HOURLY RATE</div>
                <div className="flex items-baseline gap-1 text-slate-900">
                  <FiDollarSign className="w-5 h-5 text-slate-400 self-center" />
                  <span className="text-4xl font-extrabold leading-none">{service.price}</span>
                  <span className="text-sm font-medium text-slate-500">/hr USD</span>
                </div>
              </div>

              {/* Work parameters */}
              <div className="border-y border-slate-100 py-4 space-y-3.5">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <FiClock className="w-4 h-4 text-slate-400" />
                  <span>24-48 hr Initial Concept Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <FiMapPin className="w-4 h-4 text-slate-400" />
                  <span>Based in {service.location}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <FiCheckCircle className="w-4 h-4 text-slate-400" />
                  <span>Unlimited Revisions capacity</span>
                </div>
              </div>

              {/* Order actions */}
              <button 
                onClick={() => {
                  toast.success(`Milestone query dispatched to ${service.createdBy.name}!`);
                }}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-secondary text-white rounded-2xl font-bold transition-all text-sm shadow-md shadow-primary/10 cursor-pointer"
              >
                <FiSend className="w-4 h-4" />
                Contact & Order Now
              </button>

              <p className="text-[10px] text-center text-slate-400 font-bold tracking-wider leading-relaxed">
                Legora holds payments securely in escrow. Release milestone funds only after satisfactory deliverables reviews.
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
