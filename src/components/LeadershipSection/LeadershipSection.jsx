import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { leadershipData } from '../../data/leadership';
import LeadershipCard from '../LeadershipCard/LeadershipCard';
import LeadershipSpaceBackground from './LeadershipSpaceBackground';
import { Compass, Cpu, Award, Users, BookOpen, ChevronUp } from 'lucide-react';
import './LeadershipSection.css';

/* ==========================================================================
   INTER-CARD VERTICAL CONSTELLATION CONNECTOR (Subtle Line + Node ✦)
   ========================================================================== */
const ConstellationConnector = ({ prevColor = '#00d4ff', nextColor = '#a855f7', prefersReducedMotion = false }) => {
  const connRef = useRef(null);
  const isInView = useInView(connRef, { once: true, margin: '-40px 0px -20px 0px' });

  return (
    <div ref={connRef} className="vertical-constellation-connector" aria-hidden="true">
      {/* Top Half Line */}
      <motion.div
        className="connector-line connector-line--top"
        style={{
          background: `linear-gradient(to bottom, ${prevColor}40, rgba(0, 212, 255, 0.5))`,
        }}
        initial={prefersReducedMotion ? { opacity: 1, scaleY: 1 } : { scaleY: 0, opacity: 0 }}
        animate={isInView || prefersReducedMotion ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />

      {/* Middle Glowing Constellation Star Node (✦) */}
      <motion.div
        className="connector-node-wrapper"
        initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { scale: 0, opacity: 0 }}
        animate={isInView || prefersReducedMotion ? { scale: [0, 1.4, 1], opacity: [0, 1, 0.95] } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg className="connector-star-svg" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="connStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <path
            d="M12 2 L13.8 9.2 L21 11 L13.8 12.8 L12 20 L10.2 12.8 L3 11 L10.2 9.2 Z"
            fill="url(#connStarGrad)"
            stroke="rgba(0, 212, 255, 0.85)"
            strokeWidth="0.8"
          />
        </svg>
        <div className="connector-node-pulse" />
      </motion.div>

      {/* Bottom Half Line */}
      <motion.div
        className="connector-line connector-line--bottom"
        style={{
          background: `linear-gradient(to bottom, rgba(0, 212, 255, 0.5), ${nextColor}40)`,
        }}
        initial={prefersReducedMotion ? { opacity: 1, scaleY: 1 } : { scaleY: 0, opacity: 0 }}
        animate={isInView || prefersReducedMotion ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.45, delay: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
      />
    </div>
  );
};

/* ==========================================================================
   INDIVIDUAL SCROLL-ACTIVATING LEADERSHIP CARD NODE
   Activates sequentially as each card enters the viewport upon scrolling down
   ========================================================================== */
const LeadershipVerticalNode = ({
  item,
  index,
  isHOD,
  onHODToggle,
  isHODExpanded,
  onCardClick,
  prefersReducedMotion,
}) => {
  const nodeRef = useRef(null);
  // Each card activates individually when it enters the viewport
  const isInView = useInView(nodeRef, {
    once: true,
    margin: '-70px 0px -40px 0px',
  });

  return (
    <div ref={nodeRef} className={`leadership-vertical-node-slot ${isHOD ? 'slot--hod' : ''}`}>
      <motion.div
        className={`leadership-card-wrapper ${isHOD ? 'wrapper--hod' : ''}`}
        initial={
          prefersReducedMotion
            ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, y: 60, scale: 0.94, filter: 'blur(8px)' }
        }
        animate={
          isInView || prefersReducedMotion
            ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, y: 60, scale: 0.94, filter: 'blur(8px)' }
        }
        transition={{
          duration: prefersReducedMotion ? 0.01 : 0.75,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Subtle Futuristic Activation Effect when entering viewport */}
        {isInView && !prefersReducedMotion && (
          <>
            {/* 1. Subtle Cyan/Violet Glow Flash */}
            <motion.div
              className="card-entrance-glow-flash"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.9, 1.08, 1.0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                background: `radial-gradient(circle at 50% 50%, ${item.glowColor || 'rgba(0, 212, 255, 0.45)'} 0%, rgba(168, 85, 247, 0.22) 45%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            {/* 2. Tiny Constellation Node Badge (✦) */}
            <motion.div
              className="card-constellation-node-badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.85] }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <div
                className="node-diamond-core"
                style={{ color: item.accentColor || '#00d4ff', backgroundColor: item.accentColor || '#00d4ff' }}
              />
              <motion.div
                className="node-ring-pulse"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [0.6, 2.2], opacity: [0, 0.75, 0] }}
                transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
                style={{ borderColor: item.accentColor || '#00d4ff' }}
              />
            </motion.div>

            {/* 3. Subtle Light Sweep Shimmer */}
            <motion.div
              className="card-entrance-sweep"
              initial={{ x: '-130%', opacity: 0 }}
              animate={{ x: '130%', opacity: [0, 0.35, 0] }}
              transition={{ duration: 0.75, delay: 0.1, ease: 'easeInOut' }}
              aria-hidden="true"
            />

            {/* 4. Small Stardust Micro-Sparks */}
            <div className="card-entrance-sparks" aria-hidden="true">
              {[
                { x: -26, y: -24, color: item.accentColor || '#00d4ff', delay: 0 },
                { x: 28, y: -20, color: '#a855f7', delay: 0.03 },
                { x: -30, y: 22, color: '#38bdf8', delay: 0.06 },
                { x: 32, y: 24, color: '#c084fc', delay: 0.04 },
                { x: 0, y: -34, color: '#ffffff', delay: 0.02 },
              ].map((p, pIdx) => (
                <motion.span
                  key={pIdx}
                  className="entrance-micro-spark"
                  style={{ backgroundColor: p.color, color: p.color }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0],
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.1 + p.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </>
        )}

        <LeadershipCard
          item={item}
          index={index}
          isHOD={isHOD}
          onHODToggle={onHODToggle}
          isHODExpanded={isHODExpanded}
          onCardClick={onCardClick}
        />
      </motion.div>
    </div>
  );
};

/* ==========================================================================
   MAIN LEADERSHIP SECTION COMPONENT
   ========================================================================== */
const LeadershipSection = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });
  const [showHODDeptInfo, setShowHODDeptInfo] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Track reduced-motion preference
  useEffect(() => {
    const checkMotion = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    checkMotion();
    window.addEventListener('resize', checkMotion);
    return () => window.removeEventListener('resize', checkMotion);
  }, []);

  // Subtle mouse parallax across the space environment
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouseOffset({ x, y });
    };

    const sectionEl = sectionRef.current;
    sectionEl?.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => sectionEl?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleHODDept = () => {
    setShowHODDeptInfo((prev) => !prev);
  };

  // Called when any card is clicked: sends shockwave pulse to live space background
  const handleCardClick = ({ x, y }) => {
    if (bgRef.current) {
      bgRef.current.triggerPulse(x, y);
    }
  };

  return (
    <section id="leadership" className="leadership section-padding" ref={sectionRef}>
      {/* ====================================================================
          LIVE ANIMATED SPACE ENVIRONMENT BACKGROUND
          Continuously moving starfield, fluid nebulas, orbits, satellites & click reaction
          ==================================================================== */}
      <LeadershipSpaceBackground ref={bgRef} mouseOffset={mouseOffset} />

      <div className="section-container leadership-container">
        {/* ====================================================================
            CINEMATIC HEADER WITH STARS, CONSTELLATION & SCANNING LIGHT
            ==================================================================== */}
        <div className="leadership-header-stage">
          {/* Animated Header Constellation Ticks */}
          <div className="header-constellation-nodes" aria-hidden="true">
            <span className="constellation-star star-1" />
            <span className="constellation-star star-2" />
            <span className="constellation-star star-3" />
            <span className="constellation-star star-4" />
          </div>

          {/* Eyebrow */}
          <motion.div
            className="leadership-eyebrow"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Compass size={13} className="eyebrow-compass-icon" />
            <span>TECH HORIZON // CONSTELLATION</span>
            <span className="eyebrow-dot" />
            <span className="eyebrow-status">VERTICAL ARCHITECTURE</span>
          </motion.div>

          {/* Main Title: OUR LEADERSHIP */}
          <motion.div
            className="leadership-title-wrap"
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h2 className="leadership-main-title">
              OUR <span className="leadership-title-gradient">LEADERSHIP</span>
            </h2>
            {/* Holographic Laser Scan Sweep across title */}
            <div className="leadership-title-scan" />
            <div className="section-line" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="leadership-subtitle"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            "The minds shaping the future of Tech Horizon."
          </motion.p>
        </div>

        {/* ====================================================================
            VERTICAL CONSTELLATION PATH (1 Card per row, connected top-to-bottom)
            HOD -> Faculty -> Faculty -> President -> VP -> Secretary -> Joint -> Treasurer -> Tech Lead
            ==================================================================== */}
        <div className="leadership-vertical-constellation">
          {/* Continuous subtle vertical constellation guide spine */}
          <div className="vertical-constellation-spine" aria-hidden="true">
            <div className="spine-glow-line" />
          </div>

          {leadershipData.map((item, idx) => {
            const isHOD = idx === 0;
            const prevColor = idx > 0 ? leadershipData[idx - 1].accentColor : '#00d4ff';

            return (
              <React.Fragment key={item.id}>
                {/* Inter-card constellation connector between cards */}
                {idx > 0 && (
                  <ConstellationConnector
                    prevColor={prevColor}
                    nextColor={item.accentColor}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                )}

                {/* Individual Card Node (Scroll Triggered) */}
                <LeadershipVerticalNode
                  item={item}
                  index={idx}
                  isHOD={isHOD}
                  onHODToggle={isHOD ? toggleHODDept : null}
                  isHODExpanded={showHODDeptInfo}
                  onCardClick={handleCardClick}
                  prefersReducedMotion={prefersReducedMotion}
                />

                {/* Expandable CSE Department Information Panel (Under HOD) */}
                {isHOD && (
                  <AnimatePresence>
                    {showHODDeptInfo && (
                      <motion.div
                        className="hod-expanded-dept-panel glass-card"
                        initial={{ opacity: 0, height: 0, y: -20, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, height: 'auto', y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, height: 0, y: -20, filter: 'blur(6px)' }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="dept-panel-inner">
                          <div className="dept-panel-top-bar">
                            <div className="dept-panel-title-group">
                              <Cpu size={16} className="dept-cpu-icon" />
                              <span>DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING — STRATEGIC VISION</span>
                            </div>
                            <button
                              type="button"
                              className="dept-close-btn"
                              onClick={() => setShowHODDeptInfo(false)}
                              aria-label="Collapse Department Info"
                            >
                              <span>COLLAPSE</span>
                              <ChevronUp size={15} />
                            </button>
                          </div>

                          <div className="dept-panel-body">
                            <p className="dept-lead-text">
                              Under the visionary stewardship of Dr. Guru Kesav Das Gopisetty, the Department of Computer Science & Engineering stands as a beacon of academic rigor, research excellence, and hands-on technological mastery.
                            </p>

                            <div className="dept-stat-pills">
                              <div className="dept-stat-pill">
                                <BookOpen size={14} className="stat-pill-icon" />
                                <span>ESTD. 2008</span>
                              </div>
                              <div className="dept-stat-pill">
                                <Users size={14} className="stat-pill-icon" />
                                <span>660+ CSE GRADUATES</span>
                              </div>
                              <div className="dept-stat-pill">
                                <Cpu size={14} className="stat-pill-icon" />
                                <span>12+ ADVANCED COMPUTING LABS</span>
                              </div>
                              <div className="dept-stat-pill">
                                <Award size={14} className="stat-pill-icon" />
                                <span>TOP MNC RECRUITMENT PARTNERS</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
