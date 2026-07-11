"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export const Newsletter = () => {
  return (
    <section className="py-24 bg-background px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden bg-white border border-border/50 shadow-sm"
      >
        {/* Soft background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-primary/5 pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Stay updated with UI trends.</h2>
          <p className="text-muted max-w-xl mx-auto mb-10">
            Join 15,000+ designers and product managers receiving our weekly curated list of top design resources.
          </p>
          
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-2xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-text placeholder-muted"
              required
            />
            <Button variant="primary" type="submit" className="py-4 px-8 whitespace-nowrap">
              Subscribe
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};
