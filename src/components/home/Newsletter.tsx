"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import axiosSecure from '@/services/axiosSecure';
import toast from 'react-hot-toast';

export const Newsletter = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    try {
      setSubmitting(true);
      await axiosSecure.post('/messages', {
        name: `${firstName} ${lastName}`,
        email,
        projectCategory: 'General Inquiry',
        message,
      });
      toast.success("Message sent successfully! We'll be in touch.");
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Contact Form Section */}
      <section className="py-28 lg:py-36 bg-surface relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-text tracking-tight mb-4">Get in touch</h2>
            <p className="text-muted text-lg">Ready to scale your design team? We are here to help.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
             {/* Left: Contact Info / Doodle */}
             <div className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-36 h-36 flex items-center justify-center mb-8 relative">
                  <div className="absolute w-24 h-24 bg-brand-blue rounded-full blur-2xl opacity-40 -z-10" />
                  <video 
                    src="/assets/Animation/Standing Doodle.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="space-y-6 pt-4 w-full">
                  <div className="border-t border-border/60 pt-6">
                    <h4 className="font-bold text-text text-sm uppercase tracking-wider mb-1">Sales inquiries</h4>
                    <p className="text-muted text-base font-semibold">sales@legora.com</p>
                  </div>
                  <div className="border-t border-border/60 pt-6">
                    <h4 className="font-bold text-text text-sm uppercase tracking-wider mb-1">General support</h4>
                    <p className="text-muted text-base font-semibold">help@legora.com</p>
                  </div>
                </div>
             </div>

             {/* Right: Form */}
             <div className="lg:w-2/3 w-full bg-white rounded-[2rem] p-8 lg:p-12 border border-border/85 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative z-10">
                <h3 className="text-2xl font-bold text-text mb-8 tracking-tight">How can we help you?</h3>
                 <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text">First Name</label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-surface border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-semibold text-slate-800" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text">Last Name</label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-surface border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-semibold text-slate-800" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Email address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-semibold text-slate-800" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Message</label>
                    <textarea 
                      rows={4} 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-surface border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-semibold text-slate-800"
                    ></textarea>
                  </div>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={submitting}
                    className="w-full sm:w-auto px-10 py-3.5 shadow-md shadow-primary/10 disabled:opacity-60"
                  >
                    {submitting ? 'Sending...' : 'Submit'}
                  </Button>
                </form>
             </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-36 lg:py-44 bg-background relative overflow-hidden flex flex-col items-center">
         <div className="absolute bottom-0 w-full h-[600px] bg-gradient-to-t from-brand-blue/50 via-brand-blue/10 to-transparent -z-10 pointer-events-none" />
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
         
         <div className="relative z-10 text-center px-4 max-w-4xl">
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text tracking-tight mb-6 leading-[1.08]">
             Bring design clarity to your product today
           </h2>
           <p className="text-muted text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
             Join thousands of modern teams building incredible products with our vetted network of designers.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Button variant="primary" size="lg" className="px-8 py-4 shadow-lg shadow-primary/15">Get started</Button>
             <Button variant="secondary" size="lg" className="px-8 py-4 border-border hover:border-text/35">Learn more</Button>
           </div>
         </div>
      </section>
    </>
  );
};
