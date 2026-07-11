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
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          
          {/* Left Column */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-extrabold text-text mb-4 tracking-tight">Frequently asked questions</h2>
            <p className="text-muted mb-8">
              Can't find the answer you're looking for? Reach out to our customer support team.
            </p>
            <div className="w-32 h-32 flex items-center justify-center mb-8">
               <video 
                 src="/assets/Animation/Thinking Doodle.mp4"
                 autoPlay
                 loop
                 muted
                 playsInline
                 className="w-full h-full object-contain mix-blend-multiply"
               />
            </div>
            <Button variant="secondary">Contact us</Button>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-2 space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border border-border/50 rounded-2xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleOpen(index)}
                    className="w-full p-6 flex items-center justify-between text-left focus:outline-none hover:bg-surface/50 transition-colors"
                  >
                    <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-primary' : 'text-text'}`}>
                      {faq.question}
                    </span>
                    <div className={`ml-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                      {isOpen ? <FiMinus className="w-5 h-5 text-primary" /> : <FiPlus className="w-5 h-5 text-muted" />}
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <p className="px-6 pb-6 text-muted leading-relaxed">
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
