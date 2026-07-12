"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import axiosSecure from '@/services/axiosSecure';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiUser, 
  FiMessageSquare,
  FiSend,
  FiBriefcase
} from 'react-icons/fi';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  projectCategory: z.string().min(1, 'Please select a category'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const categories = [
  "UI/UX Design",
  "Web Design",
  "3D & Motion",
  "Brand Identity",
  "General Inquiry"
];

const supportCards = [
  {
    icon: FiMail,
    title: "Email Us",
    value: "hello@legora.com",
    description: "For partnership & general inquiries."
  },
  {
    icon: FiPhone,
    title: "Call Us",
    value: "+1 (555) 019-2834",
    description: "Mon-Fri from 9am to 6pm PST."
  },
  {
    icon: FiMapPin,
    title: "Office Location",
    value: "San Francisco, CA",
    description: "Legora Labs HQ."
  }
];

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      projectCategory: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSending(true);
      await axiosSecure.post('/messages', data);
      toast.success("Message sent successfully! We'll be in touch soon.");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-text overflow-hidden">
      
      {/* Background Gradients matching Landing Page */}
      <div className="absolute top-0 left-0 w-full h-[950px] bg-gradient-to-b from-brand-blue/40 via-brand-blue/15 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[950px] bg-grid-pattern -z-10 opacity-70 pointer-events-none" />
      <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* SECTION 1: HERO (Split Column) */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            
            {/* Hero Left Content */}
            <div className="flex-1 max-w-2xl text-left space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-6xl font-extrabold tracking-tight text-text leading-[1.08]"
              >
                Let&apos;s build something <br />
                <span className="text-accent">beautiful together.</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg text-muted/95 leading-relaxed max-w-lg"
              >
                Connect directly with our creative network. Drop us a message and we will get back to you within 24 hours to accelerate your Releases.
              </motion.p>
            </div>

            {/* Hero Right Content: Large Loop Video Visual */}
            <div className="flex-1 flex justify-center lg:justify-end w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md aspect-square flex items-center justify-center overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute w-72 h-72 bg-gradient-to-tr from-brand-blue to-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
                
                <video 
                  src="/assets/Animation/Contact.webm" 
                  loop 
                  muted 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-contain mix-blend-multiply relative z-10"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: FORM & DETAILS GRID */}
      <section className="py-24 bg-surface relative border-t border-border/80">
        <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Stacked support cards (styled like values cards) */}
            <div className="lg:col-span-5 space-y-6">
              {supportCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white rounded-2xl border border-border p-6 shadow-sm flex items-start gap-4 hover:-translate-y-1 hover:border-accent/30 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/30 text-accent flex items-center justify-center border border-brand-blue/50 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text mb-1 text-sm">{card.title}</h3>
                      <p className="font-extrabold text-accent text-sm mb-1">{card.value}</p>
                      <p className="text-xs text-muted font-medium">{card.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column: Contact Form Card */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl border border-border p-8 shadow-sm"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiUser className="h-5 w-5 text-muted" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className={`block w-full rounded-xl border ${
                          errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-border focus:border-accent focus:ring-accent/30'
                        } bg-surface py-3 pl-10 pr-3 text-text placeholder-muted/80 focus:outline-none focus:ring-2 sm:text-sm transition-all font-medium`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiMail className="h-5 w-5 text-muted" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={`block w-full rounded-xl border ${
                          errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-border focus:border-accent focus:ring-accent/30'
                        } bg-surface py-3 pl-10 pr-3 text-text placeholder-muted/80 focus:outline-none focus:ring-2 sm:text-sm transition-all font-medium`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Category Field */}
                  <div>
                    <label htmlFor="projectCategory" className="block text-sm font-semibold text-text mb-2">
                      Project Category
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiBriefcase className="h-5 w-5 text-muted" />
                      </div>
                      <select
                        id="projectCategory"
                        {...register('projectCategory')}
                        className={`block w-full rounded-xl border ${
                          errors.projectCategory ? 'border-red-300 focus:border-red-500' : 'border-border focus:border-accent focus:ring-accent/30'
                        } bg-surface py-3 pl-10 pr-3 text-text placeholder-muted focus:outline-none focus:ring-2 sm:text-sm transition-all cursor-pointer font-bold`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.projectCategory && (
                      <p className="mt-2 text-sm text-red-600">{errors.projectCategory.message}</p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-text mb-2">
                      Project Message
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-start pl-3 pt-3">
                        <FiMessageSquare className="h-5 w-5 text-muted" />
                      </div>
                      <textarea
                        id="message"
                        rows={4}
                        {...register('message')}
                        className={`block w-full rounded-xl border ${
                          errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-border focus:border-accent focus:ring-accent/30'
                        } bg-surface py-3 pl-10 pr-3 text-text placeholder-muted/80 focus:outline-none focus:ring-2 sm:text-sm transition-all font-medium`}
                        placeholder="Tell us about your project goals, scope, and deadlines..."
                      />
                    </div>
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <div>
                    <Button
                      type="submit"
                      disabled={isSending}
                      className="w-full flex justify-center items-center gap-2 px-6 py-3.5 bg-primary hover:bg-secondary text-white rounded-xl font-bold transition-all shadow-md shadow-primary/10"
                    >
                      {isSending ? 'Sending Message...' : 'Send Message'}
                      <FiSend className="w-4 h-4" />
                    </Button>
                  </div>

                </form>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
