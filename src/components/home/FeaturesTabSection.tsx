"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiCpu, FiMessageSquare, FiActivity } from 'react-icons/fi';

import Image from 'next/image';

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
    <section className="py-28 lg:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Tabs */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-text mb-8 tracking-tight leading-tight">
              Why modern teams choose Legora
            </h2>
            <div className="flex flex-col space-y-3">
              {features.map((feature) => {
                const isActive = activeTab === feature.id;
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveTab(feature.id)}
                    className={`flex items-start gap-5 p-6 rounded-2xl transition-all duration-300 text-left border ${
                      isActive 
                        ? 'bg-white border-border/80 shadow-md shadow-black/[0.02]' 
                        : 'bg-transparent border-transparent hover:bg-surface/60'
                    }`}
                  >
                    <div className={`shrink-0 mt-1 p-2 rounded-xl transition-colors duration-300 ${
                      isActive ? 'bg-brand-blue text-accent' : 'bg-surface text-muted'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text text-lg">{feature.title}</h3>
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
          <div className="bg-surface rounded-3xl p-8 border border-border/60 flex items-center justify-center min-h-[480px] relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -15 }}
                 transition={{ duration: 0.25 }}
                 className="w-full max-w-sm bg-white rounded-2xl border border-border/80 shadow-lg p-6"
               >
                  <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/60 flex items-center justify-center text-accent">
                        {React.createElement(features.find(f => f.id === activeTab)?.icon || FiCheck, { className: "w-5 h-5" })}
                      </div>
                      <div>
                        <h4 className="font-bold text-text text-sm">
                          {features.find(f => f.id === activeTab)?.title}
                        </h4>
                        <p className="text-[10px] font-semibold text-muted/80">Active Module</p>
                      </div>
                    </div>
                    <div className="px-2.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-200">Live</div>
                  </div>

                  {/* Active Tab Mockup Content */}
                  {activeTab === 'verified' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full relative overflow-hidden bg-muted/20 border border-border">
                          <Image src="https://i.pravatar.cc/150?img=33" alt="Avatar" fill className="object-cover" />
                        </div>
                        <div>
                          <h5 className="font-bold text-text text-sm">Alex Rivera</h5>
                          <p className="text-xs text-muted">Senior UI/UX Designer</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2.5 py-1 bg-surface text-[10px] font-semibold text-text rounded-lg border border-border/40">Web Design</span>
                        <span className="px-2.5 py-1 bg-surface text-[10px] font-semibold text-text rounded-lg border border-border/40">SaaS Layouts</span>
                        <span className="px-2.5 py-1 bg-surface text-[10px] font-semibold text-text rounded-lg border border-border/40">Figma</span>
                      </div>
                      <div className="pt-2 border-t border-border/60 flex justify-between items-center text-xs">
                        <span className="font-bold text-text">$85/hr</span>
                        <span className="text-muted font-medium">★ 4.9 (48 reviews)</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'communication' && (
                    <div className="space-y-3">
                      <div className="bg-surface p-3 rounded-2xl rounded-tl-none max-w-[85%] text-xs text-text border border-border/40">
                        Hey! Just uploaded the final dashboard Figma files. Let me know what you think.
                      </div>
                      <div className="bg-brand-blue/30 p-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-xs text-text border border-accent/10">
                        Awesome! Love the typography and clean spacing. Going to share with the team now.
                      </div>
                      <p className="text-[10px] font-medium text-muted/60 text-center pt-2">Active chat 2m ago</p>
                    </div>
                  )}

                  {activeTab === 'analytics' && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-text">Project Progress</span>
                        <span className="text-accent">75%</span>
                      </div>
                      <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border/40">
                        <div className="bg-accent h-full w-[75%]" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-surface p-3 rounded-xl border border-border/40">
                          <p className="text-[10px] font-semibold text-muted">Hours Tracked</p>
                          <p className="text-sm font-bold text-text">32.5h</p>
                        </div>
                        <div className="bg-surface p-3 rounded-xl border border-border/40">
                          <p className="text-[10px] font-semibold text-muted">Budget Spent</p>
                          <p className="text-sm font-bold text-text">$2,760</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'automation' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs p-3 bg-surface rounded-xl border border-border/40">
                        <span className="font-semibold text-text">1. Signed Agreement</span>
                        <span className="text-green-600 font-bold">Done</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-3 bg-surface rounded-xl border border-border/40">
                        <span className="font-semibold text-text">2. Escrow Deposit</span>
                        <span className="text-green-600 font-bold">Paid</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-3 bg-surface rounded-xl border border-border/40">
                        <span className="font-semibold text-text">3. Milestone 1 Review</span>
                        <span className="text-accent font-bold">Reviewing</span>
                      </div>
                    </div>
                  )}

               </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
