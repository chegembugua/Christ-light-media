'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, LogIn, LogOut, Shield, User, ChevronDown, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Devotions', path: '/devotions' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Podcasts', path: '/podcasts' },
    { name: 'Music', path: '/music' },
    { name: 'Radio', path: '/radio' },
    { name: 'News', path: '/news' },
    { name: 'Community', path: '/community' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? 'bg-[#090909]/90 backdrop-blur-xl border-b border-white/10 py-4 shadow-xl shadow-black/20' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-xl shadow-gold/20 group-hover:shadow-[0_0_25px_rgba(200,162,74,0.5)] transition-all">
            <span className="text-black text-3xl font-light font-cinzel leading-none">✦</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-white group-hover:text-gold transition-colors font-cinzel">
              Christ Light
            </h1>
            <p className="text-[10px] text-gray-500 -mt-1 font-inter tracking-[3px]">MEDIA HOUSE</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-sm font-medium tracking-wide transition-colors ${
                pathname === link.path || pathname.startsWith(`${link.path}/`)
                  ? 'text-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="p-2 text-gray-400 hover:text-gold transition-colors"
          >
            <Search size={20} />
          </button>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-gold transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold border border-gold/30">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={cn("transition-transform", isDropdownOpen && "rotate-180")} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-white/10 rounded-xl py-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                      <User size={16} /> Profile
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-gold hover:text-white hover:bg-white/5">
                        <Shield size={16} /> Admin
                      </Link>
                    )}
                    <button 
                      onClick={() => logout()}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="gold" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-x-0 top-[72px] bg-[#0A0A0A] border-b border-white/5 transition-all duration-300 overflow-hidden lg:hidden ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-cinzel text-white hover:text-gold"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
             {user ? (
               <>
                 <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                   <Button variant="ghost" className="w-full text-white">Profile</Button>
                 </Link>
                 <Button variant="outline" className="w-full text-red-400" onClick={() => { logout(); setIsMenuOpen(false); }}>Log Out</Button>
               </>
             ) : (
               <>
                 <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                   <Button variant="ghost" className="w-full text-white">Log In</Button>
                 </Link>
                 <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                   <Button variant="gold" className="w-full">Get Started</Button>
                 </Link>
               </>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
}
