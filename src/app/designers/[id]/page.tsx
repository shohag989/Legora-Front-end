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
        const profileRes = await axiosSecure.get(`auth/user/${id}`);
        setDesigner(profileRes.data);

        // Fetch services by designer
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
      await axiosSecure.post('chat/conversation', { recipientId: id });
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing Profile...</span>
      </div>
    );
  }

  if (!designer) return null;

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  return (
    <div className="min-h-screen bg-white relative pb-24 font-sans text-slate-900 text-left">
      
      {/* Structural Minimalist Header Cover */}
      <div className="h-52 w-full bg-slate-50 border-b border-slate-200/40 relative">
        <Link 
          href="/services" 
          className="absolute left-8 top-8 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 hover:border-slate-350 text-slate-600 transition-all shadow-sm z-30"
          title="Back to Directory"
        >
          <FiArrowLeft className="w-4.5 h-4.5" />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Sidebar (col-span-4): Portrait info details */}
          <div className="lg:col-span-4 bg-white border border-slate-200/70 rounded-[28px] p-6 shadow-sm flex flex-col items-center text-center h-fit">
            
            {/* Clean Circular Avatar */}
            <div className="relative h-24 w-24 rounded-full overflow-hidden border border-slate-200 shadow-sm mb-4">
              {designer.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={designer.photoURL}
                  alt={designer.name}
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(designer.name)}&background=0F172A&color=fff`;
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-2xl font-bold text-white uppercase">
                  {designer.name.charAt(0)}
                </div>
              )}
            </div>

            <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1">{designer.name}</h1>
            <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase mb-4">Verified Designer</span>

            {/* Apple style rating display */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold text-slate-800 mb-6">
              <FiStar className="fill-slate-800 text-slate-800 w-3.5 h-3.5" />
              <span>{avgRating} ({totalReviews} Reviews)</span>
            </div>

            <div className="w-full space-y-3.5 mb-6 text-left border-y border-slate-100 py-5">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                <FiMail className="w-4 h-4 text-slate-400" />
                <span>{designer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                <FiMapPin className="w-4 h-4 text-slate-400" />
                <span>Remote / Worldwide</span>
              </div>
            </div>

            <button
              onClick={handleStartChat}
              disabled={messageLoading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl py-3.5 text-xs font-bold transition-all shadow-sm disabled:opacity-55 cursor-pointer transform active:scale-[0.98]"
            >
              <FiMessageSquare className="w-4 h-4" />
              Contact Designer
            </button>
          </div>

          {/* Right Column (col-span-8): Main Content block */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Profile Overview Bio */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biography Overview</h2>
              <p className="text-sm text-slate-650 font-medium leading-relaxed max-w-2xl">
                {designer.bio || "No biography details shared yet."}
              </p>
              
              {designer.skills && designer.skills.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-[9px] font-black text-slate-450 uppercase tracking-widest mb-3">Core Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {designer.skills.map(skill => (
                      <span key={skill} className="text-[10px] font-bold text-slate-700 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/60">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Design Portfolio Showcase */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FiFolder className="text-slate-400" />
                  Portfolio Showcase
                </h2>
                <span className="text-[10px] font-bold text-slate-400">
                  {designer.portfolio?.length || 0} Projects
                </span>
              </div>

              {designer.portfolio && designer.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {designer.portfolio.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm group">
                      <div className="relative aspect-[1.6] w-full bg-slate-50 border-b border-slate-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="object-cover h-full w-full group-hover:scale-[1.01] transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4.5 space-y-1.5 text-left">
                        <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{item.description}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.tags.map(t => (
                              <span key={t} className="text-[9px] font-bold text-slate-650 bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded">
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
                <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs font-bold text-slate-400">
                  No portfolio items listed yet.
                </div>
              )}
            </div>

            {/* Active Service listings */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FiBriefcase className="text-slate-400" />
                  Active Service Listings
                </h2>
                <span className="text-[10px] font-bold text-slate-400">
                  {services.length} Gigs
                </span>
              </div>

              {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {services.map(gig => (
                    <Link 
                      key={gig._id} 
                      href={`/services/${gig._id}`}
                      className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm hover:border-slate-350 transition-colors flex flex-col"
                    >
                      <div className="relative aspect-[1.6] w-full bg-slate-50 border-b border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={gig.image} 
                          alt={gig.title} 
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="p-4.5 flex-1 flex flex-col justify-between text-left">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded w-fit block">{gig.category}</span>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">{gig.title}</h3>
                          <p className="text-[11px] text-slate-500 font-semibold line-clamp-2 leading-relaxed">{gig.shortDescription}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                            <FiStar className="fill-slate-800 text-slate-800" />
                            <span className="text-slate-700">{gig.rating || "5.0"}</span>
                          </div>
                          <span className="text-xs font-black text-slate-900">${gig.price}/hr</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs font-bold text-slate-400">
                  No active services listed.
                </div>
              )}
            </div>

            {/* Client Reviews logs */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FiLayers className="text-slate-400" />
                  Client Reviews
                </h2>
                <span className="text-[10px] font-bold text-slate-400">
                  {reviews.length} Testimonials
                </span>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 rounded-full overflow-hidden border border-slate-200/70">
                            {r.client.photoURL ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={r.client.photoURL}
                                alt={r.client.name}
                                className="object-cover h-full w-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.client.name)}&background=0F172A&color=fff`;
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs font-bold text-white uppercase">
                                {r.client.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-slate-900">{r.client.name}</h4>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Project: {r.service?.title || 'Creative Service'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-850 font-bold bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                          <FiStar className="fill-slate-800 text-slate-800" />
                          <span>{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold leading-relaxed italic text-left">
                        "{r.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs font-bold text-slate-400">
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
