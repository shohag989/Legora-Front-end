"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FiStar } from 'react-icons/fi';
import Image from 'next/image';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-20 lg:pt-28 pb-10">
      {/* Background gradients matching reference */}
      <div className="absolute top-40 left-0 w-full h-[800px] bg-gradient-to-b from-brand-blue/40 via-brand-blue/20 to-transparent -z-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Split Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mb-20">
          
          <div className="flex-1 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text leading-[1.1]"
            >
              Real-time insight for modern design
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-lg text-muted max-w-lg"
            >
              Browse verified UI/UX designers specializing in websites, mobile apps, and SaaS platforms. Find your perfect match today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button variant="primary" size="lg">Get started</Button>
              <Button variant="secondary" size="lg">Learn more</Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative bg-muted/20">
                    <Image src={`https://i.pravatar.cc/150?img=${10+i}`} alt="User" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm font-medium text-text">Trusted by 10,000+ teams</p>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-md aspect-square"
            >
               <div className="absolute inset-0 flex items-center justify-center">
                  <video 
                    src="/assets/Animation/Doodle Illustration.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
               </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};
