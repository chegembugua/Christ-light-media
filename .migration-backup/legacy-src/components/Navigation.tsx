import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, LogIn, LogOut, Shield, User, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { useState, useEffect } from 'react';
import GlobalSearchModal from './GlobalSearchModal';
import NotificationBell from './NotificationBell';
import { Button } from './ui/button';

export default function Navigation() {
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
    { name: 'Community', path: '/community/prayer-requests' },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-xl shadow-gold/20 group-hover:shadow-[0_0_25px_rgba(200,162,74,0.5)] transition-all">
              <span className="text-black text-3xl font-light font-serif leading-none">✦</span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tighter text-white group-hover:text-gold transition-colors font-serif">
                Christ Light
              </h1>
              <p className="text-[10px] text-gray-500 -mt-1 font-mono tracking-[3px] relative -top-0.5">MEDIA HOUSE</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium tracking-wide text-gray-300 hover:text-gold transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:block relative w-64 lg:w-72">
              <input
                type="text"
                placeholder="Search the Word..."
                onClick={() => setIsSearchOpen(true)}
                readOnly
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-full py-2.5 pl-10 cursor-pointer text-sm font-light text-white focus:outline-none focus:border-gold/50 transition-colors placeholder:text-gray-500 hover:bg-[#222]"
              />
              <Search className="absolute left-4 top-3 h-4 w-4 text-gray-500" />
            </div>

            <button onClick={() => setIsSearchOpen(true)} className="md:hidden text-gray-300 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            {user && <NotificationBell />}

            {/* User Profile */}
            {user ? (
              <div className="relative hidden md:block">
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="hidden lg:flex flex-col items-end">
                    <p className="text-sm font-medium text-white group-hover:text-gold transition-colors">Welcome back,</p>
                    <p className="text-sm text-gold font-medium mb-0">{user.displayName ? user.displayName.split(" ")[0] : 'Believer'}</p>
                  </div>
                  
                  <div className="w-[40px] h-[40px] rounded-2xl overflow-hidden border border-[#C8A24A]/30 group-hover:border-[#C8A24A] transition-colors">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center text-white text-xs font-bold">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 py-2 bg-[#121212] border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" /> Profile
                    </Link>
                    
                    {isAdmin && (
                      <Link 
                        to="/admin/dashboard" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gold hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Shield className="w-4 h-4" /> Admin
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/admin/login" className="hidden md:block">
                <Button variant="gold" size="sm" className="px-6 rounded-2xl font-semibold tracking-wide h-10 w-auto inline-flex items-center">
                  Join the Light
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-3xl relative z-50 text-white"
            >
              <span className={`block transition-all duration-500 ${isMenuOpen ? 'rotate-45 scale-90' : ''}`}>+</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-[#0A0A0A] z-40 transition-opacity duration-500 lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col h-full pt-28 px-8 pb-12 overflow-y-auto">
            <div className="flex flex-col space-y-6 flex-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-3xl font-light text-white hover:text-gold transition-all duration-300 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'} font-serif`}
                  style={{ transitionDelay: `${isMenuOpen ? index * 60 : 0}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/about"
                className={`text-3xl font-light text-white hover:text-gold transition-all duration-300 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'} font-serif`}
                style={{ transitionDelay: `${isMenuOpen ? navLinks.length * 60 : 0}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-8 border-t border-white/10 shrink-0">
              {user ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center overflow-hidden shadow-xl shadow-black/50">
                       {user.photoURL ? (
                         <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <User className="w-6 h-6 text-gray-400" />
                       )}
                     </div>
                     <div>
                       <p className="text-sm text-gray-400 mb-0 leading-tight">Welcome back,</p>
                       <p className="text-xl font-medium text-white mb-0 leading-tight">{user.displayName ? user.displayName.split(" ")[0] : 'Believer'}</p>
                     </div>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-xl text-gray-300 hover:text-white transition-colors"
                  >
                    My Profile
                  </Link>

                  {isAdmin && (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-xl text-gold hover:text-gold-dark transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-xl text-red-400 hover:text-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="gold" className="w-full text-lg py-6 h-auto rounded-full font-semibold">Join the Light</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

