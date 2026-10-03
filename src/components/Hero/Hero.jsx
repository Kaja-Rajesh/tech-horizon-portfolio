import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronRight, ArrowDown, Sparkles, Activity } from 'lucide-react';
import './Hero.css';

// Reusable Quote/Statement Card Component with 3D Tilt, HUD Corners & Cursor Glow
const HeroQuoteCard = ({ label, quote, footer, accentColor = '#00d4ff', glowColor = 'rgba(0, 212, 255, 0.45)' }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
    const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }
  };

  return (
    <div
      className="hero-quote-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--card-color': accentColor,
        '--card-glow': glowColor,
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
      }}
    >
      {/* Dynamic Cursor Light inside Glass */}
      <div
        className="quote-cursor-glow"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Cyber crystal border glow */}
      <div className="quote-crystal-border" aria-hidden="true" />

      {/* Holographic HUD Corner Brackets */}
      <div className="quote-corner quote-corner--tl" aria-hidden="true" />
      <div className="quote-corner quote-corner--tr" aria-hidden="true" />
      <div className="quote-corner quote-corner--bl" aria-hidden="true" />
      <div className="quote-corner quote-corner--br" aria-hidden="true" />

      {/* Subtle interior ambient glow */}
      <div className="quote-ambient-glow" aria-hidden="true" />

      {/* Header: Label Tag + Quote Icon */}
      <div className="quote-card-header">
        <span className="quote-tag">{label}</span>
        <Quote size={14} className="quote-icon" />
      </div>

      {/* Main Readable Quote Text */}
      <p className="quote-text">{quote}</p>

      {/* Footer / Attribution */}
      <div className="quote-footer">
        <span className="quote-author">{footer}</span>
      </div>

      {/* Trapped Micro Particles */}
      <div className="quote-cosmic-particles" aria-hidden="true">
        <span className="cosmic-micro-dot dot-1" />
        <span className="cosmic-micro-dot dot-2" />
      </div>
    </div>
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  const coreRef = useRef(null);

  useEffect(() => {
    const onMouse = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (coreRef.current) {
        coreRef.current.style.transform = `perspective(1000px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translate3d(${x * 12}px, ${y * 12}px, 0)`;
      }

      const light = heroRef.current?.querySelector('.hero-cursor-light');
      if (light) {
        light.style.left = `${e.clientX - rect.left}px`;
        light.style.top = `${e.clientY - rect.top}px`;
      }
    };

    const hero = heroRef.current;
    hero?.addEventListener('mousemove', onMouse, { passive: true });
    return () => hero?.removeEventListener('mousemove', onMouse);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero" ref={heroRef}>
      {/* Ambient cursor spotlight */}
      <div className="hero-cursor-light" aria-hidden="true" />

      {/* Cyber space grid & command center aura */}
      <div className="hero-bg-grid" aria-hidden="true" />
      <div className="hero-ambient-glow hero-ambient-glow--cyan" aria-hidden="true" />
      <div className="hero-ambient-glow hero-ambient-glow--purple" aria-hidden="true" />

      {/* Connected Holographic Energy Network Lines (Quote Cards <-> Core) */}
      <svg className="hero-energy-network" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="energyCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 212, 255, 0)" />
            <stop offset="50%" stopColor="rgba(0, 212, 255, 0.45)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.7)" />
          </linearGradient>
          <filter id="energyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left conduits to central core */}
        <path
          d="M 280 340 C 440 340, 520 460, 620 460"
          className="energy-line energy-line--left1"
          stroke="url(#energyCyanGrad)"
          strokeWidth="1.2"
          fill="none"
          filter="url(#energyGlow)"
        />
        <path
          d="M 280 620 C 440 620, 520 500, 620 500"
          className="energy-line energy-line--left2"
          stroke="url(#energyCyanGrad)"
          strokeWidth="1.2"
          fill="none"
          filter="url(#energyGlow)"
        />

        {/* Right conduits to central core */}
        <path
          d="M 1160 340 C 1000 340, 920 460, 820 460"
          className="energy-line energy-line--right1"
          stroke="url(#energyCyanGrad)"
          strokeWidth="1.2"
          fill="none"
          filter="url(#energyGlow)"
        />
        <path
          d="M 1160 620 C 1000 620, 920 500, 820 500"
          className="energy-line energy-line--right2"
          stroke="url(#energyCyanGrad)"
          strokeWidth="1.2"
          fill="none"
          filter="url(#energyGlow)"
        />

        {/* Connection Junction Nodes */}
        <circle cx="620" cy="460" r="3.5" fill="#00d4ff" filter="url(#energyGlow)" className="energy-node-dot" />
        <circle cx="620" cy="500" r="3.5" fill="#a855f7" filter="url(#energyGlow)" className="energy-node-dot" />
        <circle cx="820" cy="460" r="3.5" fill="#00d4ff" filter="url(#energyGlow)" className="energy-node-dot" />
        <circle cx="820" cy="500" r="3.5" fill="#a855f7" filter="url(#energyGlow)" className="energy-node-dot" />
      </svg>

      <div className="hero-container">
        {/* Top Eyebrow Badge */}
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="hero-badge-dot" />
          <span className="hero-badge-text">KITS AKSHAR INSTITUTE OF TECHNOLOGY</span>
          <span className="hero-badge-sep">•</span>
          <span className="hero-badge-sub">CSE DEPARTMENT</span>
        </motion.div>

        {/* Hero Title & Subtitle */}
        <motion.div
          className="hero-heading-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h1 className="hero-title">
            TECH <span className="hero-title-gradient">HORIZON</span>
          </h1>
          <p className="hero-subtitle">Department of Computer Science & Engineering</p>
        </motion.div>

        {/* ==================================================================
            MAIN COMMAND STAGE:
            Large Tech Horizon Logo (Center) + 4 Surrounding Quote Cards (Sides)
            ================================================================== */}
        <div className="hero-command-stage">
          {/* LEFT COLUMN: Mission // 01 & Innovation // 02 */}
          <div className="hero-panels-col hero-panels-col--left">
            {/* Card 1 — Top Left */}
            <motion.div
              className="hero-panel-wrapper panel-float-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <HeroQuoteCard
                label="MISSION // 01"
                quote='"Code the Future. Shape the Horizon."'
                footer="— Tech Horizon Creed"
                accentColor="#00d4ff"
                glowColor="rgba(0, 212, 255, 0.45)"
              />
            </motion.div>

            {/* Card 2 — Bottom Left */}
            <motion.div
              className="hero-panel-wrapper panel-float-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
            >
              <HeroQuoteCard
                label="INNOVATION // 02"
                quote='"Innovation distinguishes between a leader and a follower."'
                footer="— Visionary Mindset"
                accentColor="#a855f7"
                glowColor="rgba(168, 85, 247, 0.45)"
              />
            </motion.div>
          </div>

          {/* ================================================================
              CENTER: MASSIVE TECH HORIZON HOLOGRAPHIC ORBITAL CORE
              (Desktop: 360px - 500px, Focal Point of Entire Hero)
              ================================================================ */}
          <motion.div
            className="hero-core-centerstage"
            ref={coreRef}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.2, type: 'spring', stiffness: 85 }}
          >
            {/* Halo Backdrop Glows */}
            <div className="hero-core-halo hero-core-halo--outer" />
            <div className="hero-core-halo hero-core-halo--inner" />

            {/* Continuous Orbital Rings */}
            {/* Ring 1: Slow Clockwise Telemetry Ring with Glowing Nodes */}
            <div className="hero-core-orbit hero-core-orbit--1">
              <span className="orbit-node orbit-node--1" />
              <span className="orbit-node orbit-node--2" />
              <span className="orbit-node orbit-node--3" />
            </div>

            {/* Ring 2: Slow Counter-Clockwise Holographic Arc Ring */}
            <div className="hero-core-orbit hero-core-orbit--2">
              <span className="orbit-node orbit-node--4" />
              <span className="orbit-node orbit-node--5" />
            </div>

            {/* Ring 3: 3D Inclined Gyroscopic Orbital Ring */}
            <div className="hero-core-orbit hero-core-orbit--3">
              <span className="orbit-node-spark" />
            </div>

            {/* Ring 4: Outer Radar Scanning Arc */}
            <div className="hero-core-orbit hero-core-orbit--4" />

            {/* Core Orbiting Stardust Energy Particles */}
            <div className="hero-core-particles" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="core-stardust-dot"
                  style={{
                    '--particle-angle': `${i * 45}deg`,
                    '--particle-radius': `${170 + (i % 3) * 35}px`,
                    '--particle-speed': `${14 + (i % 4) * 4}s`,
                    animationDelay: `${i * -2.2}s`,
                  }}
                />
              ))}
            </div>

            {/* ==============================================================
                THE OFFICIAL TECH HORIZON LOGO (EXACT ASSET, ASPECT-RATIO INTACT)
                ============================================================== */}
            <div className="hero-big-logo-wrap">
              <img
                src="/assets/logo.jpg"
                alt="Tech Horizon Official Logo"
                className="hero-big-logo-img"
              />
              {/* Holographic Laser Scan Sweep Passing Periodically */}
              <div className="hero-logo-scan-line" />
              {/* Glass Sheen Reflection */}
              <div className="hero-logo-glass-sheen" />
              {/* Conic Perimeter Light Sweep */}
              <div className="hero-logo-conic-sweep" />
            </div>

            {/* Core Command Status Emblem */}
            <div className="hero-core-emblem">
              <Sparkles size={13} className="hero-emblem-star" />
              <span>EST. CSE // TECH HORIZON</span>
              <Activity size={12} className="hero-emblem-pulse" />
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Motto // 03 & Excellence // 04 */}
          <div className="hero-panels-col hero-panels-col--right">
            {/* Card 3 — Top Right */}
            <motion.div
              className="hero-panel-wrapper panel-float-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <HeroQuoteCard
                label="MOTTO // 03"
                quote='"Explore. Innovate. Transform."'
                footer="— Student Community"
                accentColor="#06b6d4"
                glowColor="rgba(6, 182, 212, 0.45)"
              />
            </motion.div>

            {/* Card 4 — Bottom Right */}
            <motion.div
              className="hero-panel-wrapper panel-float-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <HeroQuoteCard
                label="EXCELLENCE // 04"
                quote='"Empowering curious minds to turn visionary ideas into reality."'
                footer="— KITS Akshar Leaders"
                accentColor="#ec4899"
                glowColor="rgba(236, 72, 153, 0.45)"
              />
            </motion.div>
          </div>
        </div>

        {/* Narrative Description */}
        <motion.p
          className="hero-narrative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Tech Horizon is the premier student-driven technology community at KITS Akshar Institute of Technology,
          where passionate developers collaborate, pioneer groundbreaking solutions, and shape the digital horizon.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="hero-cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <button
            className="hero-btn hero-btn--primary"
            onClick={() => scrollTo('leadership')}
            aria-label="View Leadership Timeline"
          >
            <span>OUR LEADERSHIP TIMELINE</span>
            <ChevronRight size={18} />
            <div className="btn-glow-bar" />
          </button>

          <button
            className="hero-btn hero-btn--secondary"
            onClick={() => scrollTo('department')}
            aria-label="About CSE Department"
          >
            <span>CSE DEPARTMENT</span>
          </button>

          <button
            className="hero-btn hero-btn--ghost"
            onClick={() => scrollTo('connect')}
            aria-label="Get in touch"
          >
            <span>GET IN TOUCH</span>
          </button>
        </motion.div>

        {/* Metric Badges Ribbon */}
        <motion.div
          className="hero-ribbon"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="ribbon-item">
            <Sparkles size={16} className="ribbon-icon ribbon-icon--gold" />
            <span>Student-Driven Technology Community</span>
          </div>
          <span className="ribbon-divider" />
          <div className="ribbon-item">
            <span className="ribbon-stat">660+</span>
            <span>Graduated CSE Engineers</span>
          </div>
          <span className="ribbon-divider" />
          <div className="ribbon-item">
            <span className="ribbon-stat">9</span>
            <span>Dedicated Leaders & Mentors</span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator" onClick={() => scrollTo('about')} aria-label="Scroll down">
          <ArrowDown size={18} className="scroll-arrow" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
