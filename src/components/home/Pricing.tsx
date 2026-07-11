"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FiCheck } from 'react-icons/fi';

const plans = [
  {
    name: "Starter",
    description: "Perfect for single projects and short-term needs.",
    price: "$499",
    period: "per project",
    features: ["1 Dedicated Designer", "Up to 3 Revisions", "Basic Support", "Standard Delivery"],
    buttonVariant: "secondary" as const,
    highlighted: false
  },
  {
    name: "Pro",
    description: "Ideal for growing startups and continuous design needs.",
    price: "$1,999",
    period: "per month",
    features: ["Dedicated Design Team", "Unlimited Revisions", "Priority Slack Support", "Fast-track Delivery", "Source Files Included"],
    buttonVariant: "primary" as const,
    highlighted: true
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large-scale operations.",
    price: "Custom",
    period: "contact us",
    features: ["Multiple Design Teams", "Dedicated Art Director", "24/7 Phone Support", "Custom Workflows", "NDA & IP Transfer"],
    buttonVariant: "secondary" as const,
    highlighted: false
  }
];

export const Pricing = () => {
  return (
    <section className="py-28 lg:py-36 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-text tracking-tight mb-4">
            Simple pricing for your goals
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            No hidden fees, no surprises. Choose the plan that fits your project scope.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col p-10 rounded-[2rem] border transition-all duration-300 ${
                plan.highlighted 
                  ? 'bg-white border-primary border-2 shadow-[0_20px_50px_rgba(0,0,0,0.06)] scale-100 md:scale-105 z-10' 
                  : 'bg-white border-border/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.03)]'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-text mb-2">{plan.name}</h3>
              <p className="text-muted text-sm mb-8 h-10 leading-relaxed">{plan.description}</p>
              
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-text tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-muted ml-2 text-sm font-semibold">/{plan.period}</span>}
              </div>
              
              <Button variant={plan.buttonVariant} className="w-full mb-8 py-3.5 shadow-sm">
                {plan.highlighted ? "Get Started" : "Choose Plan"}
              </Button>
              
              <div className="flex-1 pt-6 border-t border-border/60">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FiCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-text/90 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
