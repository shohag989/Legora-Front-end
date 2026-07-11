"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiSlack, FiFigma, FiGithub, FiTrello, FiMonitor, FiCloud } from 'react-icons/fi';

const integrations = [
  { name: 'Slack', icon: FiSlack, color: 'text-purple-600' },
  { name: 'Figma', icon: FiFigma, color: 'text-red-500' },
  { name: 'GitHub', icon: FiGithub, color: 'text-gray-900' },
  { name: 'Trello', icon: FiTrello, color: 'text-blue-500' },
  { name: 'Monitor', icon: FiMonitor, color: 'text-indigo-500' },
  { name: 'Cloud', icon: FiCloud, color: 'text-sky-500' },
];

export const Integrations = () => {
  return (
    <section className="py-28 lg:py-36 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-blue/30 rounded-full blur-3xl opacity-60 -z-10" />

        <h2 className="text-4xl lg:text-5xl font-extrabold text-text tracking-tight mb-6">
          Connect your tech stack
        </h2>
        <p className="text-muted text-lg max-w-xl mx-auto mb-16">
          Sync your hired designers directly with the tools your team already uses.
        </p>
        
        <div className="flex justify-center mb-16 relative z-10">
          <div className="w-36 h-36 flex items-center justify-center">
            <video 
              src="/assets/Animation/Plug Doodle.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {integrations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="w-20 h-20 md:w-24 md:h-24 bg-white border border-border/80 rounded-[1.5rem] flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_12px_45px_rgb(0,0,0,0.04)] hover:border-border transition-all duration-300 cursor-pointer"
              >
                <Icon className={`w-9 h-9 md:w-11 md:h-11 transition-transform duration-300 ${item.color}`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
