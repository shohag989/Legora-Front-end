"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';

const steps = [
  {
    icon: FiSearch,
    title: "Browse profiles",
    description: "Search verified designers by skill, industry, and rate."
  },
  {
    icon: FiCheckSquare,
    title: "Hire your match",
    description: "Review portfolios and onboard your chosen talent instantly."
  },
  {
    icon: FiTrendingUp,
    title: "Launch & scale",
    description: "Manage milestones and payments while your product gets built."
  }
];

export const ProcessSection = () => {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-text tracking-tight mb-4">
          Get started in 3 steps
        </h2>
        <p className="text-muted max-w-2xl mx-auto mb-16">
          A seamless hiring experience designed for ambitious companies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-border -z-10 -translate-y-1/2" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl border border-border p-8 shadow-sm flex flex-col items-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-blue/30 text-accent flex items-center justify-center mb-6 shadow-sm border border-brand-blue/50">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{step.title}</h3>
                <p className="text-muted leading-relaxed text-sm">
                  {step.description}
                </p>
                
                {/* Step indicator */}
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold border-4 border-surface shadow-md">
                  {idx + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
