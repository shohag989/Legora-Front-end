"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiStar, 
  FiMapPin, 
  FiPlay, 
  FiPause, 
  FiSliders, 
  FiArrowRight, 
  FiHeart,
  FiUser
} from 'react-icons/fi';
import axiosSecure from '@/services/axiosSecure';

interface Creator {
  name: string;
  photoURL?: string;
}

interface ServiceItem {
  _id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription?: string;
  price: number;
  location: string;
  image: string;
  createdBy: Creator;
  rating?: number;
  skills?: string[];
  reviewsCount?: number;
}

const MOCK_SERVICES: ServiceItem[] = [
  {
    _id: "mock-1",
    title: "Senior Product & UI/UX Designer",
    category: "UI/UX Design",
    shortDescription: "Crafting intuitive digital experiences, wireframes, and high-fidelity user journeys for web and mobile products.",
    price: 85,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    createdBy: {
      name: "Sophia Carter",
      photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
    },
    rating: 4.9,
    reviewsCount: 42,
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"]
  },
  {
    _id: "mock-2",
    title: "Brand Identity & Visual Specialist",
    category: "Brand Identity",
    shortDescription: "Developing cohesive visual identities, logotypes, brand assets guidelines, and visual storytelling.",
    price: 75,
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1541462608141-2ffb6cc0e9e0?auto=format&fit=crop&w=600&q=80",
    createdBy: {
      name: "Marcus Vance",
      photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
    },
    rating: 4.8,
    reviewsCount: 38,
    skills: ["Illustrator", "Brand Strategy", "Logos", "Typography"]
  },
  {
    _id: "mock-3",
    title: "3D Motion Designer & Art Director",
    category: "3D & Motion",
    shortDescription: "Creating immersive 3D simulations, abstract loop motion graphics, and premium product animations.",
    price: 120,
    location: "Amsterdam, NL",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    createdBy: {
      name: "Elena Rostova",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
    },
    rating: 5.0,
    reviewsCount: 29,
    skills: ["Cinema 4D", "Blender", "After Effects", "Spline"]
  },
  {
    _id: "mock-4",
    title: "Webflow Developer & Web Designer",
    category: "Web Design",
    shortDescription: "Connecting interactive layout with code structures to ship responsive and animations-heavy sites.",
    price: 90,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    createdBy: {
      name: "Ethan Wright",
      photoURL: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80"
    },
    rating: 4.7,
    reviewsCount: 51,
    skills: ["Webflow", "HTML/CSS", "Figma", "UI Design"]
  },
  {
    _id: "mock-5",
    title: "Digital Illustrator & Concept Artist",
    category: "Illustration & Art",
    shortDescription: "Crafting beautiful hand-drawn illustrations, character design, book covers, and vector layouts.",
    price: 65,
    location: "Tokyo, JP",
    image: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80",
    createdBy: {
      name: "Hana Tanaka",
      photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80"
    },
    rating: 4.9,
    reviewsCount: 23,
    skills: ["Procreate", "Photoshop", "Vector Art", "Digital Painting"]
  },
  {
    _id: "mock-6",
    title: "Mobile App Designer & Design Thinker",
    category: "UI/UX Design",
    shortDescription: "Specializing in iOS and Android application interfaces, micro-interactions, and design systems.",
    price: 95,
    location: "Berlin, DE",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    createdBy: {
      name: "Lucas Miller",
      photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
    },
    rating: 4.8,
    reviewsCount: 31,
    skills: ["Figma", "Sketch", "Interaction Design", "Prototyping"]
  }
];

const CATEGORIES = [
  'All',
  'UI/UX Design',
  'Brand Identity',
  'Web Design',
  '3D & Motion',
  'Illustration & Art'
];

