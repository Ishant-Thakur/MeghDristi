import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhereMountainsShapeWeather from './components/WhereMountainsShapeWeather';
import MountainStories from './components/MountainStories';
import PipelineSection from './components/PipelineSection';
import DigitalTwinDashboard from './components/DigitalTwinDashboard';
import DistrictRiskGrid from './components/DistrictRiskGrid';
import AICopilot from './components/AICopilot';
import ImpactAndLab from './components/ImpactAndLab';
import SitrepModal from './components/SitrepModal';
import Footer from './components/Footer';
import { HP_DISTRICTS_DATA } from './data/hpDistricts';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [selectedDistrictId, setSelectedDistrictId] = useState('kullu');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isSitrepOpen, setIsSitrepOpen] = useState(false);

  const activeDistrict = HP_DISTRICTS_DATA.find(d => d.id === selectedDistrictId) || HP_DISTRICTS_DATA[0];

  // Check URL hash on initial load
  useEffect(() => {
    if (window.location.hash === '#dashboard' || window.location.hash === '#digital-twin') {
      setCurrentView('dashboard');
    }
  }, []);

  const handleStartDashboard = (districtId = 'kullu') => {
    setSelectedDistrictId(districtId);
    setCurrentView('dashboard');
    window.location.hash = 'dashboard';
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleReturnToLanding = () => {
    setCurrentView('landing');
    window.location.hash = 'landing';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Dashboard view, render the dedicated Tactical Command Deck
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#08100f] text-[#dce4e2] flex flex-col font-sans">
        <DigitalTwinDashboard
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
          onReturnToLanding={handleReturnToLanding}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
        
        {/* Emergency Situation Report (SITREP) Modal */}
        <SitrepModal
          isOpen={isSitrepOpen}
          onClose={() => setIsSitrepOpen(false)}
          activeDistrict={activeDistrict}
        />
      </div>
    );
  }

  // Otherwise, render the Landing Page
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-forest selection:text-primary">
      {/* Top Header & Ticker */}
      <Header
        activeDistrict={activeDistrict}
        onSelectDistrict={handleStartDashboard}
        onOpenSitrep={() => setIsSitrepOpen(true)}
        onOpenTwin={() => handleStartDashboard('kullu')}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Landing Page Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onSelectDistrict={handleStartDashboard}
          onOpenTwin={() => handleStartDashboard('kullu')}
        />

        {/* Where Mountains Shape Weather Narrative */}
        <WhereMountainsShapeWeather />

        {/* Every Mountain Tells a Risk Story */}
        <MountainStories onSelectDistrict={handleStartDashboard} />

        {/* From Raw Data to Prediction Architecture */}
        <PipelineSection />

        {/* Live District Risk Cards Grid (When the Clouds Become a Threat) */}
        <DistrictRiskGrid onSelectDistrict={handleStartDashboard} />

        {/* Gemini AI Interactive Climate Copilot (Ask the Himalayas) */}
        <AICopilot activeDistrict={activeDistrict} />

        {/* Impact Metrics & Kath-Kuni Heritage Architecture */}
        <ImpactAndLab />
      </main>

      {/* Emergency Situation Report (SITREP) Modal */}
      <SitrepModal
        isOpen={isSitrepOpen}
        onClose={() => setIsSitrepOpen(false)}
        activeDistrict={activeDistrict}
      />

      {/* Atmospheric Observatory Footer */}
      <Footer onOpenTwin={() => handleStartDashboard('kullu')} />
    </div>
  );
}
