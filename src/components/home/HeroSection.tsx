"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FiStar } from 'react-icons/fi';
import Image from 'next/image';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-24 lg:pt-40 lg:pb-36">
      {/* Background gradients matching reference */}
      <div className="absolute top-0 left-0 w-full h-[900px] bg-gradient-to-b from-brand-blue/40 via-brand-blue/15 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Split Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          <div className="flex-1 max-w-2xl text-left">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text leading-[1.08]"
            >
              Real-time insight for modern design
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-lg md:text-xl text-muted/90 leading-relaxed max-w-lg"
            >
              Browse verified UI/UX designers specializing in websites, mobile apps, and SaaS platforms. Find your perfect match today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button variant="primary" size="lg" className="px-8 py-4 text-base shadow-lg shadow-primary/10">Get started</Button>
              <Button variant="secondary" size="lg" className="px-8 py-4 text-base border-border hover:border-text/35">Learn more</Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 flex items-center gap-5"
            >
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative bg-muted/20 shadow-sm">
                    <Image src={`https://i.pravatar.cc/150?img=${10+i}`} alt="User" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="h-10 w-[1px] bg-border/80" />
              <div>
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-text">Trusted by 10,000+ teams</p>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md aspect-square flex items-center justify-center"
            >
               {/* Background Glow */}
               <div className="absolute w-72 h-72 bg-gradient-to-tr from-brand-blue to-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
               <div className="relative w-full h-full flex items-center justify-center z-10">
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
