"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from './Container';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Browse Designers', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md transition-all duration-300">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-40 sm:w-48">
              <Image
                src="/assets/logos/logo.svg"
                alt="Legora Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors">
              <FiSearch className="h-5 w-5" />
            </button>
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200"
            >
              Join as Designer
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors">
              <FiSearch className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-indigo-600 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-lg px-3 py-2.5 text-base font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2.5 text-base font-semibold text-white hover:bg-indigo-700 transition-all"
              >
                Join as Designer
              </Link>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

