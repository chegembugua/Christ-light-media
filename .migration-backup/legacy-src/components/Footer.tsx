import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-base border-t border-surface-hover mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 group shrink-0 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <span className="text-black text-xl font-bold font-serif leading-none">✧</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tighter text-gray-300 group-hover:text-gold transition-colors font-serif">
                  Christ Light
                </h1>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Proclaiming the Gospel, equipping the saints, and fostering a global community of discipleship.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium uppercase tracking-widest text-xs mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Portfolio', 'Devotions', 'Music'].map((link) => (
                <li key={link}>
                  <Link to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="text-gray-400 hover:text-gold transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium uppercase tracking-widest text-xs mb-6">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-gold transition-colors text-sm">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gold transition-colors text-sm">Join the Community</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gold transition-colors text-sm">Subscribe</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium uppercase tracking-widest text-xs mb-6">Social</h4>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-surface hover:bg-surface-hover flex items-center justify-center text-gray-400 hover:text-gold transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="border-t border-surface-hover mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} In For Christ Media. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
