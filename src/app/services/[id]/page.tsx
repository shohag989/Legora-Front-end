"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosSecure from '@/services/axiosSecure';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  FiMapPin, 
  FiDollarSign, 
  FiFolder, 
  FiStar, 
  FiArrowLeft, 
  FiSend, 
  FiClock,
  FiCheckCircle,
  FiShield,
  FiCheck,
  FiAward,
  FiFolderMinus,
  FiGrid,
  FiZap,
  FiMessageSquare,
  FiLayers
} from 'react-icons/fi';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/Skeleton';

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

const mockPortfolio = [
  {
    title: "Mobile FinTech Wallet UI",
    image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=400&q=80",
    tags: ["Mobile", "Figma"]
  },
  {
    title: "SaaS Analytics Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
    tags: ["Dashboard", "Web App"]
  },
  {
    title: "Minimal Brand Identity Guide",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&q=80",
    tags: ["Brand", "Visual"]
  }
];

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const handleMessageDesigner = async () => {
    if (!user) {
      toast.error('Please log in to contact this designer.');
      router.push('/login');
      return;
    }
    if (service && (user._id === service.createdBy._id || user.id === service.createdBy._id)) {
      toast.error('You cannot message yourself.');
      return;
    }
    try {
      setChatLoading(true);
      await axiosSecure.post('/chat/conversation', { recipientId: service?.createdBy._id });
      toast.success('Conversation started!');
      router.push('/dashboard/inbox');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to initialize conversation.');
    } finally {
      setChatLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please log in to place an order.');
      router.push('/login');
      return;
    }
    if (user.role === 'designer') {
      toast.error('Designers cannot place orders.');
      return;
    }
    if (service && (service.createdBy._id === user._id || service.createdBy._id === user.id)) {
      toast.error('You cannot place an order on your own service.');
      return;
    }

    try {
      setPlacingOrder(true);
      // Let's pass requirements fields as placeholders since client will fill them on dashboard or we'll ask them to provide requirements
      await axiosSecure.post('orders', { serviceId: id, requirementsText: 'Default details discussed in inbox' });
      toast.success(`Order request placed successfully with ${service?.createdBy.name}!`);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        // Using relative endpoint path matching our axiosSecure baseURL configuration
        const response = await axiosSecure.get(`services/${id}`);
        setService(response.data);
      } catch (error: any) {
        console.error('Failed to load gig details:', error);
        toast.error('Could not fetch gig details.');
        router.push('/services');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await axiosSecure.get(`reviews/service/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchServiceDetails();
      fetchReviews();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/20 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Back button skeleton */}
          <Skeleton className="h-9 w-32" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content skeletons */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cover Image skeleton */}
              <Skeleton className="aspect-[1.8] w-full rounded-2xl" />
              
              {/* Header details skeleton */}
              <div className="space-y-4 text-left">
                <Skeleton className="h-8 w-3/4" variant="text" />
                <div className="flex gap-2.5">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              
              {/* Description skeleton */}
              <div className="space-y-3.5 text-left border-t border-slate-100 pt-6">
                <Skeleton className="h-4 w-full" variant="text" />
                <Skeleton className="h-4 w-11/12" variant="text" />
                <Skeleton className="h-4 w-4/5" variant="text" />
                <Skeleton className="h-4 w-5/6" variant="text" />
              </div>
            </div>
            
            {/* Sidebar skeleton */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-6 text-left">
                <Skeleton className="h-5 w-1/3" variant="text" />
                <Skeleton className="h-8 w-2/5" variant="text" />
                <Skeleton className="h-10 w-full" />
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <Skeleton className="h-4 w-full" variant="text" />
                  <Skeleton className="h-4 w-5/6" variant="text" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
      <div className="absolute top-0 left-0 w-full h-[1150px] bg-gradient-to-b from-brand-blue/35 via-brand-blue/10 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1150px] bg-grid-pattern -z-10 opacity-75 pointer-events-none" />
      <div className="absolute top-64 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-[600px] left-10 w-[400px] h-[400px] bg-[#E53935]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        {/* Glassmorphic Capsule Back Navigation */}
        <div className="mb-10 text-left">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 hover:bg-white/95 border border-slate-200/60 hover:border-slate-300 backdrop-blur-md rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 transition-all duration-300 shadow-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>BACK TO MARKETPLACE</span>
          </Link>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Cover, Info and Profile */}
          <div className="lg:col-span-2 space-y-10 text-left">
            
            {/* Header Title Metadata */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-brand-blue/20 border border-brand-blue/40 px-3.5 py-1 rounded-full text-accent text-xs font-extrabold uppercase tracking-wider">
                  <FiFolder className="w-3.5 h-3.5" />
                  {service.category}
                </span>
                
                <span className="inline-flex items-center gap-1 bg-[#E53935]/10 border border-[#E53935]/25 px-3 py-1 rounded-full text-[#E53935] text-[10px] font-black tracking-widest uppercase">
                  <FiAward className="w-3 h-3" />
                  LEGORA VETTED
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15] max-w-4xl">
                {service.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-slate-900 font-extrabold">{service.rating || 5.0}</span>
                  <span className="text-slate-400">({reviews.length} reviews)</span>
                </div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <FiMapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{service.location}</span>
                </div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <FiClock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">Active Member</span>
                </div>
              </div>
            </div>

            {/* Giant Mockup Cover Frame */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/40 bg-slate-50 group">
              <Image 
                src={service.image} 
                alt={service.title} 
                fill 
                priority
                unoptimized={service.image.startsWith('http')}
                className="object-cover group-hover:scale-101 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Premium Project Scope Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 space-y-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600">
                    <FiFolderMinus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 leading-none">Project Scope</h2>
                    <span className="text-xs font-semibold text-slate-400">Detailed services and deliverables specifications</span>
                  </div>
                </div>
              </div>
              
              {/* Highlight Short Quote Summary */}
              <div className="relative p-6 bg-gradient-to-r from-brand-blue/20 via-brand-blue/5 to-white border-l-4 border-accent rounded-r-2xl text-slate-700 font-semibold italic text-base leading-relaxed">
                <div className="absolute top-3 right-4 opacity-10 text-accent font-serif text-6xl pointer-events-none">“</div>
                &ldquo;{service.shortDescription}&rdquo;
              </div>

              {/* Styled Full Description Text */}
              <div className="text-slate-600 text-base leading-relaxed whitespace-pre-line font-medium space-y-4">
                {service.fullDescription}
              </div>
            </div>

            {/* Portfolio Mockup Showcase Grid */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600">
                  <FiGrid className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 leading-none">Featured Deliverables</h2>
                  <span className="text-xs font-semibold text-slate-400">Examples of past case studies and portfolio works</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                {mockPortfolio.map((item, index) => (
                  <div key={index} className="group relative rounded-2xl border border-slate-150 overflow-hidden aspect-video bg-slate-50 cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-end text-left">
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[8px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-xs font-black text-white leading-tight line-clamp-1">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vetted Designer Profile Spotlights */}
            <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-3xl border border-slate-200/80 p-8 shadow-sm flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-blue/20 to-transparent rounded-bl-full pointer-events-none" />
              
              {/* Avatar circle */}
              <div className="w-24 h-24 rounded-full overflow-hidden relative border-4 border-white bg-slate-100 shadow-md shadow-slate-200/50 flex-shrink-0">
                {service.createdBy.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={service.createdBy.photoURL} 
                    alt={service.createdBy.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(service.createdBy.name)}&background=E53935&color=fff`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-black text-3xl">
                    {service.createdBy.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Metadata content */}
              <div className="text-center sm:text-left flex-1 space-y-3.5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <Link 
                      href={`/designers/${service.createdBy._id}`}
                      className="hover:underline font-black text-slate-905 text-2xl leading-none"
                    >
                      {service.createdBy.name}
                    </Link>
                    <div className="inline-flex items-center gap-1 bg-[#E53935]/15 border border-[#E53935]/30 px-2.5 py-0.5 rounded-full text-[#E53935] text-[9px] font-black uppercase tracking-wider">
                      <FiZap className="w-2.5 h-2.5 fill-[#E53935]" />
                      Creative Pro
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">CREATIVE PORTFOLIO OWNER</p>
                </div>
                
                <p className="text-sm font-semibold text-slate-500 max-w-md leading-relaxed">
                  Specialized in building cohesive design systems, fluid layouts, Figma components, and modern interactive elements.
                </p>
                
                {/* Specialty skills chips */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
                  {["Product Design", "Figma Pro", "Design System", "Interaction Design"].map((tag) => (
                    <span key={tag} className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connect action */}
              <button 
                onClick={handleMessageDesigner}
                disabled={chatLoading}
                className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700 bg-white rounded-2xl font-bold transition-all text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-55"
              >
                <FiMessageSquare className="w-4 h-4 text-slate-400" />
                <span>{chatLoading ? 'Loading Chat...' : 'Message Designer'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Pricing Escrow Action Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white/85 backdrop-blur-md rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-100/50 text-left space-y-6">
              
              {/* Header card indicator */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PRICING PROFILE</span>
                <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available Now
                </span>
              </div>

              {/* Price rates banner */}
              <div className="space-y-1.5 bg-slate-50/50 border border-slate-150 p-5 rounded-2xl">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">HOURLY SERVICE RATE</div>
                <div className="flex items-baseline gap-1 text-slate-900">
                  <FiDollarSign className="w-5 h-5 text-slate-400 self-center" />
                  <span className="text-5xl font-black leading-none tracking-tight">{service.price}</span>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider ml-1">/ hour</span>
                </div>
              </div>

              {/* Scope Checklist items */}
              <div className="space-y-4 pt-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DELIVERABLE DETAILS</div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                    <div className="p-0.5 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full mt-0.5">
                      <FiCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>Initial concepts in 24-48 hrs</span>
                  </div>

                  <div className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                    <div className="p-0.5 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full mt-0.5">
                      <FiCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>Figma file source access</span>
                  </div>

                  <div className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                    <div className="p-0.5 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full mt-0.5">
                      <FiCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>Direct designer feedback loop</span>
                  </div>

                  <div className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                    <div className="p-0.5 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full mt-0.5">
                      <FiCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>Unlimited design revisions</span>
                  </div>
                </div>
              </div>

              {/* Project parameters */}
              <div className="border-t border-slate-100 pt-5 space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-2"><FiClock className="w-4 h-4 text-slate-400" /> Delivery Time</span>
                  <span className="text-slate-900">Custom Milestone</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-2"><FiMapPin className="w-4 h-4 text-slate-400" /> Location</span>
                  <span className="text-slate-900">{service.location}</span>
                </div>
              </div>

              {/* CTA button */}
              <div className="pt-2">
                <button 
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-secondary text-white rounded-2xl font-bold transition-all duration-300 text-sm shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
                >
                  <FiSend className="w-4 h-4" />
                  {placingOrder ? 'Placing Order...' : 'Initiate Project Order'}
                </button>
              </div>

              {/* Escrow note */}
              <div className="flex gap-2.5 bg-slate-50 border border-slate-150 p-4 rounded-2xl text-[10px] text-slate-400 font-bold tracking-wide leading-relaxed">
                <FiShield className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />
                <p>
                  <span className="text-slate-700">Legora Escrow Guard™</span> secures your payments. Funds are only released to the designer after deliverables review approval.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-slate-200/60 pt-16 text-left">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <FiLayers className="text-indigo-550" />
            Client Reviews ({reviews.length})
          </h2>
          {reviewsLoading ? (
            <div className="h-20 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-8 text-center text-xs font-semibold text-slate-450">
              No reviews have been left for this gig yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r: any) => (
                <div key={r._id} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
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
                          <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs font-bold text-white uppercase font-sans">
                            {r.client.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800">{r.client.name}</h4>
                        <span className="text-[9px] text-slate-400 font-bold">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold bg-amber-50/50 px-2 py-1 rounded">
                      <FiStar className="fill-current" />
                      <span>{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 font-semibold leading-relaxed">
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
