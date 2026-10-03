import React from 'react';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      {/* Animated grid */}
      <div className="footer-grid" aria-hidden="true" />

      {/* Top neon line */}
      <div className="footer-neon-line" aria-hidden="true" />

      {/* Particles */}
      <div className="footer-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="footer-particle"
            style={{
              left: `${(i / 12) * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="footer-inner section-container">
        {/* Logo + Brand */}
        <div className="footer-brand">
          <img src="/assets/logo.jpg" alt="Tech Horizon Logo" className="footer-logo" />
          <div>
            <div className="footer-title">TECH HORIZON</div>
            <div className="footer-inst">KITS Akshar Institute of Technology</div>
            <div className="footer-dept">Department of Computer Science and Engineering</div>
          </div>
        </div>

        {/* Tagline */}
        <div className="footer-tagline">Explore. Innovate. Transform.</div>

        {/* Social links */}
        <div className="footer-links">
          <a
            href="mailto:kitsakshartechhorizon@gmail.com"
            className="footer-link"
            aria-label="Email Tech Horizon"
          >
            <Mail size={18} />
            <span>kitsakshartechhorizon@gmail.com</span>
          </a>
          <a
            href="https://www.linkedin.com/in/tech-horizon-b19ba0439"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="Tech Horizon on LinkedIn"
          >
            <Linkedin size={18} />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://www.instagram.com/techhorizon_kitsakshar"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="Tech Horizon on Instagram"
          >
            <Instagram size={18} />
            <span>Instagram</span>
          </a>
        </div>

        {/* Bottom line */}
        <div className="footer-bottom-line" aria-hidden="true" />
        <div className="footer-copyright">
          © {new Date().getFullYear()} Tech Horizon — KITS Akshar Institute of Technology
        </div>
      </div>
    </footer>
  );
};

export default Footer;
