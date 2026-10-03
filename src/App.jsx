import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import ParticleBackground from './components/ParticleBackground/ParticleBackground';
import SpaceEnvironment from './components/SpaceEnvironment/SpaceEnvironment';
import CursorEffect from './components/CursorEffect/CursorEffect';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import AboutSection from './components/AboutSection/AboutSection';
import DepartmentSection from './components/DepartmentSection/DepartmentSection';
import LeadershipSection from './components/LeadershipSection/LeadershipSection';
import ContactSection from './components/ContactSection/ContactSection';
import Footer from './components/Footer/Footer';
import AudioManager from './audio/AudioManager';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize global audio system at App root level for continuous deep-space ambience
    AudioManager.init();
  }, []);

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={handleLoadComplete} />}
      </AnimatePresence>

      {!loading && (
        <>
          <CursorEffect />
          <ParticleBackground />
          <SpaceEnvironment />
          <Navbar />
          <main>
            <Hero />
            <AboutSection />
            <DepartmentSection />
            <LeadershipSection />
            <ContactSection />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
