import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('init'); // init, scanning, text, loading, done
  const [particles, setParticles] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Generate floating particles
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        angle: (i / 24) * 360,
        radius: 130 + Math.random() * 40,
        size: Math.random() * 3 + 1,
        speed: 0.4 + Math.random() * 0.8,
        opacity: 0.4 + Math.random() * 0.6,
      }))
    );

    const t1 = setTimeout(() => setPhase('scanning'), 400);
    const t2 = setTimeout(() => setPhase('text'), 900);
    const t3 = setTimeout(() => setPhase('loading'), 1300);

    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(intervalRef.current);
          return 100;
        }
        return Math.min(p + Math.random() * 18 + 8, 100);
      });
    }, 80);

    const t4 = setTimeout(() => {
      setPhase('done');
      setTimeout(onComplete, 600);
    }, 2200);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearInterval(intervalRef.current);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Animated grid bg */}
          <div className="loading-grid" />

          {/* Circuit traces */}
          <svg className="loading-circuits" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <g stroke="rgba(0,212,255,0.12)" fill="none" strokeWidth="1">
              <polyline points="0,100 200,100 220,120 400,120" strokeDasharray="5,10" />
              <polyline points="800,250 600,250 580,230 380,230" strokeDasharray="5,10" />
              <polyline points="100,600 100,400 120,380 120,200" strokeDasharray="5,10" />
              <polyline points="700,0 700,200 680,220 680,380" strokeDasharray="5,10" />
              <circle cx="400" cy="120" r="4" fill="rgba(0,212,255,0.3)" />
              <circle cx="380" cy="230" r="4" fill="rgba(168,85,247,0.3)" />
              <circle cx="120" cy="200" r="4" fill="rgba(0,212,255,0.3)" />
              <circle cx="680" cy="380" r="4" fill="rgba(168,85,247,0.3)" />
            </g>
          </svg>

          {/* Center content */}
          <div className="loading-center">
            {/* Rotating rings */}
            <div className="loading-ring loading-ring--1" />
            <div className="loading-ring loading-ring--2" />

            {/* Particles orbit */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="loading-particle"
                style={{
                  '--angle': `${p.angle}deg`,
                  '--radius': `${p.radius}px`,
                  '--speed': `${p.speed}s`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  opacity: p.opacity,
                }}
              />
            ))}

            {/* Logo */}
            <motion.div
              className="loading-logo-wrap"
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <img
                src="/assets/logo.jpg"
                alt="Tech Horizon Logo"
                className="loading-logo"
              />
              {/* Scanning light */}
              {phase !== 'init' && <div className="loading-scan-line" />}
              {/* Glow */}
              <motion.div
                className="loading-logo-glow"
                animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Text */}
            <AnimatePresence>
              {(phase === 'text' || phase === 'loading') && (
                <motion.div
                  className="loading-text-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="loading-title">TECH HORIZON</h1>
                  <p className="loading-tagline">Code the Future. Shape the Horizon.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            <AnimatePresence>
              {phase === 'loading' && (
                <motion.div
                  className="loading-progress-wrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="loading-status">INITIALIZING...</div>
                  <div className="loading-bar-track">
                    <motion.div
                      className="loading-bar-fill"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                    <div className="loading-bar-glow" style={{ left: `${progress}%` }} />
                  </div>
                  <div className="loading-percent">{Math.round(progress)}%</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
