import React from 'react';
import Link from 'next/link';
import { FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-border/50 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image src="/assets/logos/logo-Footer.svg" alt="Legora Logo" width={120} height={32} className="h-8 w-auto" />
            </Link>
            <p className="mt-4 text-muted max-w-sm">
              The premier platform connecting ambitious companies with world-class UI/UX design talent.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted hover:text-primary transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted hover:text-primary transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted hover:text-primary transition-colors">
                <FiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">Browse Designers</Link></li>
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">Post a Project</Link></li>
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">Design Trends</Link></li>
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-muted hover:text-primary transition-colors">Partners</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">&copy; {new Date().getFullYear()} Legora. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-muted hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-muted hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
