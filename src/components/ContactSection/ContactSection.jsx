import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import './ContactSection.css';

const CONTACTS = [
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    value: 'kitsakshartechhorizon@gmail.com',
    href: 'mailto:kitsakshartechhorizon@gmail.com',
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.35)',
    gradient: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(6,182,212,0.04))',
    newTab: false,
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'tech-horizon-b19ba0439',
    href: 'https://www.linkedin.com/in/tech-horizon-b19ba0439',
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.35)',
    gradient: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(0,212,255,0.04))',
    newTab: true,
  },
  {
    id: 'instagram',
    icon: Instagram,
    label: 'Instagram',
    value: '@techhorizon_kitsakshar',
    href: 'https://www.instagram.com/techhorizon_kitsakshar',
    color: '#d946ef',
    glow: 'rgba(217,70,239,0.35)',
    gradient: 'linear-gradient(135deg, rgba(217,70,239,0.08), rgba(168,85,247,0.04))',
    newTab: true,
  },
];

const ContactCard = ({ contact, index, inView }) => {
  const Icon = contact.icon;
  return (
    <motion.a
      href={contact.href}
      target={contact.newTab ? '_blank' : '_self'}
      rel={contact.newTab ? 'noopener noreferrer' : undefined}
      className="contact-card glass-card"
      style={{
        '--contact-color': contact.color,
        '--contact-glow': contact.glow,
        '--contact-gradient': contact.gradient,
      }}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
      whileHover={{ y: -6, scale: 1.03 }}
      aria-label={`${contact.label}: ${contact.value}`}
      data-interactive
    >
      {/* Light sweep */}
      <div className="contact-sweep" />

      {/* Icon */}
      <div className="contact-icon-wrap">
        <Icon size={28} className="contact-icon" />
        <div className="contact-icon-glow" />
        {/* Orbit ring */}
        <div className="contact-orbit" />
      </div>

      {/* Text */}
      <div className="contact-info">
        <div className="contact-label">{contact.label}</div>
        <div className="contact-value">{contact.value}</div>
      </div>

      {/* Border glow */}
      <div className="contact-border" />

      {/* HUD corners */}
      <div className="contact-corner contact-corner--tl" />
      <div className="contact-corner contact-corner--br" />
    </motion.a>
  );
};

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="connect" className="contact section-padding" ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-eyebrow">GET IN TOUCH</div>
          <h2 className="section-title">
            Connect With <span className="neon-text-blue">Tech Horizon</span>
          </h2>
          <div className="section-line" />
        </motion.div>

        <div className="contact-cards">
          {CONTACTS.map((c, i) => (
            <ContactCard key={c.id} contact={c} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
