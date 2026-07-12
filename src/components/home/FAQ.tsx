"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

const faqs = [
  {
    question: "How do you vet the designers on your platform?",
    answer: "Every designer undergoes a rigorous 4-step vetting process including portfolio review, technical interview, soft skills assessment, and a small test project to ensure they meet our quality standards."
  },
  {
    question: "What is the typical turnaround time for hiring?",
    answer: "You can typically connect with and hire a designer within 24 to 48 hours after posting your project requirements. Our matching algorithm connects you with available talent instantly."
  },
  {
    question: "Do you handle the contracts and payments?",
    answer: "Yes, we handle all the legal agreements and payment processing. You pay through our secure platform, and we release funds to the designer only when milestones are met."
  },
  {
    question: "Can I replace a designer if it's not a good fit?",
    answer: "Absolutely. We offer a satisfaction guarantee. If the relationship isn't working out within the first week, we will replace the designer at no additional cost."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-28 lg:py-36 bg-surface border-y border-border/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          
          {/* Left Column */}
          <div className="lg:col-span-1 text-left">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-text mb-6 tracking-tight leading-tight">
              Frequently asked questions
            </h2>
            <p className="text-muted text-base leading-relaxed mb-10">
              Can&apos;t find the answer you&apos;re looking for? Reach out to our customer support team.
            </p>
            <div className="w-36 h-36 flex items-center justify-center mb-10 relative">
               <div className="absolute w-24 h-24 bg-brand-blue rounded-full blur-2xl opacity-40 -z-10" />
               <video 
                 src="/assets/Animation/Thinking Doodle.mp4"
                 autoPlay
                 loop
                 muted
                 playsInline
                 className="w-full h-full object-contain mix-blend-multiply"
               />
            </div>
            <Button variant="secondary" className="px-6 py-3">Contact us</Button>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-2 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`border rounded-[1.5rem] bg-white transition-all duration-300 ${
                    isOpen 
                      ? 'border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
                      : 'border-border/80 shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:border-border'
                  }`}
                >
                  <button
                    onClick={() => toggleOpen(index)}
                    className="w-full p-6 lg:p-8 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className={`text-lg font-bold transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-text'}`}>
                      {faq.question}
                    </span>
                    <div className={`ml-4 shrink-0 p-2 rounded-xl transition-all duration-300 ${
                      isOpen ? 'bg-primary text-white' : 'bg-surface text-muted'
                    }`}>
                      {isOpen ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <p className="px-6 lg:px-8 pb-6 lg:pb-8 text-muted text-sm leading-relaxed border-t border-border/40 pt-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
