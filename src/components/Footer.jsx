import React from 'react';
import { Compass, ShieldCheck, Radio, Terminal, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ onOpenTwin }) {
  return (
    <footer className="bg-surface-lowest border-t border-mountain-border pt-16 pb-12 relative text-on-surface-variant">
      
      {/* Subtle Kath-Kuni Teeth Accent */}
      <div className="kath-kuni-subtle-teeth absolute top-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-mountain-border/60">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-forest border border-primary/40 flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold font-display text-white">
                  MeghDrishti
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-forest text-primary border border-primary/30 font-devanagari">
                  मेघदृष्टि
                </span>
              </div>
            </div>

            <p className="text-xs font-sans text-on-surface-variant leading-relaxed max-w-sm">
              AI-Powered High-Altitude Cloudburst Prediction & Digital Twin for Himachal Pradesh. Synthesizing distributed micro-barometric IoT nodes, XGBoost risk classification, and Gemini 2.5 Flash early-warning intelligence.
            </p>

            <div className="flex items-center space-x-2 text-[11px] font-mono text-glacial pt-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>HIGH-ALTITUDE OBSERVATORY MESH // OPERATIONAL</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-on-surface-variant">
              <li>
                <button 
                  onClick={onOpenTwin} 
                  className="hover:text-primary transition-colors cursor-pointer text-left"
                >
                  Digital Twin Viewport
                </button>
              </li>
              <li><a href="#vulnerability-grid" className="hover:text-primary transition-colors">Districts & Risk</a></li>
              <li><a href="#pipeline" className="hover:text-primary transition-colors">Inference Pipeline</a></li>
              <li><a href="#ai-copilot" className="hover:text-primary transition-colors">Gemini Copilot</a></li>
            </ul>
          </div>

          {/* Col 3: Disaster Management & Protocols */}
          <div className="lg:col-span-2 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">
              HP-SDMA Protocols
            </h4>
            <ul className="space-y-2 text-on-surface-variant">
              <li><span className="text-white">HP State EOC:</span> 1070</li>
              <li><span className="text-white">District EOC:</span> 1077</li>
              <li><span className="text-white">Emergency:</span> 112</li>
              <li><span className="text-glacial">NDMA CAP Compliant</span></li>
            </ul>
          </div>

          {/* Col 4: Science & Architecture */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">
              Architecture Stack
            </h4>
            <div className="p-3 rounded bg-surface-container border border-mountain-border space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Frontend:</span>
                <span className="text-white">React + Tailwind + Leaflet</span>
              </div>
              <div className="flex justify-between">
                <span>ML Model:</span>
                <span className="text-glacial">XGBoost / FastAPI</span>
              </div>
              <div className="flex justify-between">
                <span>Narrative AI:</span>
                <span className="text-primary">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between">
                <span>Backend:</span>
                <span className="text-white">Node.js + MongoDB</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-on-surface-variant/80 gap-4">
          <div>
            © 2026 MeghDrishti (मेघदृष्टि) • Western Himalayan Climate Resilience Consortium
          </div>
          <div className="flex items-center space-x-2">
            <span>Built with scientific precision for Himachal Pradesh</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
