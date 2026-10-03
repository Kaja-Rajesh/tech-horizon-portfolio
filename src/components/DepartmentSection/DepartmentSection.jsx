import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Award, BookOpen, Users, Cpu, Sparkles, ChevronRight } from 'lucide-react';
import './DepartmentSection.css';

const DEPT_STATS = [
  { label: 'Established', value: '2008', icon: BookOpen },
  { label: 'Graduated Engineers', value: '660+', icon: Users },
  { label: 'Technical Labs', value: '12+', icon: Cpu },
  { label: 'Placement Rate', value: 'Top MNCs', icon: Award },
];

const DepartmentSection = () => {
  const [showDepartment, setShowDepartment] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
    const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    }
  }, []);

  const toggleDepartment = () => {
    setShowDepartment((prev) => !prev);
  };

  return (
    <section id="department" className="department section-padding" ref={sectionRef}>
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-eyebrow">ACADEMIC EXCELLENCE</div>
          <h2 className="section-title">
            Department of <span className="neon-text-blue">Computer Science</span> & Engineering
          </h2>
          <div className="section-line" />
        </motion.div>

        {/* Stats Row */}
        <div className="dept-stats-grid">
          {DEPT_STATS.map((stat, sIdx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="dept-stat-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + sIdx * 0.08 }}
              >
                <div className="dept-stat-icon-wrap">
                  <Icon size={20} className="dept-stat-icon" />
                </div>
                <div className="dept-stat-value">{stat.value}</div>
                <div className="dept-stat-label">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* ====================================================================
            HOD PROFILE & EXPANDABLE DEPARTMENT INFO PANEL
            Initially: ONLY HOD is shown.
            Click HOD: Expands smoothly to the RIGHT (or BELOW on mobile).
            Click Again: Collapses back smoothly toward HOD photo.
            ==================================================================== */}
        <div className={`dept-showcase-stage ${showDepartment ? 'dept-showcase-stage--expanded' : 'dept-showcase-stage--initial'}`}>
          {/* HOD PROFILE CARD (Always visible & interactive) */}
          <motion.div
            className="hod-card-wrap"
            layout
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className={`hod-card glass-card ${showDepartment ? 'hod-card--active' : ''}`}
              ref={cardRef}
              onClick={toggleDepartment}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleDepartment()}
              aria-expanded={showDepartment}
              aria-label="Dr. Guru Kesav Das Gopisetty, HOD - Click to reveal or collapse CSE Department information"
              style={{ '--mouse-x': `${mousePos.x}%`, '--mouse-y': `${mousePos.y}%` }}
            >
              <div className="hod-cursor-glow" />

              {/* HOD Large Photo Frame */}
              <div className="hod-photo-frame">
                <div className="hod-photo-ring hod-photo-ring--outer" />
                <div className="hod-photo-ring hod-photo-ring--inner" />
                <img
                  src="/assets/leadership/01-hod.jpg"
                  alt="Dr. Guru Kesav Das Gopisetty"
                  className="hod-photo"
                  loading="lazy"
                />
                <div className="hod-photo-glow" />
              </div>

              {/* Info */}
              <div className="hod-info">
                <div className="hod-tag">HEAD OF DEPARTMENT</div>
                <h3 className="hod-name">Dr. Guru Kesav Das Gopisetty</h3>
                <p className="hod-designation">Department of Computer Science & Engineering</p>
                <p className="hod-college">KITS Akshar Institute of Technology</p>
              </div>

              {/* Interactive Click to Reveal Hint */}
              <div className="hod-click-indicator">
                <Sparkles size={13} className="hod-indicator-sparkle" />
                <span>{showDepartment ? 'COLLAPSE DEPARTMENT INFO' : 'CLICK TO REVEAL CSE DEPARTMENT'}</span>
                <ChevronRight size={15} className={`hod-indicator-arrow ${showDepartment ? 'hod-indicator-arrow--open' : ''}`} />
              </div>

              {/* Glowing accent border */}
              <div className="hod-border-sweep" />
            </div>
          </motion.div>

          {/* COSMIC ENERGY TRAIL CONNECTING HOD TO THE PANEL */}
          <AnimatePresence>
            {showDepartment && (
              <motion.div
                className="dept-energy-beam"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {/* CSE DEPARTMENT INFORMATION PANEL (Expands smoothly to the RIGHT) */}
          <AnimatePresence>
            {showDepartment && (
              <motion.div
                className="dept-info-panel glass-card"
                initial={{ opacity: 0, x: -45, scaleX: 0.88, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, scaleX: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -35, scaleX: 0.88, filter: 'blur(8px)' }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
              >
                {/* Panel Header */}
                <div className="dept-panel-header">
                  <div className="dept-panel-dot" />
                  <span className="dept-panel-title">VISION & EXCELLENCE</span>
                  <div className="dept-panel-line" />
                </div>

                {/* Content */}
                <div className="dept-content">
                  <p className="dept-para">
                    The Department of Computer Science and Engineering (CSE) was established in 2008 with a vision to provide a premier environment for Innovation, Scientific Discovery, and New Technology. It continues to evolve as a Centre of Excellence in Research and Learning, integrating computing disciplines with state-of-the-art engineering practices.
                  </p>
                  <p className="dept-para">
                    Through our student society Tech Horizon, symposiums, developer workshops, and continuous hands-on labs, students master competitive coding, cloud architectures, and full-stack engineering. Top MNC expert webinars, mock technical assessments, and faculty mentorship ensure our graduates consistently achieve top placement packages.
                  </p>
                </div>

                <div className="dept-highlights-grid">
                  <div className="dept-highlight-item">
                    <span className="highlight-bullet">✓</span>
                    <span>Active Industry Collaboration & Placements</span>
                  </div>
                  <div className="dept-highlight-item">
                    <span className="highlight-bullet">✓</span>
                    <span>State-of-the-Art Computing & AI Labs</span>
                  </div>
                  <div className="dept-highlight-item">
                    <span className="highlight-bullet">✓</span>
                    <span>Student Innovation & Technical Project Teams</span>
                  </div>
                  <div className="dept-highlight-item">
                    <span className="highlight-bullet">✓</span>
                    <span>Continuous Faculty Mentorship & Peer Groups</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default DepartmentSection;
