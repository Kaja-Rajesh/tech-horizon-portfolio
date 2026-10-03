import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import IceRevealCard from '../IceRevealCard/IceRevealCard';
import './AboutSection.css';

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="about section-padding" ref={ref}>
      <div className="section-container">
        {/* Title */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-eyebrow">WHO WE ARE</div>
          <h2 className="section-title">About <span className="neon-text-blue">Tech Horizon</span></h2>
          <div className="section-line" />
        </motion.div>

        {/* Description */}
        <motion.p
          className="about-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Tech Horizon is a student-driven technology community where curious minds explore, innovate, collaborate, and transform ideas into real-world solutions.
        </motion.p>

        {/* Cards grid */}
        <div className="about-cards">
          {['explore', 'innovate', 'collaborate', 'transform'].map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="about-card-wrap"
            >
              <IceRevealCard cardKey={key} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
