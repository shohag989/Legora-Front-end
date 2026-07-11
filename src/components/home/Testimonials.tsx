"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';

export const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-10 bg-white rounded-[2.5rem] p-10 md:p-14 border border-border/50 shadow-sm"
        >
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shrink-0 relative bg-muted/10 border-4 border-white shadow-lg">
            <Image 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" 
              alt="Client" 
              fill 
              className="object-cover"
            />
          </div>
          
          <div className="flex flex-col text-center md:text-left">
            <div className="flex justify-center md:justify-start gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className="text-xl md:text-2xl font-medium text-text leading-relaxed">
              "This platform completely transformed how we source design talent. We found an incredible UI/UX designer within 24 hours, and the quality of work exceeded all our expectations."
            </p>
            <div className="mt-6">
              <h4 className="font-bold text-lg text-text">Sarah Jenkins</h4>
              <p className="text-muted">Product Manager at TechFlow</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
