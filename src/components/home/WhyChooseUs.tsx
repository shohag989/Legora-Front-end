"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiMessageSquare, FiTrendingUp, FiLayers } from 'react-icons/fi';

const features = [
  {
    title: "Verified Professionals",
    description: "Every designer goes through a rigorous vetting process to ensure top-tier quality and reliability for your projects.",
    icon: FiCheckCircle,
    span: "col-span-1 md:col-span-2 lg:col-span-2"
  },
  {
    title: "Fast Communication",
    description: "Connect directly with designers. No middlemen, no delays. Get your project moving faster.",
    icon: FiMessageSquare,
    span: "col-span-1"
  },
  {
    title: "Affordable Pricing",
    description: "Transparent pricing with no hidden fees. Find talent that fits your budget.",
    icon: FiTrendingUp,
    span: "col-span-1"
  },
  {
    title: "Modern UI Expertise",
    description: "Our designers specialize in the latest trends, from SaaS dashboards to sleek mobile apps and converting landing pages.",
    icon: FiLayers,
    span: "col-span-1 md:col-span-2 lg:col-span-2"
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text">Why Choose Legora</h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">We connect you with the best design talent in the industry, making your hiring process seamless.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col ${feature.span}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed flex-grow">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
