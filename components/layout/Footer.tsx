import Link from 'next/link';
import { Heart, Mail, Youtube, Instagram, Twitter, Facebook } from 'lucide-react';

const footerLinks = {
  ministry: [
    { name: 'Sermons', href: '/sermons' },
    { name: 'Podcasts', href: '/podcasts' },
    { name: 'Music', href: '/music' },
    { name: 'Worship', href: '/worship' },
    { name: 'Radio', href: '/radio' },
  ],
  community: [
    { name: 'Prayer Wall', href: '/community/prayer' },
    { name: 'Community Chat', href: '/community/chat' },
    { name: 'The Movement', href: '/movement' },
    { name: 'Give', href: '/give' },
    { name: 'News', href: '/news' },
  ],
  learn: [
    { name: 'Bible School', href: '/school' },
    { name: 'Devotions', href: '/devotions' },
    { name: 'About Us', href: '/movement' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socials = [
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#060606] border-t border-white/5">
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container mx-auto px-6 pt-20 pb-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-xl shadow-gold/20">
                <span className="text-black text-3xl font-light font-cinzel leading-none">✦</span>
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tighter text-white font-cinzel">
                  Christ Light
                </h2>
                <p className="text-[9px] text-gray-600 -mt-0.5 font-inter tracking-[3px]">MEDIA HOUSE</p>
              </div>
            </Link>
            <p className="text-gray-500 font-inter text-sm leading-relaxed max-w-sm mb-8">
              Equipping this generation with high-quality Christian media, 
              deep theology, and an unwavering commitment to the truth of Christ.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6">Ministry</h3>
            <ul className="space-y-3">
              {footerLinks.ministry.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors font-inter">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors font-inter">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6">Learn</h3>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors font-inter">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="rounded-2xl bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 border border-gold/10 p-8 md:p-12 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Mail className="text-gold" size={22} />
              </div>
              <div>
                <h3 className="text-white font-cinzel font-semibold text-lg">Stay Connected</h3>
                <p className="text-gray-400 text-sm font-inter">Get weekly devotions and updates delivered to your inbox.</p>
              </div>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-gold/50 focus:outline-none transition-colors"
              />
              <button className="bg-gold text-black px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gold-dark transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-gold/20">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-gray-600 font-inter">
            © {new Date().getFullYear()} Christ Light Media. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 font-inter flex items-center gap-1.5">
            Built with <Heart size={12} className="text-gold fill-gold" /> for the Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
}
