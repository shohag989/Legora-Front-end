"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from './Container';
import { FiMenu, FiX, FiSearch, FiUser, FiLayout, FiPlus, FiLogOut, FiSettings, FiBell, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import axiosSecure from '@/services/axiosSecure';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleClickOutsideNotif = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutsideNotif);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutsideNotif);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await axiosSecure.get('notifications');
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    const fetchUnreadMessages = async () => {
      try {
        const res = await axiosSecure.get('chat/unread-count');
        setUnreadMessages(res.data.count || 0);
      } catch (err) {
        console.error('Error fetching unread messages count:', err);
      }
    };
    fetchNotifications();
    fetchUnreadMessages();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadMessages();
    }, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const markAllRead = async () => {
    try {
      await axiosSecure.patch('notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await axiosSecure.patch(`notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Designers', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md transition-all duration-300">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center relative py-2">
              <input
                type="text"
                placeholder="Search creative designers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 px-4 pr-12 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                autoFocus
              />
              <button type="submit" className="absolute right-12 text-slate-400 hover:text-indigo-600 transition-colors p-2 cursor-pointer">
                <FiSearch className="h-5 w-5" />
              </button>
              <button 
                type="button" 
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="absolute right-3 text-slate-450 hover:text-slate-650 p-2 cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </form>
          ) : (
            <>
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
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
                {user && (
                  <Link
                    href="/dashboard/inbox"
                    className="p-2 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer relative"
                    title="Direct Messages"
                  >
                    <FiMessageSquare className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                )}
                {user && (
                  <div className="relative" ref={notifRef}>
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer relative"
                    >
                      <FiBell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/60 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 max-h-96 overflow-y-auto">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-1.5">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notifications</div>
                          {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-[10px] font-bold text-indigo-650 hover:underline">
                              Mark all read
                            </button>
                          )}
                        </div>
                        {notifications.length === 0 ? (
                          <div className="px-3 py-4 text-center text-xs text-slate-400 font-medium">No notifications yet</div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n._id}
                              href={n.link || '/dashboard'}
                              onClick={() => {
                                markSingleRead(n._id);
                                setShowNotifications(false);
                              }}
                              className={`block px-3 py-2.5 rounded-lg text-xs hover:bg-slate-50 transition-colors mb-1 ${!n.isRead ? 'bg-indigo-50/20 border-l-2 border-indigo-500 font-semibold' : ''}`}
                            >
                              <div className="text-slate-800 font-bold mb-0.5">{n.title}</div>
                              <div className="text-slate-500 font-medium text-[11px] leading-relaxed">{n.message}</div>
                              <div className="text-[9px] text-slate-400 mt-1 font-bold">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
                {loading ? (
                  <div className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
                ) : user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white p-1 pr-3 hover:bg-slate-50 transition-all focus:outline-none cursor-pointer"
                    >
                      {user.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover border border-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E53935&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">{user.name}</span>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200/60 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50">
                        <div className="px-3 py-2 border-b border-slate-100 mb-1.5">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged in as</div>
                          <div className="text-xs font-bold text-slate-500 capitalize">{user.role}</div>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                        >
                          <FiLayout className="w-4 h-4 text-slate-400" />
                          Visit Dashboard
                        </Link>
                        <Link
                          href="/dashboard/inbox"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                        >
                          <FiMessageSquare className="w-4 h-4 text-slate-400" />
                          Inbox Messages
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors"
                          >
                            <FiSettings className="w-4 h-4 text-indigo-500" />
                            Admin Dashboard
                          </Link>
                        )}
                        {user.role === 'designer' && (
                          <Link
                            href="/services/add"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                          >
                            <FiPlus className="w-4 h-4 text-slate-400" />
                            Add Service
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-650 hover:bg-red-55/50 hover:text-red-700 rounded-lg transition-colors border-t border-slate-100 mt-1.5 pt-2 text-left cursor-pointer"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
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
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
                {user && (
                  <Link
                    href="/dashboard/inbox"
                    className="p-2 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer relative"
                    title="Direct Messages"
                  >
                    <FiMessageSquare className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-indigo-600 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </>
      )}
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E53935&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-base font-semibold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-all mb-2 cursor-pointer"
                  >
                    Visit Dashboard
                  </Link>
                  <Link
                    href="/dashboard/inbox"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-all mb-2 cursor-pointer"
                  >
                    Inbox Messages
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50/30 px-4 py-2.5 text-base font-bold text-indigo-650 hover:bg-indigo-50 transition-all mb-2 cursor-pointer"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'designer' && (
                    <Link
                      href="/services/add"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white hover:bg-slate-800 transition-all shadow-sm mb-2 cursor-pointer"
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

