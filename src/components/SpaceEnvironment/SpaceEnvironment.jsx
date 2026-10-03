import React, { useEffect, useRef } from 'react';
import AudioManager from '../../audio/AudioManager';
import './SpaceEnvironment.css';

/* ==========================================================================
   FUTURISTIC SPACE ASSETS: SATELLITES, ROBOTS, PLANETS & SHOOTING STARS
   ========================================================================== */

// 1. Orbital Communications Satellite
const OrbitalSatellite = ({ id, color = '#00d4ff' }) => (
  <svg className="space-asset space-satellite" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`sat-body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id={`sat-panel-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0369a1" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
      <filter id={`sat-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Solar wings */}
    <g className="satellite-solar-wing">
      <rect x="6" y="24" width="46" height="42" rx="3" fill={`url(#sat-panel-${id})`} stroke="#0284c7" strokeWidth="1" />
      <line x1="21" y1="24" x2="21" y2="66" stroke="#00d4ff" strokeWidth="0.75" strokeOpacity="0.6" />
      <line x1="37" y1="24" x2="37" y2="66" stroke="#00d4ff" strokeWidth="0.75" strokeOpacity="0.6" />
      <line x1="6" y1="38" x2="52" y2="38" stroke="#00d4ff" strokeWidth="0.75" strokeOpacity="0.6" />
      <line x1="6" y1="52" x2="52" y2="52" stroke="#00d4ff" strokeWidth="0.75" strokeOpacity="0.6" />
      <rect x="52" y="43" width="16" height="4" rx="1" fill="#475569" stroke="#64748b" strokeWidth="0.5" />
    </g>

    <g className="satellite-solar-wing">
      <rect x="108" y="24" width="46" height="42" rx="3" fill={`url(#sat-panel-${id})`} stroke="#0284c7" strokeWidth="1" />
      <line x1="123" y1="24" x2="123" y2="66" stroke="#00d4ff" strokeWidth="0.75" strokeOpacity="0.6" />
      <line x1="139" y1="24" x2="139" y2="66" stroke="#00d4ff" strokeWidth="0.75" strokeOpacity="0.6" />
      <line x1="108" y1="38" x2="154" y2="38" stroke="#00d4ff" strokeWidth="0.75" strokeOpacity="0.6" />
      <line x1="108" y1="52" x2="154" y2="52" stroke="#00d4ff" strokeWidth="0.75" strokeOpacity="0.6" />
      <rect x="92" y="43" width="16" height="4" rx="1" fill="#475569" stroke="#64748b" strokeWidth="0.5" />
    </g>

    {/* Main Hull */}
    <polygon points="68,30 92,30 98,45 92,60 68,60 62,45" fill={`url(#sat-body-${id})`} stroke="#64748b" strokeWidth="1.5" />
    <rect x="73" y="36" width="14" height="18" rx="2" fill="#0f172a" stroke={color} strokeWidth="1" />

    {/* Antenna dish */}
    <path d="M72 25 Q80 14 88 25" stroke="#94a3b8" strokeWidth="2" fill="none" />
    <line x1="80" y1="20" x2="80" y2="10" stroke="#cbd5e1" strokeWidth="1.5" />
    <circle cx="80" cy="10" r="2" fill={color} filter={`url(#sat-glow-${id})`} />

    {/* Ion thruster */}
    <polygon points="76,60 84,60 82,68 78,68" fill="#475569" />
    <ellipse cx="80" cy="72" rx="4" ry="7" fill={color} opacity="0.65" filter={`url(#sat-glow-${id})`} className="ion-exhaust-glow" />

    {/* Beacons */}
    <circle cx="70" cy="33" r="1.5" fill="#38bdf8" className="beacon-blink-1" />
    <circle cx="90" cy="33" r="1.5" fill="#a855f7" className="beacon-blink-2" />
    <circle cx="80" cy="45" r="2.2" fill={color} filter={`url(#sat-glow-${id})`} className="beacon-pulse" />
  </svg>
);

// 2. High-Tech Recon Science Probe
const ReconProbe = ({ id, color = '#a855f7' }) => (
  <svg className="space-asset space-probe" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`probe-body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#090d16" />
      </linearGradient>
      <filter id={`probe-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <ellipse cx="55" cy="55" rx="42" ry="16" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.2" strokeDasharray="6 3" />
    <polygon points="12,45 32,50 30,62 10,57" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
    <polygon points="98,45 78,50 80,62 100,57" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
    <circle cx="55" cy="55" r="20" fill={`url(#probe-body-${id})`} stroke="#64748b" strokeWidth="1.5" />
    <ellipse cx="55" cy="55" rx="14" ry="14" fill="#0a0f1d" stroke={color} strokeWidth="1.2" />
    <circle cx="55" cy="55" r="7" fill={color} opacity="0.85" filter={`url(#probe-glow-${id})`} className="beacon-pulse" />
    <circle cx="53" cy="53" r="2.5" fill="#ffffff" opacity="0.9" />
    <line x1="55" y1="35" x2="55" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
    <circle cx="55" cy="15" r="2.5" fill="#00d4ff" filter={`url(#probe-glow-${id})`} className="beacon-blink-1" />
  </svg>
);

// 3. Exploration Drone / Space Robot
const ExplorerRobot = ({ id, color = '#00d4ff' }) => (
  <svg className="space-asset space-robot" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`robot-hull-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="40%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0b0f19" />
      </linearGradient>
      <linearGradient id={`visor-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00d4ff" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <filter id={`robot-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <g className="robot-thruster-left">
      <rect x="14" y="44" width="12" height="18" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1" />
      <ellipse cx="20" cy="67" rx="3.5" ry="7" fill={color} opacity="0.75" filter={`url(#robot-glow-${id})`} className="ion-exhaust-glow" />
    </g>
    <g className="robot-thruster-right">
      <rect x="74" y="44" width="12" height="18" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1" />
      <ellipse cx="80" cy="67" rx="3.5" ry="7" fill={color} opacity="0.75" filter={`url(#robot-glow-${id})`} className="ion-exhaust-glow" />
    </g>
    <ellipse cx="50" cy="50" rx="28" ry="24" fill={`url(#robot-hull-${id})`} stroke="#64748b" strokeWidth="1.5" />
    <path d="M26 48 Q50 36 74 48" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" fill="none" />
    <rect x="33" y="43" width="34" height="11" rx="5.5" fill="#030712" stroke="#334155" strokeWidth="1" />
    <ellipse cx="50" cy="48.5" rx="12" ry="3.5" fill={`url(#visor-grad-${id})`} filter={`url(#robot-glow-${id})`} className="robot-scanner-beam" />
    <line x1="42" y1="27" x2="36" y2="15" stroke="#94a3b8" strokeWidth="1.2" />
    <circle cx="36" cy="14" r="2" fill="#00d4ff" filter={`url(#robot-glow-${id})`} className="beacon-blink-1" />
    <line x1="58" y1="27" x2="64" y2="15" stroke="#94a3b8" strokeWidth="1.2" />
    <circle cx="64" cy="14" r="2" fill="#a855f7" filter={`url(#robot-glow-${id})`} className="beacon-blink-2" />
    <circle cx="50" cy="64" r="2.5" fill="#38bdf8" filter={`url(#robot-glow-${id})`} className="beacon-pulse" />
  </svg>
);

// 4. Hexagonal Deep Space Survey Rover Drone
const SurveyDrone = ({ id, color = '#22d3ee' }) => (
  <svg className="space-asset space-survey-drone" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`survey-hull-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="60%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0b0f19" />
      </linearGradient>
      <filter id={`survey-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <polygon points="10,50 30,35 30,65" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.8" />
    <polygon points="90,50 70,35 70,65" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.8" />
    <polygon points="40,25 60,25 72,45 68,70 32,70 28,45" fill={`url(#survey-hull-${id})`} stroke="#64748b" strokeWidth="1.5" />
    <circle cx="43" cy="44" r="4.5" fill="#090d16" stroke="#38bdf8" strokeWidth="1" />
    <circle cx="43" cy="44" r="2.2" fill={color} filter={`url(#survey-glow-${id})`} className="beacon-blink-1" />
    <circle cx="57" cy="44" r="4.5" fill="#090d16" stroke="#a855f7" strokeWidth="1" />
    <circle cx="57" cy="44" r="2.2" fill="#a855f7" filter={`url(#survey-glow-${id})`} className="beacon-blink-2" />
    <ellipse cx="50" cy="74" rx="6" ry="3" fill={color} opacity="0.65" filter={`url(#survey-glow-${id})`} className="ion-exhaust-glow" />
  </svg>
);

// 5. Cinematic Gas-Giant Ringed Exo-Planet (Upper Right Periphery)
const PlanetExo = () => (
  <div className="space-planet space-planet--exo" aria-hidden="true">
    <div className="planet-atmosphere-glow" />
    <svg className="planet-svg" viewBox="0 0 400 400" fill="none">
      <defs>
        <radialGradient id="exoPlanetGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="35%" stopColor="#1e3a8a" />
          <stop offset="70%" stopColor="#0b1329" />
          <stop offset="100%" stopColor="#040711" />
        </radialGradient>
        <linearGradient id="exoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="25%" stopColor="rgba(0, 212, 255, 0.4)" />
          <stop offset="50%" stopColor="rgba(168, 85, 247, 0.5)" />
          <stop offset="75%" stopColor="rgba(56, 189, 248, 0.3)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Back Half of Planetary Ring */}
      <g transform="rotate(-28 200 200)">
        <ellipse cx="200" cy="200" rx="190" ry="24" stroke="url(#exoRingGrad)" strokeWidth="8" fill="none" opacity="0.6" />
      </g>

      {/* Planet Sphere */}
      <circle cx="200" cy="200" r="120" fill="url(#exoPlanetGrad)" />

      {/* Cloud Bands */}
      <g opacity="0.35" className="planet-cloud-bands">
        <path d="M85 170 Q200 200 315 170 Q200 185 85 170 Z" fill="#38bdf8" />
        <path d="M92 210 Q200 238 308 210 Q200 225 92 210 Z" fill="#818cf8" />
      </g>

      {/* Front Half of Planetary Ring */}
      <g transform="rotate(-28 200 200)" clipPath="url(#frontRingClip)">
        <ellipse cx="200" cy="200" rx="190" ry="24" stroke="url(#exoRingGrad)" strokeWidth="8" fill="none" opacity="0.85" />
      </g>

      <clipPath id="frontRingClip">
        <rect x="0" y="200" width="400" height="200" />
      </clipPath>

      {/* Rim light crescent */}
      <circle cx="200" cy="200" r="120" stroke="rgba(56, 189, 248, 0.45)" strokeWidth="3" fill="none" opacity="0.75" />
    </svg>
  </div>
);

// 6. Deep Space Cyber Terra Planet (Lower Left Periphery)
const PlanetCyberTerra = () => (
  <div className="space-planet space-planet--terra" aria-hidden="true">
    <div className="planet-atmosphere-glow planet-atmosphere-glow--terra" />
    <svg className="planet-svg" viewBox="0 0 320 320" fill="none">
      <defs>
        <radialGradient id="terraPlanetGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="40%" stopColor="#0f172a" />
          <stop offset="85%" stopColor="#060913" />
          <stop offset="100%" stopColor="#020408" />
        </radialGradient>
      </defs>

      <circle cx="160" cy="160" r="110" fill="url(#terraPlanetGrad)" />

      {/* Cybernetic night-side city lights constellation */}
      <g opacity="0.65" className="planet-city-lights">
        <circle cx="140" cy="130" r="1.5" fill="#38bdf8" />
        <circle cx="148" cy="134" r="1" fill="#f59e0b" />
        <circle cx="170" cy="145" r="1.5" fill="#38bdf8" />
        <circle cx="180" cy="155" r="1.2" fill="#00d4ff" />
        <circle cx="195" cy="170" r="1.5" fill="#f59e0b" />
        <circle cx="150" cy="175" r="1.2" fill="#38bdf8" />
        <line x1="140" y1="130" x2="148" y2="134" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.6" />
        <line x1="148" y1="134" x2="170" y2="145" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.6" />
        <line x1="170" y1="145" x2="180" y2="155" stroke="rgba(0, 212, 255, 0.4)" strokeWidth="0.6" />
      </g>

      {/* Atmospheric blue limb aura */}
      <circle cx="160" cy="160" r="110" stroke="rgba(0, 212, 255, 0.35)" strokeWidth="2.5" fill="none" opacity="0.7" />
    </svg>
  </div>
);

// 7. Dynamic Cinematic Shooting Stars with Occasional Synchronized Cosmic Whoosh
const ShootingStars = () => {
  const handleStarEvent = () => {
    // Only trigger occasionally (approx 65% of iterations) and respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (Math.random() < 0.65) {
      AudioManager.playShootingStar();
    }
  };

  return (
    <div className="space-shooting-stars" aria-hidden="true">
      <div
        className="shooting-star shooting-star--1"
        onAnimationStart={handleStarEvent}
        onAnimationIteration={handleStarEvent}
      />
      <div
        className="shooting-star shooting-star--2"
        onAnimationIteration={handleStarEvent}
      />
      <div className="shooting-star shooting-star--3" />
    </div>
  );
};

/* ==========================================================================
   GLOBAL SPACE ENVIRONMENT COMPONENT
   ========================================================================== */
const SpaceEnvironment = () => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentParallax = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const onMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const animateParallax = () => {
      const lerp = 0.04;
      currentParallax.current.x += (mouseRef.current.x - currentParallax.current.x) * lerp;
      currentParallax.current.y += (mouseRef.current.y - currentParallax.current.y) * lerp;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-px', `${currentParallax.current.x * 24}px`);
        containerRef.current.style.setProperty('--mouse-py', `${currentParallax.current.y * 24}px`);
      }

      rafId.current = requestAnimationFrame(animateParallax);
    };

    rafId.current = requestAnimationFrame(animateParallax);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="space-environment-layer" ref={containerRef} aria-hidden="true">
      {/* Curved Orbital Trajectory Lines & Constellation Arcs */}
      <svg className="space-orbital-arcs" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <path
          d="M-100,280 C400,120 1200,160 2050,420"
          stroke="rgba(0, 212, 255, 0.08)"
          strokeWidth="1.2"
          strokeDasharray="8 12"
          fill="none"
        />
        <path
          d="M-50,780 C600,920 1400,820 2000,560"
          stroke="rgba(168, 85, 247, 0.07)"
          strokeWidth="1"
          strokeDasharray="6 14"
          fill="none"
        />
      </svg>

      {/* Shooting Stars Layer */}
      <ShootingStars />

      {/* ====================================================================
          1. FAR BACKGROUND LAYER: Planets, Distant Satellites, Faint Probes
          ==================================================================== */}
      <div className="space-layer space-layer--bg">
        {/* Large Cinematic Edge Planets */}
        <PlanetExo />
        <PlanetCyberTerra />

        {/* Distant Nano Satellite */}
        <div className="space-track track-orbit-distant">
          <div className="space-item-wrapper item-scale-bg">
            <OrbitalSatellite id="bg-sat-1" color="#38bdf8" />
          </div>
        </div>

        {/* Deep space survey drone */}
        <div className="space-track track-drift-distant">
          <div className="space-item-wrapper item-scale-bg">
            <SurveyDrone id="bg-drone-1" color="#a855f7" />
          </div>
        </div>

        {/* Faint distant probe */}
        <div className="space-track track-probe-distant">
          <div className="space-item-wrapper item-scale-bg">
            <ReconProbe id="bg-probe-1" color="#00d4ff" />
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. MIDGROUND LAYER: Medium satellites and drones with subtle lighting
          ==================================================================== */}
      <div className="space-layer space-layer--mid">
        <div className="space-track track-orbit-mid">
          <div className="space-item-wrapper item-scale-mid">
            <OrbitalSatellite id="mid-sat-1" color="#00d4ff" />
          </div>
        </div>

        <div className="space-track track-float-drone-mid">
          <div className="space-item-wrapper item-scale-mid">
            <ExplorerRobot id="mid-robot-1" color="#38bdf8" />
          </div>
        </div>

        <div className="space-track track-survey-mid">
          <div className="space-item-wrapper item-scale-mid">
            <SurveyDrone id="mid-survey-1" color="#06b6d4" />
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. FOREGROUND LAYER: Peaceful exploration robots in outer peripheries
          ==================================================================== */}
      <div className="space-layer space-layer--fg">
        <div className="space-track track-hero-robot-fg">
          <div className="space-item-wrapper item-scale-fg">
            <ExplorerRobot id="fg-robot-hero" color="#00d4ff" />
          </div>
        </div>

        <div className="space-track track-hero-probe-fg">
          <div className="space-item-wrapper item-scale-fg">
            <ReconProbe id="fg-probe-hero" color="#a855f7" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SpaceEnvironment);
