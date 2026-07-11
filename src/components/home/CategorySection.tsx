"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiLayout, FiSmartphone, FiPieChart, FiCloud, FiShoppingCart, FiStar } from 'react-icons/fi';

const categories = [
  { name: 'Landing Page', icon: FiLayout, count: '1,200+' },
  { name: 'Mobile App', icon: FiSmartphone, count: '850+' },
  { name: 'Dashboard', icon: FiPieChart, count: '640+' },
  { name: 'SaaS', icon: FiCloud, count: '520+' },
  { name: 'E-commerce', icon: FiShoppingCart, count: '930+' },
  { name: 'Brand Identity', icon: FiStar, count: '410+' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const CategorySection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text">Explore Categories</h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">Find the perfect designer for your specific project needs.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col items-center justify-center p-6 bg-white border border-border/50 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-text text-sm md:text-base text-center">{category.name}</h3>
                <p className="text-xs text-muted mt-1">{category.count} designers</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
