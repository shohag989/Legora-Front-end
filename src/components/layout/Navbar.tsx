"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from './Container';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth();

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
            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
            ) : user ? (
              <div className="flex items-center gap-4">
                {user.role === 'designer' && (
                  <Link
                    href="/services/add"
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm"
                  >
                    Add Service
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=indigo&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-red-600 hover:border-red-100 shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
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
              {loading ? (
                <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
              ) : user ? (
                <div className="space-y-3 px-3">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=indigo&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-base font-semibold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  {user.role === 'designer' && (
                    <Link
                      href="/services/add"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-base font-semibold text-white hover:bg-slate-800 transition-all shadow-sm mb-2"
                    >
                      Add Service
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center justify-center rounded-lg border border-red-100 bg-red-50/50 px-4 py-2.5 text-base font-semibold text-red-600 hover:bg-red-50 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

