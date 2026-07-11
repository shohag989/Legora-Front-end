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
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-text tracking-tight mb-4">
          Connect your tech stack
        </h2>
        <p className="text-muted mb-12">
          Sync your hired designers directly with the tools your team already uses.
        </p>
        
        <div className="flex justify-center mb-12">
          <div className="w-32 h-32 flex items-center justify-center">
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

        <div className="flex flex-wrap justify-center gap-6">
          {integrations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-border rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${item.color}`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
