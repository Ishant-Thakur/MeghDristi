import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Volume2, 
  VolumeX, 
  FileText, 
  Radio, 
  ChevronRight, 
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/audioAlert';

export default function Header({ 
  activeDistrict, 
  onSelectDistrict, 
  onOpenSitrep,
  onOpenTwin,
  soundEnabled,
  setSoundEnabled
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.toggleSound(nextState);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-lowest/90 backdrop-blur-md border-b border-mountain-border">
      {/* Top Kath-Kuni Critical Hazard Alert Teeth Bar */}
      <div className="kath-kuni-teeth-border" />

      {/* Ticker bar */}
      <div className="bg-surface-low border-b border-mountain-border/40 px-4 py-1.5 text-xs flex items-center justify-between overflow-x-auto">
        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={onOpenTwin}
            className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-vermilion/20 text-vermilion-bright border border-vermilion/40 font-mono text-[11px] font-semibold animate-pulse hover:bg-vermilion/30 transition-all cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-vermilion-bright"></span>
            <span>CRITICAL ALERT: KULLU (87%)</span>
          </button>
          <span className="text-on-surface-variant hidden sm:inline-block">
            Barometric collapse -18.4 hPa detected in Parvati Basin • Phase-4 Evacuation advised
          </span>
        </div>

        <div className="flex items-center space-x-4 shrink-0 text-on-surface-variant text-[11px] font-mono">
          <span className="flex items-center space-x-1">
            <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-primary font-medium">114 IoT NODES ONLINE</span>
          </span>
          <span className="hidden md:inline-block text-mountain-light">|</span>
          <span className="hidden md:inline-block">LATENCY: 42ms</span>
          <span className="hidden md:inline-block text-mountain-light">|</span>
          <span className="text-glacial">REFRESH: 15s</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Devanagari Title */}
          <div className="flex items-center space-x-4">
            <a href="#" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-forest to-surface-container-highest border border-primary/40 flex items-center justify-center shadow-lg shadow-primary/5 group-hover:border-primary transition-all">
                <Compass className="w-6 h-6 text-primary group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold tracking-tight text-white font-display">
                    MeghDrishti
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-forest/80 text-primary border border-primary/20 font-devanagari font-medium">
                    मेघदृष्टि
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">
                  High-Altitude Climate Digital Twin
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-on-surface-variant">
            <button 
              onClick={onOpenTwin}
              className="flex items-center space-x-1.5 hover:text-primary transition-colors py-1 cursor-pointer font-medium"
            >
              <Layers className="w-4 h-4 text-primary" />
              <span>Digital Twin</span>
            </button>
            <a 
              href="#vulnerability-grid" 
              className="hover:text-primary transition-colors py-1"
            >
              Districts & Risk
            </a>
            <a 
              href="#pipeline" 
              className="hover:text-primary transition-colors py-1"
            >
              Architecture
            </a>
            <a 
              href="#ai-copilot" 
              className="flex items-center space-x-1.5 hover:text-primary transition-colors py-1"
            >
              <Sparkles className="w-4 h-4 text-glacial" />
              <span>Gemini Copilot</span>
            </a>
          </nav>

          {/* Right Utilities & Actions */}
          <div className="flex items-center space-x-3">
            {/* Audio Alert Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? "Disable Telemetry Audio Chimes" : "Enable Telemetry Audio Chimes"}
              className={`p-2 rounded border transition-all text-xs font-mono flex items-center space-x-1.5 ${
                soundEnabled 
                  ? 'bg-forest/60 border-primary/40 text-primary' 
                  : 'bg-surface-container border-mountain-border text-on-surface-variant hover:border-mountain-light'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>

            {/* SITREP Emergency Report Button */}
            <button
              onClick={onOpenSitrep}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded bg-surface-container-high border border-mountain-border hover:border-glacial/40 text-on-surface text-xs font-mono font-medium transition-all hover:bg-surface-container-highest cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-glacial" />
              <span>SITREP BRIEF</span>
            </button>

            {/* Live Twin Launch CTA */}
            <button
              onClick={onOpenTwin}
              className="flex items-center space-x-2 px-4 py-2 rounded bg-forest hover:bg-forest-hover border border-primary/50 text-mist text-xs font-display font-semibold tracking-wider transition-all shadow-lg shadow-forest/40 hover:shadow-forest/70 cursor-pointer"
            >
              <span>LIVE TWIN</span>
              <ChevronRight className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
