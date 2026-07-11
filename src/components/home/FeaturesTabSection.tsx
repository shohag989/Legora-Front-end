"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiCpu, FiMessageSquare, FiActivity } from 'react-icons/fi';

const features = [
  {
    id: "verified",
    title: "Verified Professionals",
    description: "Connect with pre-vetted designers instantly.",
    icon: FiCheck,
  },
  {
    id: "communication",
    title: "Fast Communication",
    description: "Real-time sync with your hired talent.",
    icon: FiMessageSquare,
  },
  {
    id: "analytics",
    title: "Analytics & Tracking",
    description: "Monitor project milestones and budget.",
    icon: FiActivity,
  },
  {
    id: "automation",
    title: "Workflow Automation",
    description: "Automate contract creation and payments.",
    icon: FiCpu,
  }
];

export const FeaturesTabSection = () => {
  const [activeTab, setActiveTab] = useState(features[0].id);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Tabs */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-text mb-8 tracking-tight">
              Why modern teams choose Legora
            </h2>
            <div className="flex flex-col space-y-2">
              {features.map((feature) => {
                const isActive = activeTab === feature.id;
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveTab(feature.id)}
                    className={`flex items-start gap-4 p-6 rounded-2xl transition-all text-left ${
                      isActive ? 'bg-brand-blue/50' : 'hover:bg-surface'
                    }`}
                  >
                    <div className={`shrink-0 mt-1 ${isActive ? 'text-accent' : 'text-text'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text text-lg">{feature.title}</h3>
                      {isActive && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-muted mt-2 text-sm leading-relaxed"
                        >
                          {feature.description}
                        </motion.p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Mockup */}
          <div className="bg-surface rounded-3xl p-8 border border-border flex items-center justify-center min-h-[500px] relative overflow-hidden shadow-sm">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.3 }}
                 className="w-full max-w-sm bg-white rounded-2xl border border-border shadow-lg p-6"
               >
                  <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/30 flex items-center justify-center text-accent">
                        {React.createElement(features.find(f => f.id === activeTab)?.icon || FiCheck, { className: "w-5 h-5" })}
                      </div>
                      <div>
                        <h4 className="font-semibold text-text text-sm">
                          {features.find(f => f.id === activeTab)?.title}
                        </h4>
                        <p className="text-xs text-muted">Active Module</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Live</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-surface rounded-full w-3/4" />
                    <div className="h-4 bg-surface rounded-full w-full" />
                    <div className="h-4 bg-surface rounded-full w-5/6" />
                    <div className="mt-6 pt-6 border-t border-border flex justify-end">
                      <div className="h-8 w-24 bg-primary rounded-lg" />
                    </div>
                  </div>
               </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
