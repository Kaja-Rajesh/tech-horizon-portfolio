import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import AudioManager from '../../audio/AudioManager';
import './LeadershipCard.css';

const NUM_SHARDS = 16;

const LeadershipCard = ({
  item,
  index,
  isHOD = false,
  onHODToggle = null,
  isHODExpanded = false,
  onCardClick = null,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [isBlasting, setIsBlasting] = useState(false);
  const [shards, setShards] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef(null);

  // 3D subtle perspective tilt on hover (NEVER reveals photo)
  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
    const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(850px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }
  }, []);

  // Click interaction: Digital Ice Shatter & Reveal / Refreeze
  const handleClick = useCallback((e) => {
    // If click is on the special HOD CSE Department toggle button, let that button handle it
    if (e.target.closest('.hod-dept-action-btn')) return;

    if (isBlasting) return;

    // Notify parent for cosmic background interaction
    if (cardRef.current && onCardClick) {
      const rect = cardRef.current.getBoundingClientRect();
      const parentEl = cardRef.current.closest('#leadership');
      const parentRect = parentEl?.getBoundingClientRect();
      const clickX = parentRect ? (rect.left + rect.width / 2) - parentRect.left : e.clientX;
      const clickY = parentRect ? (rect.top + rect.height / 2) - parentRect.top : e.clientY;
      onCardClick({ x: clickX, y: clickY, index, isRevealing: !revealed });
    }

    if (!revealed) {
      // Trigger synchronized crystal crack, energy charge & futuristic blast sound
      AudioManager.playCrystalCrackAndBlast();

      // 1. Generate radial crystal shards
      const newShards = Array.from({ length: NUM_SHARDS }, (_, i) => ({
        id: i,
        angle: (i / NUM_SHARDS) * 360 + Math.random() * 20,
        dist: 85 + Math.random() * 120,
        rot: Math.random() * 720 - 360,
        size: Math.random() * 9 + 4,
        delay: Math.random() * 0.08,
      }));
      setShards(newShards);
      setIsBlasting(true);

      // 2. Blast transition to revealed state
      setTimeout(() => {
        setRevealed(true);
        setIsBlasting(false);
      }, 550);
    } else {
      // Trigger reverse energy & crystal reformation sound
      AudioManager.playCrystalReform();

      // Re-freeze transition: Smoothly contracts and reforms crystal ice
      setIsBlasting(true);
      setTimeout(() => {
        setRevealed(false);
        setShards([]);
        setIsBlasting(false);
      }, 380);
    }
  }, [revealed, isBlasting, onCardClick, index]);

  const glowStyle = {
    '--card-glow': item.glowColor || '#00d4ff',
    '--accent-color': item.accentColor || '#00d4ff',
    '--mouse-x': `${mousePos.x}%`,
    '--mouse-y': `${mousePos.y}%`,
  };

  return (
    <div
      className={`leadership-crystal-card ${isHOD ? 'card--hod' : ''} ${
        revealed ? 'card--revealed' : 'card--frozen'
      } ${isBlasting ? 'card--blasting' : ''}`}
      ref={cardRef}
      style={glowStyle}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick(e)}
      aria-label={
        revealed
          ? `${item.name}, ${item.role} - Click to refreeze card`
          : `${item.role} - Frozen cosmic capsule, click to shatter and reveal profile`
      }
    >
      {/* Dynamic Cursor Light inside Glass */}
      <div className="crystal-cursor-glow" aria-hidden="true" />

      {/* Cyber crystal border glow */}
      <div className="crystal-border-glow" aria-hidden="true" />

      {/* Holographic HUD Corner Brackets */}
      <div className="crystal-corner crystal-corner--tl" aria-hidden="true" />
      <div className="crystal-corner crystal-corner--tr" aria-hidden="true" />
      <div className="crystal-corner crystal-corner--bl" aria-hidden="true" />
      <div className="crystal-corner crystal-corner--br" aria-hidden="true" />

      {/* Futuristic Telemetry Header Strip */}
      <div className="crystal-hud-header" aria-hidden="true">
        <span className="hud-node-tag">NODE // 0{index + 1}</span>
        <span className="hud-code-badge">{isHOD ? 'COMMAND-01' : item.category === 'faculty' ? 'FACULTY' : 'COUNCIL'}</span>
      </div>

      {/* ====================================================================
          INITIAL FROZEN STATE: ONLY ROLE IS VISIBLE (NO PHOTO, NO NAME)
          ==================================================================== */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            className="crystal-frozen-capsule"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.45 }}
          >
            {/* Frost ice surface textures */}
            <div className="crystal-frost-layer" />
            <div className="crystal-noise-layer" />

            {/* Crystalline crack lines */}
            <svg className="crystal-cracks-svg" viewBox="0 0 100 120" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M15,18 L38,45 L50,40 L65,75 L88,102"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M50,40 L72,25 L88,12"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="0.8"
                fill="none"
              />
              <path
                d="M38,45 L22,78 L12,94"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="0.8"
                fill="none"
              />
              <circle cx="50" cy="40" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
              <circle cx="38" cy="45" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
            </svg>

            {/* Center Trapped Energy Core */}
            <div className="crystal-internal-core">
              <div className="core-energy-glow" />
              <div className="core-orbit-ring" />
              <Sparkles size={24} className="core-sparkle-icon" />
            </div>

            {/* Trapped Micro Floating Particles */}
            <div className="crystal-trapped-particles" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="trapped-dot"
                  style={{
                    left: `${18 + (i * 18) % 64}%`,
                    top: `${16 + (i * 24) % 68}%`,
                    animationDelay: `${i * 0.38}s`,
                  }}
                />
              ))}
            </div>

            {/* Frosted Shimmer Light Sweep */}
            <div className="crystal-shimmer-sweep" />

            {/* FROZEN STATE CONTENT: ONLY THE ROLE IS VISIBLE */}
            <div className="frozen-content-block">
              <span className="frozen-node-sub">COSMIC CAPSULE</span>
              <h3 className="frozen-role-display">{item.role}</h3>

              <div className="frozen-lock-status">
                <span className="lock-dot" />
                <span>❄ FROZEN CRYSTAL ❄</span>
              </div>

              <div className="frozen-click-hint">
                <span className="hint-pulse-dot" />
                <span>CLICK TO SHATTER & REVEAL</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          BLASTING / SHATTER ANIMATION (Crystal shards + radial shockwave)
          ==================================================================== */}
      <AnimatePresence>
        {isBlasting && (
          <div className="crystal-blast-stage" aria-hidden="true">
            {shards.map((s) => (
              <motion.div
                key={s.id}
                className="crystal-shard"
                style={{ '--shard-size': `${s.size}px` }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((s.angle * Math.PI) / 180) * s.dist,
                  y: Math.sin((s.angle * Math.PI) / 180) * s.dist,
                  rotate: s.rot,
                  opacity: 0,
                  scale: 0.1,
                }}
                transition={{ duration: 0.52, delay: s.delay, ease: 'easeOut' }}
              />
            ))}
            {/* Radial Shockwave Wave */}
            <motion.div
              className="crystal-radial-wave"
              initial={{ scale: 0.2, opacity: 0.95 }}
              animate={{ scale: 2.3, opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
            {/* Light Flash */}
            <motion.div
              className="crystal-blast-flash"
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          REVEALED STATE: PHOTO (150-190px) + NAME + ROLE
          Clean, elegant, premium, no biographies
          ==================================================================== */}
      <AnimatePresence>
        {revealed && !isBlasting && (
          <motion.div
            className="crystal-revealed-stage"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ambient Interior Glow */}
            <div className="revealed-ambient-glow" aria-hidden="true" />

            {/* UPPER/CENTER: LARGE CIRCULAR PORTRAIT (150-185px Desktop) */}
            <div className="revealed-photo-stage">
              {/* Surrounding Cosmic Halo & Orbit Rings */}
              <div className="revealed-photo-halo" aria-hidden="true" />
              <div className="revealed-photo-orbit" aria-hidden="true" />
              <div className="revealed-photo-pulse" aria-hidden="true" />

              <div className="revealed-photo-frame">
                {item.photo && !imgError ? (
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="revealed-photo-img"
                    loading="lazy"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div
                    className="revealed-photo-fallback"
                    style={{
                      background: `radial-gradient(circle at 50% 35%, ${item.glowColor}35 0%, #080c16 85%)`,
                    }}
                  >
                    <User size={58} style={{ color: item.accentColor }} />
                    <span className="fallback-initials" style={{ color: item.accentColor }}>
                      {item.initials}
                    </span>
                  </div>
                )}
                <div className="revealed-photo-sheen" aria-hidden="true" />
              </div>
            </div>

            {/* BELOW PHOTO: NAME + ROLE */}
            <div className="revealed-info-block">
              <motion.h3
                className="revealed-name"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                {item.name}
              </motion.h3>

              <motion.p
                className="revealed-role"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.18 }}
              >
                {item.role}
              </motion.p>

              {/* Status Badge */}
              <div className="revealed-status-badge">
                <span className="status-live-dot" />
                <span>ONLINE NODE</span>
              </div>

              {/* SPECIAL HOD CSE DEPARTMENT TRIGGER */}
              {isHOD && onHODToggle && (
                <button
                  type="button"
                  className="hod-dept-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onHODToggle();
                  }}
                  aria-expanded={isHODExpanded}
                >
                  <Sparkles size={13} className="btn-spark-icon" />
                  <span>{isHODExpanded ? 'COLLAPSE DEPARTMENT INFO' : 'VIEW CSE DEPARTMENT VISION ▸'}</span>
                </button>
              )}

              {/* Refreeze Hint */}
              <div className="revealed-refreeze-hint">
                <span>TAP CARD TO RE-FREEZE ❄</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(LeadershipCard);
