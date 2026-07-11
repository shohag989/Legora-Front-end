"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export const Newsletter = () => {
  return (
    <>
      {/* Contact Form Section */}
      <section className="py-24 bg-surface relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-text tracking-tight">Get in touch</h2>
            <p className="mt-4 text-muted">Ready to scale your design team? We are here to help.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
             {/* Left: Contact Info / Doodle */}
             <div className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-32 h-32 flex items-center justify-center mb-8">
                  <video 
                    src="/assets/Animation/Standing Doodle.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-text">Sales</h4>
                    <p className="text-muted">sales@legora.com</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-text">Support</h4>
                    <p className="text-muted">help@legora.com</p>
                  </div>
                </div>
             </div>

             {/* Right: Form */}
             <div className="lg:w-2/3 w-full bg-white rounded-3xl p-8 lg:p-12 border border-border shadow-sm relative z-10">
                <h3 className="text-2xl font-bold text-text mb-8">How can we help you?</h3>
                <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-text">First Name</label>
                      <input type="text" className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-text">Last Name</label>
                      <input type="text" className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text">Email address</label>
                    <input type="email" className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text">Message</label>
                    <textarea rows={4} className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"></textarea>
                  </div>
                  <Button variant="primary" type="submit" className="w-full sm:w-auto px-10">Submit</Button>
                </form>
             </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-32 bg-background relative overflow-hidden flex flex-col items-center">
         <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-brand-blue/30 to-transparent pointer-events-none" />
         
         <div className="relative z-10 text-center px-4 max-w-3xl">
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text tracking-tight mb-6">
             Bring design clarity to your product today
           </h2>
           <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
             Join thousands of modern teams building incredible products with our vetted network of designers.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Button variant="primary" size="lg">Get started</Button>
             <Button variant="secondary" size="lg">Learn more</Button>
           </div>
         </div>

      </section>
    </>
  );
};
