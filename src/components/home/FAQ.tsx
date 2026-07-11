"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted">Everything you need to know about working with Legora.</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-border/50 last:border-0">
                <button
                  onClick={() => toggleOpen(index)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-primary' : 'text-text'}`}>
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
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-muted leading-relaxed pr-8">
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
    </section>
  );
};
