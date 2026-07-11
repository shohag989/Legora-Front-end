"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ServiceCard } from '@/components/cards/ServiceCard';

const mockDesigners = [
  {
    title: "Modern SaaS Landing Page Design",
    designerName: "Alex Morgan",
    price: "$450",
    rating: 4.9,
    location: "New York, USA",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    avatarUrl: "https://i.pravatar.cc/150?img=11"
  },
  {
    title: "E-commerce Mobile App UI/UX",
    designerName: "Sarah Chen",
    price: "$600",
    rating: 5.0,
    location: "London, UK",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    avatarUrl: "https://i.pravatar.cc/150?img=9"
  },
  {
    title: "Fintech Dashboard Interface",
    designerName: "David Kim",
    price: "$850",
    rating: 4.8,
    location: "Seoul, KR",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    avatarUrl: "https://i.pravatar.cc/150?img=12"
  },
  {
    title: "Brand Identity & Logo Design",
    designerName: "Emma Watson",
    price: "$300",
    rating: 4.9,
    location: "Berlin, DE",
    imageUrl: "https://images.unsplash.com/photo-1626785779602-44496461a152?auto=format&fit=crop&q=80&w=800",
    avatarUrl: "https://i.pravatar.cc/150?img=5"
  }
];

export const FeaturedDesigners = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text">Featured Designers</h2>
            <p className="mt-4 text-muted max-w-2xl">Discover top-rated professionals for your next project.</p>
          </div>
          <a href="#" className="hidden sm:block text-primary font-medium hover:underline whitespace-nowrap">View All Designers &rarr;</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockDesigners.map((designer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ServiceCard {...designer} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
            <a href="#" className="text-primary font-medium hover:underline inline-block">View All Designers &rarr;</a>
        </div>
      </div>
    </section>
  );
};
