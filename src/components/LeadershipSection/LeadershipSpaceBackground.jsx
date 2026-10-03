import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import './LeadershipSpaceBackground.css';

/* ==========================================================================
   FUTURISTIC SATELLITE & EXPLORATION DRONE SVG ASSETS FOR LEADERSHIP SPACE
   ========================================================================== */

const BackgroundSatellite = ({ id, color = '#00d4ff' }) => (
  <svg className="leader-space-asset leader-satellite" viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`lsat-panel-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0369a1" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
    </defs>
    {/* Left Solar Panel */}
    <rect x="6" y="22" width="38" height="36" rx="2" fill={`url(#lsat-panel-${id})`} stroke="#0284c7" strokeWidth="0.8" />
    <line x1="19" y1="22" x2="19" y2="58" stroke="#00d4ff" strokeWidth="0.6" strokeOpacity="0.6" />
    <line x1="31" y1="22" x2="31" y2="58" stroke="#00d4ff" strokeWidth="0.6" strokeOpacity="0.6" />
    <rect x="44" y="38" width="12" height="4" fill="#475569" />

    {/* Right Solar Panel */}
    <rect x="96" y="22" width="38" height="36" rx="2" fill={`url(#lsat-panel-${id})`} stroke="#0284c7" strokeWidth="0.8" />
    <line x1="109" y1="22" x2="109" y2="58" stroke="#00d4ff" strokeWidth="0.6" strokeOpacity="0.6" />
    <line x1="121" y1="22" x2="121" y2="58" stroke="#00d4ff" strokeWidth="0.6" strokeOpacity="0.6" />
    <rect x="84" y="38" width="12" height="4" fill="#475569" />

    {/* Central Metallic Chassis */}
    <polygon points="58,26 82,26 88,40 82,54 58,54 52,40" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />
    <rect x="62" y="32" width="16" height="16" rx="2" fill="#0b1120" stroke={color} strokeWidth="0.8" />

    {/* Antenna & Beacon */}
    <line x1="70" y1="26" x2="70" y2="12" stroke="#94a3b8" strokeWidth="1.2" />
    <circle cx="70" cy="11" r="2" fill={color} className="leader-beacon-pulse" />
    <circle cx="64" cy="28" r="1.2" fill="#38bdf8" />
    <circle cx="76" cy="28" r="1.2" fill="#a855f7" />
  </svg>
);

const BackgroundDrone = ({ id, color = '#38bdf8' }) => (
  <svg className="leader-space-asset leader-drone" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="drone-thruster-left">
      <rect x="12" y="38" width="10" height="15" rx="3" fill="#334155" stroke="#64748b" strokeWidth="0.8" />
      <ellipse cx="17" cy="58" rx="3" ry="5" fill={color} opacity="0.75" />
    </g>
    <g className="drone-thruster-right">
      <rect x="68" y="38" width="10" height="15" rx="3" fill="#334155" stroke="#64748b" strokeWidth="0.8" />
      <ellipse cx="73" cy="58" rx="3" ry="5" fill={color} opacity="0.75" />
    </g>
    <ellipse cx="45" cy="45" rx="24" ry="20" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />
    <rect x="30" y="39" width="30" height="10" rx="5" fill="#030712" stroke="#334155" strokeWidth="0.8" />
    <ellipse cx="45" cy="44" rx="10" ry="3" fill={color} className="leader-scanner-sweep" />
    <circle cx="45" cy="57" r="2" fill="#a855f7" className="leader-beacon-pulse" />
  </svg>
);

/* ==========================================================================
   LEADERSHIP SPACE BACKGROUND COMPONENT
   ========================================================================== */
const LeadershipSpaceBackground = forwardRef(({ mouseOffset = { x: 0, y: 0 } }, ref) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const shockwavesRef = useRef([]);
  const isSurgingRef = useRef(false);
  const [isSurging, setIsSurging] = useState(false);

  // Expose triggerPulse to parent component
  useImperativeHandle(ref, () => ({
    triggerPulse: (x, y) => {
      // Add expanding energy shockwave centered at the clicked card
      shockwavesRef.current.push({
        x,
        y,
        radius: 8,
        maxRadius: 360,
        alpha: 0.9,
        color: '#00d4ff',
      });
      // Second outer violet ripple
      shockwavesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: 260,
        alpha: 0.75,
        color: '#a855f7',
      });

      // Surge background orbital lines and constellation
      isSurgingRef.current = true;
      setIsSurging(true);
      setTimeout(() => {
        isSurgingRef.current = false;
        setIsSurging(false);
      }, 700);
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initStars();
    };

    // Generate 3 Layers of Stars scaled with container height
    const stars = [];

    const initStars = () => {
      const w = containerRef.current ? containerRef.current.clientWidth : 1400;
      const h = containerRef.current ? containerRef.current.clientHeight : 1000;
      const multiplier = Math.max(1, Math.min(6, Math.round(h / 900)));
      const starCounts = { far: 55 * multiplier, mid: 28 * multiplier, near: 14 * multiplier };

      stars.length = 0;

      // Far Stars
      for (let i = 0; i < starCounts.far; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.08,
          vy: -0.06 - Math.random() * 0.05,
          size: 0.6 + Math.random() * 0.6,
          baseAlpha: 0.2 + Math.random() * 0.35,
          twinkleSpeed: 0.015 + Math.random() * 0.02,
          twinklePhase: Math.random() * Math.PI * 2,
          color: '#ffffff',
          layer: 1,
        });
      }

      // Mid Stars
      for (let i = 0; i < starCounts.mid; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -0.12 - Math.random() * 0.08,
          size: 1.2 + Math.random() * 0.8,
          baseAlpha: 0.45 + Math.random() * 0.4,
          twinkleSpeed: 0.02 + Math.random() * 0.025,
          twinklePhase: Math.random() * Math.PI * 2,
          color: i % 3 === 0 ? '#38bdf8' : i % 5 === 0 ? '#c084fc' : '#ffffff',
          layer: 2,
        });
      }

      // Near Cosmic Stardust Particles
      for (let i = 0; i < starCounts.near; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.2 - Math.random() * 0.15,
          size: 1.8 + Math.random() * 1.2,
          baseAlpha: 0.6 + Math.random() * 0.35,
          twinkleSpeed: 0.03 + Math.random() * 0.03,
          twinklePhase: Math.random() * Math.PI * 2,
          color: i % 2 === 0 ? '#00d4ff' : '#a855f7',
          layer: 3,
        });
      }
    };

    initStars();
    window.addEventListener('resize', handleResize);

    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => handleResize());
      ro.observe(containerRef.current);
    }

    let rafId = null;

    const render = () => {
      if (!containerRef.current || !canvas) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      ctx.clearRect(0, 0, w, h);

      // Render & Drift Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Drift slowly
        s.x += s.vx;
        s.y += s.vy;

        // Wrap edges smoothly
        if (s.y < -10) s.y = h + 10;
        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;

        // Smooth subtle twinkle (sine wave, no aggressive flashing)
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = Math.max(0.1, s.baseAlpha + Math.sin(s.twinklePhase) * 0.25);

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.min(1, currentAlpha);
        if (s.layer === 3) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = s.color;
        }
        ctx.fill();
        ctx.restore();
      }

      // Render Click Energy Waves & Particle Reaction
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.12 + 1.2;
        sw.alpha -= 0.035;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.shadowBlur = 16;
        ctx.shadowColor = sw.color;
        ctx.stroke();
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <div
      className={`leader-space-container ${isSurging ? 'leader-space--surge' : ''}`}
      ref={containerRef}
      aria-hidden="true"
      style={{
        '--mouse-x': `${mouseOffset.x * 20}px`,
        '--mouse-y': `${mouseOffset.y * 20}px`,
      }}
    >
      {/* 1. Deep Space Dark Grid */}
      <div className="leader-space-grid" />

      {/* 2. Fluid Flowing Nebula Clouds */}
      <div className="leader-nebula leader-nebula--cyan" />
      <div className="leader-nebula leader-nebula--violet" />
      <div className="leader-nebula leader-nebula--azure" />

      {/* 3. Live Canvas Starfield & Shockwave Layer */}
      <canvas ref={canvasRef} className="leader-starfield-canvas" />

      {/* 4. Sweeping Orbital Paths & Travelling Energy Photons */}
      <svg className="leader-orbital-arcs" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="orbitArcGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="rgba(0, 212, 255, 0.22)" />
            <stop offset="70%" stopColor="rgba(168, 85, 247, 0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="orbitArcGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="rgba(56, 189, 248, 0.2)" />
            <stop offset="80%" stopColor="rgba(0, 212, 255, 0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Primary Orbital Arc behind Row 1 */}
        <path
          d="M -100 240 C 350 80, 1100 120, 1540 320"
          className="orbital-path-line orbit-path--1"
          stroke="url(#orbitArcGrad1)"
          strokeWidth="1.2"
          strokeDasharray="8 12"
          fill="none"
        />

        {/* Counter Orbital Arc behind Row 2 */}
        <path
          d="M -80 720 C 450 860, 1050 780, 1520 540"
          className="orbital-path-line orbit-path--2"
          stroke="url(#orbitArcGrad2)"
          strokeWidth="1.2"
          strokeDasharray="6 14"
          fill="none"
        />

        {/* Tilted Elliptical Ring */}
        <g transform="translate(720 460) rotate(-14)">
          <ellipse
            cx="0"
            cy="0"
            rx="580"
            ry="180"
            className="orbital-path-line orbit-path--ellipse"
            stroke="rgba(0, 212, 255, 0.12)"
            strokeWidth="1"
            strokeDasharray="4 8"
            fill="none"
          />
        </g>
      </svg>

      {/* 5. Travelling Photons on Orbits */}
      <div className="leader-photon-track track-photon-1" />
      <div className="leader-photon-track track-photon-2" />

      {/* 6. Distant Satellites Moving Along Orbital Paths */}
      <div className="leader-sat-track track-sat-high">
        <BackgroundSatellite id="bg-sat-lead-1" color="#00d4ff" />
      </div>

      <div className="leader-sat-track track-sat-low">
        <BackgroundSatellite id="bg-sat-lead-2" color="#a855f7" />
      </div>

      {/* 7. Exploration Robots Floating Peacefully */}
      <div className="leader-drone-track track-drone-left">
        <BackgroundDrone id="bg-drone-lead-1" color="#38bdf8" />
      </div>

      <div className="leader-drone-track track-drone-right">
        <BackgroundDrone id="bg-drone-lead-2" color="#00d4ff" />
      </div>

      {/* 8. Occasional Shooting Stars */}
      <div className="leader-shooting-stars">
        <div className="leader-shooting-star shooting-star-1" />
        <div className="leader-shooting-star shooting-star-2" />
      </div>
    </div>
  );
});

export default React.memo(LeadershipSpaceBackground);
