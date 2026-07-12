"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCheckSquare, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

const steps = [
  {
    idx: "01",
    icon: FiSearch,
    title: "Browse profiles",
    description: "Search vetted creative talents, filter by specialized design tools, custom milestone rates, and verified case studies.",
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20"
  },
  {
    idx: "02",
    icon: FiCheckSquare,
    title: "Hire your match",
    description: "Review detailed visual portfolios, align on scope requirements, and secure project terms with a single click.",
    color: "from-indigo-500 to-violet-500",
    shadow: "shadow-indigo-500/20"
  },
  {
    idx: "03",
    icon: FiTrendingUp,
    title: "Launch & scale",
    description: "Collaborate directly, approve project milestones under Legora Escrow Guard™, and build first-class design work.",
    color: "from-violet-500 to-fuchsia-500",
    shadow: "shadow-violet-500/20"
  }
];

export const ProcessSection = () => {
  return (
    <section className="py-28 bg-surface/50 relative overflow-hidden border-y border-slate-100">
      {/* Background aesthetic blobs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Get started in three simple steps.
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base font-semibold leading-relaxed">
            A secure, streamlined hiring and collaboration experience built for ambitious product teams.
          </p>
        </div>

        {/* Steps Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-10 relative">
          
          {/* Animated curved background connector for desktop */}
          <div className="hidden md:block absolute top-1/3 left-[10%] w-[80%] h-[3px] bg-gradient-to-r from-blue-300/40 via-indigo-300/40 to-purple-300/40 -z-10 -translate-y-1/2 rounded-full" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-slate-200/80 p-8 lg:p-10 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1.5 transition-all duration-500 flex flex-col items-start text-left overflow-hidden cursor-pointer"
              >
                {/* Glow Overlay */}
                <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] -z-10" />

                {/* Card Top Row: Number & Icon */}
                <div className="flex items-center justify-between w-full mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} ${step.shadow} text-white flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-5xl font-black text-slate-100 group-hover:text-indigo-500/10 tracking-tighter select-none transition-colors duration-300">
                    {step.idx}
                  </span>
                </div>

                {/* Card Content */}
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-accent transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-500 font-semibold text-sm leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Micro CTA arrow link */}
                <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-accent transition-colors duration-300">
                  <span>Learn more</span>
                  <FiArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

