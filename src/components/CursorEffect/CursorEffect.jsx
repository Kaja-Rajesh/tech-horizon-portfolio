import React, { useEffect, useRef } from 'react';
import AudioManager from '../../audio/AudioManager';
import './CursorEffect.css';

const CursorEffect = () => {
  const canvasRef = useRef(null);
  const rocketRef = useRef(null);
  const flameRef = useRef(null);

  // Position and physics references
  const mousePos = useRef({ x: -100, y: -100 });
  const rocketPos = useRef({ x: -100, y: -100 });
  const angleRef = useRef(0);
  const speedRef = useRef(0);
  const isHoverRef = useRef(false);
  const isClickRef = useRef(false);
  const isBoostRef = useRef(false);
  const isVisibleRef = useRef(false);
  const rafRef = useRef(null);

  // Particles, shockwaves and projectile pools
  const particlesRef = useRef([]);
  const shockwavesRef = useRef([]);
  const sparksRef = useRef([]);
  const projectilesRef = useRef([]);

  useEffect(() => {
    // Disable on touch / coarse pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high-DPI canvases
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const onMouseMove = (e) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        // Instant teleport on first appearance
        if (rocketPos.current.x < 0) {
          rocketPos.current = { x: e.clientX, y: e.clientY };
        }
      }
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;
      const interactive = target.closest(
        'button, a, .leadership-card, .ice-card, [data-interactive], [role="button"], input, textarea, select, .nav-link, .social-pill'
      );
      isHoverRef.current = !!interactive;
    };

    // Single Click: Subtle shockwave ripple & small recoil
    const onMouseDown = (e) => {
      isClickRef.current = true;
      setTimeout(() => {
        isClickRef.current = false;
      }, 200);

      // Spawn cyan shockwave ring
      shockwavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius: 36,
        alpha: 0.95,
        color: '#00d4ff',
      });
      // Spawn secondary violet ring
      shockwavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 3,
        maxRadius: 24,
        alpha: 0.8,
        color: '#a855f7',
      });

      // Scatter 8 energy spark particles
      for (let i = 0; i < 8; i++) {
        const sparkAngle = Math.random() * Math.PI * 2;
        const sparkSpeed = 2 + Math.random() * 3;
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(sparkAngle) * sparkSpeed,
          vy: Math.sin(sparkAngle) * sparkSpeed,
          size: 1.5 + Math.random() * 1.8,
          life: 1.0,
          decay: 0.05 + Math.random() * 0.03,
          color: i % 2 === 0 ? '#00d4ff' : '#c084fc',
        });
      }
    };

    // ========================================================================
    // SPECIAL DOUBLE-CLICK INTERACTION:
    // Releases 4 glowing cyan energy projectiles traveling along the rocket's
    // facing heading with short glowing trails & terminal dissipation bursts.
    // ========================================================================
    const onDblClick = () => {
      // 1. Activate rocket hyperboost recoil/acceleration state
      isBoostRef.current = true;
      setTimeout(() => {
        isBoostRef.current = false;
      }, 420);

      // Play short futuristic thruster boost sound
      AudioManager.playRocketBoost();

      // Current rocket heading in radians (0 rad = pointing UP)
      const rad = (angleRef.current * Math.PI) / 180;

      // Calculate rocket nose coordinate (forward tip of spacecraft)
      const noseX = rocketPos.current.x + Math.sin(rad) * 14;
      const noseY = rocketPos.current.y - Math.cos(rad) * 14;

      // 2. Launch 4 small glowing cyan energy projectiles with staggered burst delays
      const count = 4;
      for (let i = 0; i < count; i++) {
        // Slight focused angular spread (-0.08 to +0.08 radians)
        const spread = (i - (count - 1) / 2) * 0.06;
        const speed = 11.5 + Math.random() * 1.5;

        projectilesRef.current.push({
          index: i,
          hasFiredSound: false,
          x: noseX,
          y: noseY,
          vx: Math.sin(rad + spread) * speed,
          vy: -Math.cos(rad + spread) * speed,
          size: 3.4,
          life: 1.0,
          decay: 0.036,
          distTraveled: 0,
          maxDist: 190 + Math.random() * 45,
          delay: i * 3, // Staggered frame delay for sequential launch pulse
          trail: [],
        });
      }

      // 3. Rocket brief forward acceleration kick
      rocketPos.current.x += Math.sin(rad) * 12;
      rocketPos.current.y -= Math.cos(rad) * 12;
    };

    const onMouseEnter = () => {
      isVisibleRef.current = true;
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('dblclick', onDblClick);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    // Particle colors for rocket exhaust
    const exhaustColors = ['#00d4ff', '#38bdf8', '#7dd3fc', '#a855f7'];

    // Animation loop (60 FPS)
    const animate = () => {
      const rocket = rocketRef.current;
      const flame = flameRef.current;

      if (isVisibleRef.current && mousePos.current.x >= 0) {
        // Smooth cinematic position interpolation (lerp)
        const lerpFactor = 0.2;
        const dx = mousePos.current.x - rocketPos.current.x;
        const dy = mousePos.current.y - rocketPos.current.y;
        const dist = Math.hypot(dx, dy);

        rocketPos.current.x += dx * lerpFactor;
        rocketPos.current.y += dy * lerpFactor;
        speedRef.current = dist;

        // Rocket points in the direction of mouse movement when moving
        if (dist > 1.2) {
          const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

          // Shortest-arc angular interpolation to prevent 360-degree flip wraps
          let diff = targetAngle - angleRef.current;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;
          angleRef.current += diff * 0.22;
        }

        // Calculate nozzle position (rear of rocket, 13px behind center along heading)
        const rad = (angleRef.current * Math.PI) / 180;
        const nozzleX = rocketPos.current.x - Math.sin(rad) * 13;
        const nozzleY = rocketPos.current.y + Math.cos(rad) * 13;

        // Spawn exhaust particles based on speed or boost
        const isBoost = isBoostRef.current;
        if (dist > 1.0 || isBoost) {
          const spawnCount = isBoost ? 4 : dist > 8 ? 2 : 1;
          for (let s = 0; s < spawnCount; s++) {
            const ejectSpeed = (isBoost ? 3.0 : 1.0) + Math.random() * 2.0;
            const pvx = -Math.sin(rad) * ejectSpeed + (Math.random() - 0.5) * 0.8;
            const pvy = Math.cos(rad) * ejectSpeed + (Math.random() - 0.5) * 0.8;

            particlesRef.current.push({
              x: nozzleX,
              y: nozzleY,
              vx: pvx,
              vy: pvy,
              size: (isBoost ? 2.5 : 1.8) + Math.random() * 1.8,
              life: 1.0,
              decay: 0.035 + Math.random() * 0.025,
              color: isBoost ? '#ffffff' : exhaustColors[Math.floor(Math.random() * exhaustColors.length)],
            });
          }
        } else if (Math.random() < 0.2) {
          // Subtle idle thruster emission when settled
          particlesRef.current.push({
            x: nozzleX,
            y: nozzleY,
            vx: (Math.random() - 0.5) * 0.5,
            vy: 0.4 + Math.random() * 0.6,
            size: 1.2,
            life: 0.8,
            decay: 0.04,
            color: '#00d4ff',
          });
        }

        // Apply transform to rocket craft
        if (rocket) {
          const hoverScale = isHoverRef.current ? 1.18 : 1.0;
          const clickScale = isClickRef.current ? 0.9 : 1.0;
          const boostScale = isBoost ? 1.25 : 1.0;
          const finalScale = hoverScale * clickScale * boostScale;

          rocket.style.opacity = '1';
          rocket.style.transform = `translate3d(${rocketPos.current.x}px, ${rocketPos.current.y}px, 0) rotate(${angleRef.current}deg) scale(${finalScale})`;

          if (isBoost) {
            rocket.classList.add('rocket--boost');
          } else {
            rocket.classList.remove('rocket--boost');
          }

          if (isHoverRef.current) {
            rocket.classList.add('rocket--hovering');
          } else {
            rocket.classList.remove('rocket--hovering');
          }

          if (isClickRef.current) {
            rocket.classList.add('rocket--clicking');
          } else {
            rocket.classList.remove('rocket--clicking');
          }
        }

        // Dynamic reactive exhaust flame
        if (flame) {
          const idlePulse = Math.sin(Date.now() * 0.012) * 0.08;
          const baseFlameY = isBoost ? 2.5 : Math.min(2.1, 0.75 + idlePulse + speedRef.current * 0.08);
          const baseFlameX = isBoost ? 1.45 : Math.min(1.3, 0.85 + speedRef.current * 0.03);
          const flameOpacity = isBoost ? 1 : Math.min(1, 0.75 + speedRef.current * 0.05);

          flame.style.transform = `translateX(-50%) scale(${baseFlameX}, ${baseFlameY})`;
          flame.style.opacity = flameOpacity.toString();
        }
      } else if (rocket) {
        rocket.style.opacity = '0';
      }

      // Render Canvas Particles, Projectiles, Shockwaves & Sparks
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Draw Exhaust Trail Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.75;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw Cyan Energy Projectiles (Double-Click interaction)
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const proj = projectilesRef.current[i];

        // Handle frame delay for staggered burst effect
        if (proj.delay > 0) {
          proj.delay--;
          continue;
        }

        // Trigger futuristic electronic sci-fi energy pulse sound on emergence
        if (!proj.hasFiredSound) {
          proj.hasFiredSound = true;
          AudioManager.playRocketPulse(proj.index);
        }

        // Store trail positions
        proj.trail.push({ x: proj.x, y: proj.y });
        if (proj.trail.length > 5) proj.trail.shift();

        // Advance projectile forward along heading
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.distTraveled += Math.hypot(proj.vx, proj.vy);
        proj.life -= proj.decay;

        // Draw short glowing cyan trail
        if (proj.trail.length > 1) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(proj.trail[0].x, proj.trail[0].y);
          for (let t = 1; t < proj.trail.length; t++) {
            ctx.lineTo(proj.trail[t].x, proj.trail[t].y);
          }
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 2.4;
          ctx.globalAlpha = Math.max(0, proj.life * 0.75);
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00d4ff';
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();
        }

        // Draw Projectile Head (White Core + Soft Cyan Plasma Droplet)
        ctx.save();
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(0.6, proj.size * proj.life), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = Math.max(0, proj.life);
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#00d4ff';
        ctx.fill();

        // Soft outer cyan pulse aura
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.size * 2.2 * proj.life, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.globalAlpha = Math.max(0, proj.life * 0.38);
        ctx.fill();
        ctx.restore();

        // Terminal Dissipation: tiny spark burst when projectile completes distance or life
        if (proj.life <= 0 || proj.distTraveled >= proj.maxDist) {
          // Play tiny particle burst sound effect
          AudioManager.playProjectileBurst();

          for (let s = 0; s < 4; s++) {
            const burstAngle = Math.random() * Math.PI * 2;
            const burstSpeed = 1.0 + Math.random() * 2.2;
            sparksRef.current.push({
              x: proj.x,
              y: proj.y,
              vx: Math.cos(burstAngle) * burstSpeed,
              vy: Math.sin(burstAngle) * burstSpeed,
              size: 1.2 + Math.random() * 1.2,
              life: 0.9,
              decay: 0.055 + Math.random() * 0.03,
              color: s % 2 === 0 ? '#ffffff' : '#00d4ff',
            });
          }
          projectilesRef.current.splice(i, 1);
        }
      }

      // 3. Draw Spark Particles (Click bursts and projectile dissipation bursts)
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const sp = sparksRef.current[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.93;
        sp.vy *= 0.93;
        sp.life -= sp.decay;

        if (sp.life <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, Math.max(0.4, sp.size * sp.life), 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.life * 0.9;
        ctx.shadowBlur = 10;
        ctx.shadowColor = sp.color;
        ctx.fill();
        ctx.restore();
      }

      // 4. Draw Click Shockwave Rings
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.16 + 0.4;
        sw.alpha -= 0.055;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.shadowBlur = 12;
        ctx.shadowColor = sw.color;
        ctx.stroke();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('dblclick', onDblClick);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="rocket-cursor-root" aria-hidden="true">
      <canvas ref={canvasRef} className="rocket-cursor-canvas" />

      <div ref={rocketRef} className="rocket-cursor-craft">
        {/* Sleek Futuristic Spacecraft SVG */}
        <svg
          viewBox="0 0 40 40"
          width="28"
          height="28"
          className="rocket-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rocketHullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c3749" />
              <stop offset="45%" stopColor="#151d2f" />
              <stop offset="100%" stopColor="#080c16" />
            </linearGradient>

            <linearGradient id="rocketWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b4861" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="rocketCanopyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            <filter id="rocketCyanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Swept Delta Wings */}
          <path
            d="M 20 12 L 6 31 L 14 29 L 20 25 L 26 29 L 34 31 Z"
            fill="url(#rocketWingGrad)"
            stroke="rgba(0, 212, 255, 0.45)"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />

          {/* Wingtip Neon Cyan Edge Accents */}
          <line x1="6" y1="31" x2="11" y2="23" stroke="#00d4ff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
          <line x1="34" y1="31" x2="29" y2="23" stroke="#00d4ff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />

          {/* Main Fuselage / Dart Body */}
          <path
            d="M 20 4 L 24 16 L 23 30 L 20 31 L 17 30 L 16 16 Z"
            fill="url(#rocketHullGrad)"
            stroke="rgba(56, 189, 248, 0.7)"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* Centerline Cyan Energy Conduit */}
          <line x1="20" y1="6" x2="20" y2="27" stroke="#38bdf8" strokeWidth="0.75" opacity="0.75" />

          {/* Cockpit Canopy Diamond Visor */}
          <polygon
            points="20,13 22.2,18 20,22 17.8,18"
            fill="url(#rocketCanopyGrad)"
            filter="url(#rocketCyanGlow)"
          />

          {/* Wingtip Beacon Micro Lights */}
          <circle cx="7" cy="30" r="0.9" fill="#00d4ff" filter="url(#rocketCyanGlow)" />
          <circle cx="33" cy="30" r="0.9" fill="#a855f7" filter="url(#rocketCyanGlow)" />

          {/* Thruster Nozzle Mounts */}
          <rect x="17.2" y="30.5" width="2.2" height="1.6" rx="0.5" fill="#334155" />
          <rect x="20.6" y="30.5" width="2.2" height="1.6" rx="0.5" fill="#334155" />
        </svg>

        {/* Dynamic Thruster Exhaust Flame */}
        <svg
          ref={flameRef}
          viewBox="0 0 20 30"
          width="13"
          height="20"
          className="rocket-flame"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rocketFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#00d4ff" />
              <stop offset="65%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="rocketCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Outer Cyan Plasma Plume */}
          <path d="M 6 0 Q 10 24 10 28 Q 10 24 14 0 Z" fill="url(#rocketFlameGrad)" />
          {/* Inner White-Hot Plasma Core */}
          <path d="M 8 0 Q 10 15 10 17 Q 10 15 12 0 Z" fill="url(#rocketCoreGrad)" />
        </svg>
      </div>
    </div>
  );
};

export default CursorEffect;
