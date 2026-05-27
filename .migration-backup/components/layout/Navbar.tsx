'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search, Menu, X, LogOut, Shield, User,
  ChevronDown, Heart, Bookmark, Settings2,
  Play, BookOpen, Music, Radio, Mic, Users,
  Newspaper, MessageSquare, Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import NotificationBell from '@/components/notifications/NotificationBell';

const NAV_ITEMS = [
  {
    label: 'Media',
    children: [
      { name: 'Sermons',   path: '/sermons',   icon: Play,     desc: 'Watch & listen to messages' },
      { name: 'Podcasts',  path: '/podcasts',  icon: Mic,      desc: 'Faith conversations' },
      { name: 'Music',     path: '/music',     icon: Music,    desc: 'Worship & praise' },
      { name: 'Live Radio',path: '/radio',     icon: Radio,    desc: '24/7 Christian radio' },
    ],
  },
  {
    label: 'Grow',
    children: [
      { name: 'Devotions', path: '/devotions', icon: BookOpen, desc: 'Daily scripture reflections' },
      { name: 'Bible School', path: '/school', icon: BookOpen, desc: 'Structured courses' },
      { name: 'Movement',  path: '/movement',  icon: Flame,    desc: 'In for Christ discipleship' },
    ],
  },
  {
    label: 'Community',
    children: [
      { name: 'Prayer Wall', path: '/community/prayer', icon: Heart,        desc: 'Share & intercede' },
      { name: 'Chat',        path: '/community',        icon: MessageSquare,desc: 'Connect with believers' },
      { name: 'News',        path: '/news',             icon: Newspaper,    desc: 'Christian news' },
      { name: 'Give',        path: '/give',             icon: Users,        desc: 'Support the ministry' },
    ],
  },
];

function DropdownMenu({
  items,
  onClose,
}: {
  items: { name: string; path: string; icon: React.ElementType; desc: string }[];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 rounded-2xl overflow-hidden z-50"
      style={{
        background: 'rgba(14,14,14,0.97)',
        border: '1px solid rgba(200,162,74,0.15)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="p-2">
        {items.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-gold/8 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/15 transition-colors">
              <item.icon size={14} className="text-gold/70 group-hover:text-gold transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors leading-tight">
                {item.name}
              </p>
              <p className="text-[11px] text-white/35 group-hover:text-white/50 transition-colors leading-tight mt-0.5">
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname  = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setActiveDropdown(null); }, [pathname]);

  const isActive = (children: { path: string }[]) =>
    children.some((c) => pathname === c.path || pathname.startsWith(c.path + '/'));

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
          scrolled
            ? 'py-3 shadow-[0_1px_0_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)]'
            : 'py-5'
        )}
        style={scrolled ? {
          background: 'rgba(8,8,8,0.92)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        } : { background: 'transparent' }}
      >
        <div className="container mx-auto max-w-7xl px-6 flex items-center justify-between gap-6">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 z-10">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #C8A24A 0%, #E6D5A8 50%, #B38A3D 100%)',
                boxShadow: '0 0 20px rgba(200,162,74,0.3)',
              }}
            >
              <span className="text-black font-cinzel text-lg font-bold leading-none select-none">✦</span>
            </div>
            <div className="leading-none">
              <p className="text-[15px] font-bold tracking-tight text-white group-hover:text-gold transition-colors font-cinzel">
                Christ Light
              </p>
              <p className="text-[8px] text-white/25 tracking-[0.3em] uppercase font-inter mt-0.5">
                MEDIA HOUSE
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav ───────────────────────────────────────── */}
          <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                <button
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(item.children)
                      ? 'text-gold bg-gold/8'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    className={cn(
                      'transition-transform duration-200',
                      activeDropdown === item.label ? 'rotate-180 text-gold' : ''
                    )}
                  />
                </button>

                <div
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <DropdownMenu
                        items={item.children}
                        onClose={() => setActiveDropdown(null)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {/* ── Right Actions ─────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              aria-label="Search"
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <Search size={18} />
            </button>

            <NotificationBell />

            {/* Auth — desktop */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-white/5 transition-all group"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-black"
                      style={{ background: 'linear-gradient(135deg, #C8A24A, #B38A3D)' }}
                    >
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <ChevronDown
                      size={13}
                      className={cn(
                        'text-white/40 group-hover:text-white/70 transition-all',
                        userMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
                        style={{
                          background: 'rgba(14,14,14,0.97)',
                          border: '1px solid rgba(200,162,74,0.15)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                          backdropFilter: 'blur(24px)',
                        }}
                      >
                        <div className="px-3 py-2.5 border-b border-white/5">
                          <p className="text-xs text-white/40 truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          {[
                            { icon: User,      label: 'My Profile',    href: '/profile' },
                            { icon: Heart,     label: 'My Prayers',    href: '/profile?tab=prayers' },
                            { icon: Bookmark,  label: 'Saved Content', href: '/profile?tab=saved' },
                            { icon: Settings2, label: 'Settings',      href: '/profile/settings' },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <item.icon size={14} className="text-white/40" />
                              {item.label}
                            </Link>
                          ))}
                          {isAdmin && (
                            <>
                              <div className="my-1 border-t border-white/5" />
                              <Link
                                href="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gold hover:bg-gold/8 transition-all"
                              >
                                <Shield size={14} /> Admin Panel
                              </Link>
                            </>
                          )}
                          <div className="my-1 border-t border-white/5" />
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/8 transition-all"
                          >
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <button className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                      Log In
                    </button>
                  </Link>
                  <Link href="/register">
                    <button
                      className="px-4 py-2 text-sm font-semibold text-black rounded-lg transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, #C8A24A 0%, #B38A3D 100%)',
                        boxShadow: '0 0 16px rgba(200,162,74,0.3)',
                      }}
                    >
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ───────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-[99] pt-20 pb-8 px-6 lg:hidden overflow-y-auto max-h-screen"
            style={{
              background: 'rgba(8,8,8,0.98)',
              backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(200,162,74,0.1)',
            }}
          >
            <div className="space-y-6">
              {NAV_ITEMS.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 mb-3 px-1">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {group.children.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-xl transition-all',
                          pathname === item.path
                            ? 'bg-gold/10 border border-gold/20 text-gold'
                            : 'bg-white/3 border border-white/5 text-white/70 hover:text-white hover:bg-white/6'
                        )}
                      >
                        <item.icon size={15} className={pathname === item.path ? 'text-gold' : 'text-white/40'} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Auth */}
              <div className="pt-4 border-t border-white/5">
                {user ? (
                  <div className="space-y-2">
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3">
                        <User size={16} /> My Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 text-red-400 border-red-500/20 hover:border-red-500/40"
                      onClick={() => { logout(); setMobileOpen(false); }}
                    >
                      <LogOut size={16} /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">Log In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button variant="gold" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
