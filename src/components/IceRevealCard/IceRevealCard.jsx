import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Telescope, Lightbulb, Users, Zap, Sparkles } from 'lucide-react';
import AudioManager from '../../audio/AudioManager';
import './IceRevealCard.css';

const DEFAULT_CONFIGS = {
  explore: {
    id: '01',
    code: 'SEC-EXP',
    title: 'Explore',
    description: 'Explore new possibilities',
    icon: Telescope,
    accentColor: '#00d4ff',
    glowColor: 'rgba(0, 212, 255, 0.55)',
  },
  innovate: {
    id: '02',
    code: 'SEC-INV',
    title: 'Innovate',
    description: 'Turn ideas into solutions',
    icon: Lightbulb,
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.55)',
  },
  collaborate: {
    id: '03',
    code: 'SEC-COL',
    title: 'Collaborate',
    description: 'Work together and grow',
    icon: Users,
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.55)',
  },
  transform: {
    id: '04',
    code: 'SEC-TRF',
    title: 'Transform',
    description: 'Create real world impact',
    icon: Zap,
    accentColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.55)',
  },
};

const NUM_SHARDS = 16;

const IceRevealCard = ({ cardKey = 'explore', title, description, icon, accentColor }) => {
  const fallback = DEFAULT_CONFIGS[cardKey] || DEFAULT_CONFIGS.explore;
  const cardTitle = title || fallback.title;
  const cardDesc = description || fallback.description;
  const IconComponent = icon || fallback.icon;
  const cardColor = accentColor || fallback.accentColor;
  const glowColor = fallback.glowColor;
  const cardId = fallback.id;
  const cardCode = fallback.code;

  const [revealed, setRevealed] = useState(false);
  const [isBlasting, setIsBlasting] = useState(false);
  const [shards, setShards] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  // 3D subtle tilt on hover
  const handleMouseMove = useCallback((e) => {
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
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }
  }, []);

  // Click interaction: Toggle between Frozen and Revealed
  const handleClick = useCallback(() => {
    if (isBlasting) return;

    if (!revealed) {
      // Trigger synchronized crystal crack, energy charge & futuristic blast sound
      AudioManager.playCrystalCrackAndBlast();

      // 1. Generate radial crystal shards
      const newShards = Array.from({ length: NUM_SHARDS }, (_, i) => ({
        id: i,
        angle: (i / NUM_SHARDS) * 360 + Math.random() * 20,
        dist: 75 + Math.random() * 110,
        rot: Math.random() * 720 - 360,
        size: Math.random() * 9 + 4,
        delay: Math.random() * 0.08,
      }));
      setShards(newShards);
      setIsBlasting(true);

      // 2. Blast transition to revealed
      setTimeout(() => {
        setRevealed(true);
        setIsBlasting(false);
      }, 500);
    } else {
      // Trigger reverse energy & crystal reformation sound
      AudioManager.playCrystalReform();

      // Re-freeze transition: Smoothly contracts and reforms ice
      setIsBlasting(true);
      setTimeout(() => {
        setRevealed(false);
        setShards([]);
        setIsBlasting(false);
      }, 350);
    }
  }, [revealed, isBlasting]);

  return (
    <div
      className={`ice-card holo-panel ${revealed ? 'ice-card--revealed' : 'ice-card--frozen'} ${isBlasting ? 'ice-card--blasting' : ''}`}
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      aria-label={revealed ? `${cardTitle} - ${cardDesc}` : 'Frozen holographic crystal panel - click to reveal'}
      style={{
        '--card-color': cardColor,
        '--card-glow': glowColor,
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
      }}
    >
      {/* Dynamic Cursor Light inside Glass */}
      <div className="ice-cursor-glow" aria-hidden="true" />

      {/* Cyber crystal border glow */}
      <div className="ice-crystal-border" aria-hidden="true" />

      {/* Holographic HUD corner brackets */}
      <div className="ice-corner ice-corner--tl" aria-hidden="true" />
      <div className="ice-corner ice-corner--tr" aria-hidden="true" />
      <div className="ice-corner ice-corner--bl" aria-hidden="true" />
      <div className="ice-corner ice-corner--br" aria-hidden="true" />

      {/* Futuristic HUD Header Strip */}
      <div className="holo-hud-header" aria-hidden="true">
        <span className="holo-hud-tag">MODULE // {cardId}</span>
        <span className="holo-hud-code">[{cardCode}]</span>
      </div>

      {/* ====================================================================
          INITIAL FROZEN STATE (NO WORDS / NO TITLES / PURE CRYSTAL ICE)
          ==================================================================== */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            className="ice-frozen-capsule"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.45 }}
          >
            {/* Frosted ice surface texture */}
            <div className="ice-frost-layer" />
            <div className="ice-texture-noise" />

            {/* Subtle crystalline crack lines */}
            <svg className="ice-cracks-svg" viewBox="0 0 100 120" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M10,15 L32,48 L52,42 L68,78 L90,105"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M52,42 L72,28 L88,12"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="0.8"
                fill="none"
              />
              <path
                d="M32,48 L18,80 L8,95"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="0.8"
                fill="none"
              />
              <circle cx="52" cy="42" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
              <circle cx="32" cy="48" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
            </svg>

            {/* Internal trapped glowing crystal core */}
            <div className="ice-internal-core">
              <div className="ice-core-glow" />
              <div className="ice-core-ring" />
              <Sparkles size={20} className="ice-core-sparkle" />
            </div>

            {/* Trapped floating micro particles inside the ice */}
            <div className="ice-particles-container" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="ice-trapped-dot"
                  style={{
                    left: `${18 + (i * 17) % 65}%`,
                    top: `${18 + (i * 23) % 64}%`,
                    animationDelay: `${i * 0.35}s`,
                  }}
                />
              ))}
            </div>

            {/* Frost shimmer light sweep */}
            <div className="ice-shimmer-sweep" />

            {/* Holographic Status Indicator */}
            <div className="holo-lock-status">
              <span className="holo-lock-dot" />
              <span>STATION CORE LOCKED</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          BLASTING / SHATTER ANIMATION (Crystal shards + radial shockwave)
          ==================================================================== */}
      <AnimatePresence>
        {isBlasting && (
          <div className="ice-blast-stage" aria-hidden="true">
            {shards.map((s) => (
              <motion.div
                key={s.id}
                className="ice-crystal-shard"
                style={{ '--shard-size': `${s.size}px` }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((s.angle * Math.PI) / 180) * s.dist,
                  y: Math.sin((s.angle * Math.PI) / 180) * s.dist,
                  rotate: s.rot,
                  opacity: 0,
                  scale: 0.1,
                }}
                transition={{ duration: 0.5, delay: s.delay, ease: 'easeOut' }}
              />
            ))}
            <motion.div
              className="ice-radial-wave"
              initial={{ scale: 0.2, opacity: 0.95 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
            <motion.div
              className="ice-blast-flash"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          REVEALED STATE (ICON + TITLE + DESCRIPTION CENTERED LOWER)
          ==================================================================== */}
      <AnimatePresence>
        {revealed && !isBlasting && (
          <motion.div
            className="ice-revealed-stage"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="revealed-ambient-glow" aria-hidden="true" />

            {/* UPPER-MIDDLE: Glowing Icon with Orbit */}
            <div className="revealed-icon-wrap">
              <div className="revealed-icon-halo" />
              <div className="revealed-icon-ring" />
              <IconComponent size={32} className="revealed-icon-svg" />
            </div>

            {/* LOWER SECTION: Title + Description */}
            <div className="revealed-text-block">
              <motion.h3
                className="revealed-title"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {cardTitle}
              </motion.h3>

              <motion.p
                className="revealed-desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
              >
                {cardDesc}
              </motion.p>

              {/* Status active telemetry pill */}
              <div className="revealed-status-pill">
                <span className="status-dot-active" />
                <span>ONLINE // READY</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(IceRevealCard);
