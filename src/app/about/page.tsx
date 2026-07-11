"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { 
  FiAward, 
  FiBriefcase, 
  FiCheckCircle, 
  FiGlobe,
  FiTrendingUp,
  FiUsers,
  FiZap
} from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const values = [
  {
    icon: FiAward,
    title: "Vetted Excellence",
    description: "Every creative profile is manually screened. We review design portfolios, communication, and technical skills to guarantee first-class results."
  },
  {
    icon: FiBriefcase,
    title: "Direct Collaboration",
    description: "No middlemen or complex management layers. Connect, coordinate milestones, and review designs directly with your talent in real-time."
  },
  {
    icon: FiCheckCircle,
    title: "Milestone Security",
    description: "Transactions and scopes are securely cataloged. Funds are held and disbursed only when you approve design milestones."
  }
];

const timelineEvents = [
  {
    year: "2024",
    title: "The Legora Vision",
    description: "Founded with the mission to solve global creative sourcing by building a direct client-to-freelancer marketplace."
  },
  {
    year: "2025",
    title: "Vetting Protocols",
    description: "Introduced strict profile verification standards. Only the top 5% of design applicants are admitted to our database."
  },
  {
    year: "2026",
    title: "Global Scaling",
    description: "Supporting 10,000+ teams worldwide. Integrated real-time payments, smart contracts, and interactive reels."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-text overflow-hidden">
      
      {/* Background Gradients & Matrix Patterns */}
      <div className="absolute top-0 left-0 w-full h-[950px] bg-gradient-to-b from-brand-blue/45 via-brand-blue/15 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[950px] bg-grid-pattern -z-10 opacity-70 pointer-events-none" />
      <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-80 left-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            
            {/* Hero Left Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 max-w-2xl text-left space-y-6"
            >
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl font-extrabold tracking-tight text-text leading-[1.08]"
              >
                Bridging the gap between <br />
                <span className="text-accent">vision and design.</span>
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-lg text-muted/95 leading-relaxed max-w-lg"
              >
                Legora is a curated design talent marketplace connecting ambitious tech startups and modern product teams with vetted creative designers worldwide.
              </motion.p>

              {/* Statistics Grid */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-3 gap-6 pt-6 max-w-lg border-t border-border/80"
              >
                <div>
                  <h3 className="text-3xl font-extrabold text-text tracking-tight">10k+</h3>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider mt-1">Teams Trusted</p>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-text tracking-tight">99.8%</h3>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider mt-1">Match Rate</p>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-text tracking-tight">24 hr</h3>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider mt-1">Average Onboard</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Right Content - Embedded Loop Video */}
            <div className="flex-1 flex justify-center lg:justify-end w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md aspect-square flex items-center justify-center"
              >
                {/* Background Glow */}
                <div className="absolute w-80 h-80 bg-gradient-to-tr from-brand-blue to-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
                
                <video 
                  src="/assets/Animation/About%20Us.mp4" 
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

      {/* Core Values Section */}
      <section className="py-24 bg-surface relative">
        <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold text-text tracking-tight">
              Our values define us
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              A standard of execution engineered to empower ambitious companies and design specialists.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-2xl border border-border p-8 shadow-sm hover:shadow-md hover:border-accent/30 duration-300 transition-all flex flex-col items-start text-left relative group hover:-translate-y-1.5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/30 text-accent flex items-center justify-center mb-6 border border-brand-blue/50 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-3">{val.title}</h3>
                  <p className="text-muted leading-relaxed text-sm">
                    {val.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Design Philosophy / Innovation Section (Thinking Doodle) */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            
            {/* Story Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-2xl text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-brand-blue/30 border border-brand-blue/50 px-4 py-1.5 rounded-full text-accent text-xs font-semibold">
                <FiZap className="w-3.5 h-3.5" />
                Creative Ideation
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-text tracking-tight leading-snug">
                Where strategy meets craftsmanship.
              </h2>
              <p className="text-muted leading-relaxed text-base">
                We believe that good design is never just about aesthetics—it's about usability, technical accuracy, and branding alignment. Legora designers bridge the gap between creative artistry and product metrics.
              </p>
              <p className="text-muted leading-relaxed text-base">
                Whether you need SaaS interface frameworks, intricate mobile interactions, or immersive 3D marketing illustrations, our vetting process connects you directly with specialized talent who understand product design.
              </p>
            </motion.div>

            {/* Story Video (Thinking Doodle) */}
            <div className="flex-1 flex justify-center lg:justify-end w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-md aspect-square flex items-center justify-center overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute w-72 h-72 bg-gradient-to-tr from-brand-blue to-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
                
                <video 
                  src="/assets/Animation/Thinking%20Doodle.mp4" 
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

      {/* Chronological Milestone Timeline */}
      <section className="py-24 bg-surface relative">
        <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-text tracking-tight">
              Our Journey
            </h2>
            <p className="text-muted max-w-xl mx-auto mt-4">
              Building the future of decentralized creative collaboration.
            </p>
          </div>

          <div className="relative border-l-2 border-border/80 max-w-3xl mx-auto pl-8 space-y-16">
            {timelineEvents.map((evt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <span className="absolute -left-[41px] top-1.5 flex h-6 h-6 items-center justify-center rounded-full bg-white border-2 border-accent">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                
                <div className="space-y-2">
                  <span className="text-xs font-black text-accent bg-brand-blue/30 border border-brand-blue/40 px-3 py-1 rounded-full">
                    {evt.year}
                  </span>
                  <h3 className="text-xl font-bold text-text pt-2">{evt.title}</h3>
                  <p className="text-muted text-sm leading-relaxed max-w-2xl">
                    {evt.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Plug Doodle Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            
            {/* Story Left Video - Connection Plug Doodle */}
            <div className="flex-1 flex justify-center lg:justify-start w-full order-last lg:order-first">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-md aspect-square flex items-center justify-center overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute w-72 h-72 bg-gradient-to-tr from-brand-blue to-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
                
                <video 
                  src="/assets/Animation/Plug%20Doodle.mp4" 
                  loop 
                  muted 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-contain mix-blend-multiply relative z-10"
                />
              </motion.div>
            </div>

            {/* Story Right Content */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-2xl text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-brand-blue/30 border border-brand-blue/50 px-4 py-1.5 rounded-full text-accent text-xs font-semibold">
                <FiUsers className="w-3.5 h-3.5" />
                Seamless Onboarding
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-text tracking-tight leading-snug">
                Connecting modern teams with talent.
              </h2>
              <p className="text-muted leading-relaxed text-base">
                Legora takes care of the onboarding, scheduling, and invoicing workflow. We eliminate administrative friction so you can focus entirely on planning and scaling your product releases.
              </p>
              <div className="pt-4">
                <Link href="/services">
                  <Button variant="primary" size="md" className="gap-2 shadow-lg shadow-primary/10">
                    Browse Designers
                    <FiGlobe className="w-4.5 h-4.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}
