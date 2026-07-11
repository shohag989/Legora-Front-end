"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-32 lg:pb-40">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 via-background to-transparent -z-10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text leading-tight mx-auto max-w-4xl"
        >
          Find Professional <span className="text-primary">UI/UX Designers</span> For Your Next Digital Product
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-lg md:text-xl text-muted max-w-2xl mx-auto"
        >
          Browse verified designers specializing in websites, mobile apps and SaaS platforms.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="primary" size="lg">Explore Designers</Button>
          <Button variant="secondary" size="lg">Become a Designer</Button>
        </motion.div>
      </div>

      {/* Floating Mockup */}
      <div className="relative mt-20 lg:mt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-[2rem] overflow-hidden aspect-[16/9] flex items-center justify-center relative"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 z-0" />
           <div className="z-10 flex flex-col items-center">
             <span className="text-muted/50 font-medium text-2xl">Creative Dashboard Mockup</span>
           </div>
        </motion.div>
      </div>
    </section>
  );
};
