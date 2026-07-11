"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center"
        >
          {/* Left: Large Portrait */}
          <div className="w-full lg:w-1/3 aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-lg shrink-0">
            <Image 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800" 
              alt="Client" 
              fill 
              className="object-cover"
            />
          </div>
          
          {/* Right: Quote Content */}
          <div className="flex-1 flex flex-col justify-center relative">
            <div className="text-8xl text-brand-blue/50 font-serif leading-none absolute -top-10 -left-6 z-0">
              "
            </div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-text leading-tight mb-10 z-10 relative">
              The platform gave us immediate access to world-class UI/UX talent. What used to take months of searching now takes days.
            </p>
            <div className="flex items-center justify-between border-t border-border/50 pt-8 mt-auto z-10">
              <div>
                <h4 className="font-bold text-lg text-text">Michael Chen</h4>
                <p className="text-muted">VP of Design, TechFlow</p>
              </div>
              <div className="opacity-50 grayscale font-bold text-2xl tracking-tighter">
                TECHFLOW
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
