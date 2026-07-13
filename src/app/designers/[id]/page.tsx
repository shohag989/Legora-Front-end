"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosSecure from '@/services/axiosSecure';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  FiMapPin, 
  FiMail, 
  FiMessageSquare, 
  FiStar, 
  FiFolder, 
  FiLayers, 
  FiArrowLeft,
  FiBriefcase
} from 'react-icons/fi';
import Image from 'next/image';

interface PortfolioItem {
  title: string;
  image: string;
  description: string;
  tags?: string[];
}

interface DesignerDetail {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: string;
  bio?: string;
  skills?: string[];
  portfolio?: PortfolioItem[];
}

interface ServiceCardData {
  _id: string;
  title: string;
  category: string;
  shortDescription: string;
  price: number;
  image: string;
  rating?: number;
}

interface ReviewItem {
  _id: string;
  client: {
    name: string;
    photoURL?: string;
  };
  service: {
    title: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function DesignerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();
  
  const [designer, setDesigner] = useState<DesignerDetail | null>(null);
  const [services, setServices] = useState<ServiceCardData[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Fetch designer profile from public auth/user endpoint
        const profileRes = await axiosSecure.get(`auth/user/${id}`);
        const targetDesigner = profileRes.data;
        
        if (!targetDesigner) {
          toast.error("Designer profile not found.");
          router.push('/services');
          return;
        }
        setDesigner(targetDesigner);

        // Fetch services by this designer
        const servicesRes = await axiosSecure.get('services');
        const allServices = servicesRes.data?.services || [];
        const designerGigs = allServices.filter((s: any) => s.createdBy?._id === id);
        setServices(designerGigs);

        // Fetch reviews
        const reviewsRes = await axiosSecure.get(`reviews/designer/${id}`);
        setReviews(reviewsRes.data);
      } catch (err: any) {
        console.error('Error fetching designer details:', err);
        toast.error('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, router]);

  const handleStartChat = async () => {
    if (!user) {
      toast.error('Please log in to contact this designer.');
      router.push('/login');
      return;
    }

    if (user._id === id || user.id === id) {
      toast.error('You cannot message yourself.');
      return;
    }

    try {
      setMessageLoading(true);
      await axiosSecure.post('/chat/conversation', { recipientId: id });
      toast.success('Conversation initialized!');
      router.push('/dashboard/inbox');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to initialize conversation.');
    } finally {
      setMessageLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Loading designer profile...</span>
      </div>
    );
  }

  if (!designer) return null;

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  return (
    <div className="min-h-screen bg-slate-50 relative pb-16 font-sans text-slate-800">
      {/* Header Cover Background */}
      <div className="h-64 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
        <div className="absolute inset-0 bg-black/10" />
        <Link 
          href="/services" 
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold hover:bg-white/30 transition-all shadow-sm"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Contact card */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center h-fit">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
              {designer.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={designer.photoURL}
                  alt={designer.name}
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(designer.name)}&background=E53935&color=fff`;
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-3xl font-bold text-white uppercase">
                  {designer.name.charAt(0)}
                </div>
              )}
            </div>

            <h1 className="text-xl font-black text-slate-850 leading-tight mb-1">{designer.name}</h1>
            <p className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-3">Verified Designer</p>

            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-50/50 px-3 py-1.5 rounded-full border border-amber-100 mb-6">
              <FiStar className="fill-current w-4 h-4" />
              <span>{avgRating} ({totalReviews} reviews)</span>
            </div>

            <div className="w-full space-y-3.5 mb-6 text-left border-y border-slate-100 py-5">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-650">
                <FiMail className="w-4 h-4 text-indigo-500" />
                <span>{designer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-650">
                <FiMapPin className="w-4 h-4 text-indigo-500" />
                <span>Remote / Worldwide</span>
              </div>
            </div>

            <button
              onClick={handleStartChat}
              disabled={messageLoading}
              className="w-full flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3.5 text-xs font-bold transition-all shadow-md shadow-indigo-100 hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              <FiMessageSquare className="w-4 h-4" />
              Contact Designer
            </button>
          </div>

          {/* Right Columns: Bio, Portfolios, Gigs, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About & Skills */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-850">About the Designer</h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {designer.bio || "No biography provided by the designer yet."}
              </p>
              
              {designer.skills && designer.skills.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Core Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {designer.skills.map(skill => (
                      <span key={skill} className="text-[10px] font-bold text-slate-650 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/40">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio Grid */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-slate-850 flex items-center gap-2">
                <FiFolder className="text-indigo-500" />
                Design Work Portfolio
              </h2>
              {designer.portfolio && designer.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {designer.portfolio.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm group">
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 space-y-1.5">
                        <h3 className="text-xs font-extrabold text-slate-800">{item.title}</h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{item.description}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.tags.map(t => (
                              <span key={t} className="text-[9px] font-bold text-indigo-650 bg-indigo-50/50 px-2 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-2xl p-8 text-center text-xs font-bold text-slate-400">
                  No portfolio items listed yet.
                </div>
              )}
            </div>

            {/* Active Service Gigs */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-slate-850 flex items-center gap-2">
                <FiBriefcase className="text-indigo-500" />
                Active Service Listings
              </h2>
              {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map(gig => (
                    <Link 
                      key={gig._id} 
                      href={`/services/${gig._id}`}
                      className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div className="relative h-36 w-full bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={gig.image} 
                          alt={gig.title} 
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded w-fit block">{gig.category}</span>
                          <h3 className="text-xs font-extrabold text-slate-850 leading-snug line-clamp-1">{gig.title}</h3>
                          <p className="text-[11px] text-slate-500 font-semibold line-clamp-2 leading-relaxed">{gig.shortDescription}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                            <FiStar className="fill-current" />
                            <span>{gig.rating || "5.0"}</span>
                          </div>
                          <span className="text-xs font-black text-slate-850">${gig.price}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-2xl p-8 text-center text-xs font-bold text-slate-400">
                  No active gigs listed.
                </div>
              )}
            </div>

            {/* Client Reviews */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-slate-850 flex items-center gap-2">
                <FiLayers className="text-indigo-500" />
                Work Reviews
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-3.5">
                  {reviews.map(r => (
                    <div key={r._id} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 rounded-full overflow-hidden border border-slate-100">
                            {r.client.photoURL ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={r.client.photoURL}
                                alt={r.client.name}
                                className="object-cover h-full w-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.client.name)}&background=E53935&color=fff`;
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs font-bold text-white uppercase">
                                {r.client.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-850">{r.client.name}</h4>
                            <span className="text-[9px] text-slate-400 font-bold">Ordered: {r.service?.title || 'Gig Service'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold bg-amber-50/50 px-2 py-1 rounded">
                          <FiStar className="fill-current" />
                          <span>{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-650 font-semibold leading-relaxed">
                        "{r.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-2xl p-8 text-center text-xs font-bold text-slate-400">
                  No reviews submitted yet.
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
