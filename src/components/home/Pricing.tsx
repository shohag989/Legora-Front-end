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
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-text tracking-tight mb-4">
            Simple pricing for your goals
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            No hidden fees, no surprises. Choose the plan that fits your project scope.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[2rem] border ${
                plan.highlighted 
                  ? 'bg-brand-blue/30 border-accent/30 shadow-lg scale-100 md:scale-105 z-10' 
                  : 'bg-white border-border shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-text mb-2">{plan.name}</h3>
              <p className="text-muted text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-text">{plan.price}</span>
                <span className="text-muted ml-2">/{plan.period}</span>
              </div>
              
              <Button variant={plan.buttonVariant} className="w-full mb-8">
                {plan.highlighted ? "Get Started" : "Choose Plan"}
              </Button>
              
              <div className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FiCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-text">{feature}</span>
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
