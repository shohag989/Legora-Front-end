"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const Testimonials = () => {
  return (
    <section className="py-28 lg:py-36 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-blue/30 rounded-full blur-3xl opacity-40 -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch bg-surface/40 border border-border/80 rounded-[3rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
        >
          {/* Left: Large Portrait */}
          <div className="w-full lg:w-2/5 min-h-[350px] relative rounded-[2rem] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] shrink-0">
            <Image 
              src="/assets/images/michaelchen.jpg" 
              alt="Michael Chen" 
              fill 
              className="object-cover"
            />
          </div>
          
          {/* Right: Quote Content */}
          <div className="flex-1 flex flex-col justify-between relative py-4">
            <div className="relative">
              <div className="text-8xl text-brand-blue font-serif leading-none absolute -top-12 -left-4 select-none opacity-50">
                “
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-text leading-snug mb-10 z-10 relative pt-2 tracking-tight">
                The platform gave us immediate access to world-class UI/UX talent. What used to take months of searching now takes days.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-8 mt-auto z-10">
              <div>
                <h4 className="font-bold text-lg text-text">Michael Chen</h4>
                <p className="text-muted text-sm font-medium">VP of Design, TechFlow</p>
              </div>
              <div className="opacity-40 select-none grayscale font-extrabold text-xl tracking-tighter text-text">
                TECHFLOW
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
