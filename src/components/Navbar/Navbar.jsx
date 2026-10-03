import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Volume2, VolumeX } from 'lucide-react';
import AudioManager from '../../audio/AudioManager';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'CSE Department', href: '#department' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Connect', href: '#connect' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMuted, setIsMuted] = useState(() => AudioManager.getMuted());

  useEffect(() => {
    // Sync with AudioManager mute state
    const unsubscribe = AudioManager.subscribe((muted) => {
      setIsMuted(muted);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleAudio = () => {
    AudioManager.toggleMute();
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['home', 'about', 'department', 'leadership', 'connect'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">
          {/* Logo */}
          <button
            className="navbar-logo"
            onClick={() => handleNav('#home')}
            aria-label="Tech Horizon Home"
          >
            <div className="navbar-logo-wrap">
              <img src="/assets/logo.jpg" alt="Tech Horizon Logo" className="navbar-logo-img" />
              <div className="navbar-logo-glow" />
            </div>
            <div className="navbar-brand-group">
              <span className="navbar-brand">TECH HORIZON</span>
              <span className="navbar-brand-sub">KITS AKSHAR CSE</span>
            </div>
          </button>

          {/* Desktop links */}
          <ul className="navbar-links" role="list">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <li key={link.label}>
                  <button
                    className={`navbar-link ${isActive ? 'navbar-link--active' : ''}`}
                    onClick={() => handleNav(link.href)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        className="navbar-active-pill"
                        layoutId="nav-pill"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right Action */}
          <div className="navbar-right">
            {/* Futuristic Audio Mute/Unmute Toggle */}
            <button
              className={`navbar-audio-toggle ${isMuted ? 'navbar-audio-toggle--muted' : 'navbar-audio-toggle--active'}`}
              onClick={handleToggleAudio}
              aria-label={isMuted ? 'Unmute space sound' : 'Mute space sound'}
              title={isMuted ? 'Unmute Sound Effects & Ambience' : 'Mute All Audio'}
            >
              {isMuted ? (
                <VolumeX size={15} className="audio-toggle-icon" />
              ) : (
                <span className="audio-active-wrap">
                  <Volume2 size={15} className="audio-toggle-icon" />
                  <span className="audio-wave-dot" aria-hidden="true" />
                </span>
              )}
            </button>

            <button
              className="navbar-cta-pill"
              onClick={() => handleNav('#leadership')}
              aria-label="Explore Leadership"
            >
              <Sparkles size={13} className="navbar-cta-sparkle" />
              <span>LEADERSHIP</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            role="menu"
          >
            <div className="mobile-menu-inner">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.label}
                  className={`mobile-menu-link ${activeSection === link.href.replace('#', '') ? 'mobile-menu-link--active' : ''}`}
                  onClick={() => handleNav(link.href)}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  role="menuitem"
                >
                  <span className="mobile-menu-index">0{i + 1}</span>
                  <span>{link.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