export default function BrowseDesignersPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating_desc');
  const [loading, setLoading] = useState(true);



  // Load services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        // Build search parameters
        const params: any = {};
        if (search) params.search = search;
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (sortBy) params.sort = sortBy;

        const response = await axiosSecure.get('/services', { params });
        
        if (response.data && response.data.services) {
          setServices(response.data.services);
        } else {
          setServices([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [search, selectedCategory, sortBy]);

  // Combine database services with Mock Services for high-fidelity fallback demonstration
  const getFilteredServices = () => {
    let result = [...services];
    
    // If API returned no results (or failed/empty DB), use Mock Services
    if (result.length === 0) {
      result = MOCK_SERVICES.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = search === '' || 
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.createdBy.name.toLowerCase().includes(search.toLowerCase()) ||
          item.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
          (item.skills && item.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase())));
        
        return matchesCategory && matchesSearch;
      });

      // Local mock sorting since database query sorting is not applicable here
      result.sort((a, b) => {
        const rA = a.rating || 0;
        const rB = b.rating || 0;
        const pA = a.price || 0;
        const pB = b.price || 0;

        if (sortBy === 'price_asc') return pA - pB;
        if (sortBy === 'price_desc') return pB - pA;
        if (sortBy === 'rating_desc') return rB - rA;
        return 0; // Default ordering
      });
    }

    return result;
  };

  const filteredServices = getFilteredServices();

  return (
    <div className="min-h-screen bg-background font-sans text-text">
      {/* Background gradients matching Landing Page */}
      <div className="absolute top-0 left-0 w-full h-[900px] bg-gradient-to-b from-brand-blue/40 via-brand-blue/15 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            
            {/* Hero Left Content */}
            <div className="flex-1 max-w-2xl text-left space-y-6">
              
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-6xl font-extrabold tracking-tight text-text leading-[1.08]"
              >
                Discover top global <br />
                <span className="text-accent">design talent.</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg text-muted/95 leading-relaxed max-w-lg"
              >
                Legora connects you with vetted creative freelancers offering premium user experience design, branding strategy, illustration, and immersive 3D animation.
              </motion.p>

              {/* Stats Grid matching Landing Page style */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-3 gap-6 pt-6 max-w-lg border-t border-border/80"
              >
                <div>
                  <h3 className="text-2xl font-extrabold text-text">4.9/5</h3>
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider mt-1">Average Rating</p>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-text">12k+</h3>
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider mt-1">Completed Reels</p>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-text">24 hr</h3>
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider mt-1">Average Onboard</p>
                </div>
              </motion.div>
            </div>

            {/* Hero Right Content - Embedded Loop Video */}
            <div className="flex-1 flex justify-center lg:justify-end w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md aspect-square flex items-center justify-center overflow-hidden"
              >
                {/* Background Glow matching landing page hero */}
                <div className="absolute w-72 h-72 bg-gradient-to-tr from-brand-blue to-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
                
                <video 
                  src="/assets/Animation/About.mp4" 
                  loop 
                  muted 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-contain mix-blend-multiply relative z-10 scale-110 translate-y-[6%]"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Search and Filters Bar (Sticky) */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-y border-border/80 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Input Box */}
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-muted" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search designer name, skills, title..."
                className="block w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-text placeholder-muted/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm font-medium"
              />
            </div>

            {/* Sorting controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="text-xs font-bold text-muted flex items-center gap-1.5 uppercase tracking-wider">
                <FiSliders className="w-3.5 h-3.5" />
                Sort By
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-border bg-white py-2 px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all cursor-pointer font-bold"
              >
                <option value="rating_desc">Top Rated (Default)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Category Filter Pills (Theme Colors) */}
          <div className="flex gap-2 overflow-x-auto pt-4 pb-1 scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === category
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/10'
                    : 'bg-white hover:bg-surface text-muted border-border/80 hover:text-text'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Designer Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-sm animate-pulse">
                <div className="aspect-[4/3] w-full bg-slate-100 rounded-xl" />
                <div className="h-5 bg-slate-100 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="w-10 h-10 bg-slate-100 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          // Designers Grid with Framer Motion Layout animations
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service) => (
                <motion.div
                  key={service._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface rounded-xl border border-border/50">
                      <Image 
                        src={service.image}
                        alt={service.title}
                        fill
                        unoptimized={service.image.startsWith('http')}
                        className="object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      
                      {/* Category Label Overlay */}
                      <span className="absolute top-3 left-3 bg-text/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider uppercase">
                        {service.category}
                      </span>

                      {/* Ratings Badge Overlay */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-border">
                        <FiStar className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-text">
                          {service.rating || 4.9}
                        </span>
                        <span className="text-[10px] text-muted font-semibold">
                          ({service.reviewsCount || 15})
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="pt-5 pb-2">
                      <h3 className="font-bold text-text text-lg leading-snug line-clamp-1 group-hover:text-accent transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">
                        {service.shortDescription}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {(service.skills || ["UI Design", "Figma", "Digital Art"]).map((skill) => (
                          <span 
                            key={skill} 
                            className="bg-brand-blue/30 text-accent border border-brand-blue/40 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Profile & CTA Footer */}
                  <div className="pt-4 border-t border-border/80 flex items-center justify-between mt-4">
                    
                    {/* Creator Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden relative bg-surface border border-border">
                        {service.createdBy.photoURL ? (
                          <img 
                            src={service.createdBy.photoURL} 
                            alt={service.createdBy.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(service.createdBy.name)}&background=3B82F6&color=fff`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-accent text-white font-bold text-xs">
                            {service.createdBy.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-text leading-tight">
                          {service.createdBy.name}
                        </span>
                        <span className="text-[10px] text-muted font-bold flex items-center mt-0.5">
                          <FiMapPin className="w-2.5 h-2.5 mr-0.5" />
                          {service.location}
                        </span>
                      </div>
                    </div>

                    {/* Rate */}
                    <div className="text-right">
                      <div className="text-[10px] text-muted font-bold uppercase tracking-wider">Rate</div>
                      <div className="text-text text-base font-extrabold flex items-center justify-end leading-none mt-0.5">
                        <span className="text-xs text-muted font-normal mr-0.5">$</span>
                        {service.price}
                        <span className="text-[10px] text-muted font-normal ml-0.5">/hr</span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Empty State Block
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-blue/30 text-accent flex items-center justify-center border border-brand-blue/50 shadow-sm">
              <FiUser className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text">No Designers Found</h3>
            <p className="text-muted max-w-sm text-sm">
              We couldn't find any designer matches for "{search}". Try searching for another role or skill!
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="mt-2 text-sm font-bold text-accent hover:text-accent/80 transition-colors"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
