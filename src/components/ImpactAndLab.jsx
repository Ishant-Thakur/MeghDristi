import React from 'react';
import { ShieldCheck, Cpu, Database, Compass, Mountain, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ImpactAndLab() {
  return (
    <section className="py-20 bg-surface relative border-b border-mountain-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Pillar 1: Born in the Himalayas, Built for India */}
        <div>
          <ScrollReveal direction="up" duration={700}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-primary mb-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>MEASURABLE RESILIENCE IMPACT</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Born in the Himalayas, Built for India.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-on-surface-variant font-sans">
                Designed from ground-zero for rugged high-altitude terrain where conventional weather radars suffer from severe beam blockage.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal direction="up" delay={100} duration={700}>
              <div className="kath-kuni-card p-6 bg-surface-container border border-mountain-border hover:border-vermilion/50 transition-all duration-500 h-full hover:-translate-y-1.5">
                <span className="text-4xl font-bold font-display text-vermilion-bright block tnum mb-1">
                  94.8%
                </span>
                <span className="text-xs font-mono text-white block font-bold mb-2">
                  Precursor Recall Rate
                </span>
                <p className="text-xs text-on-surface-variant font-sans leading-relaxed">
                  Trained on 15 years of atmospheric pressure records from the Western Himalayas.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200} duration={700}>
              <div className="kath-kuni-card p-6 bg-surface-container border border-mountain-border hover:border-primary/50 transition-all duration-500 h-full hover:-translate-y-1.5">
                <span className="text-4xl font-bold font-display text-primary block tnum mb-1">
                  &lt; 45s
                </span>
                <span className="text-xs font-mono text-white block font-bold mb-2">
                  Telemetry to Prediction
                </span>
                <p className="text-xs text-on-surface-variant font-sans leading-relaxed">
                  Real-time micro-service architecture delivering sub-minute risk scores to SDMA.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300} duration={700}>
              <div className="kath-kuni-card p-6 bg-surface-container border border-mountain-border hover:border-glacial/50 transition-all duration-500 h-full hover:-translate-y-1.5">
                <span className="text-4xl font-bold font-display text-glacial block tnum mb-1">
                  12
                </span>
                <span className="text-xs font-mono text-white block font-bold mb-2">
                  Districts Fully Modeled
                </span>
                <p className="text-xs text-on-surface-variant font-sans leading-relaxed">
                  Complete polygonized catchment mapping covering 55,673 sq km of Himachal Pradesh.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400} duration={700}>
              <div className="kath-kuni-card p-6 bg-surface-container border border-mountain-border hover:border-saffron/50 transition-all duration-500 h-full hover:-translate-y-1.5">
                <span className="text-4xl font-bold font-display text-saffron block tnum mb-1">
                  100%
                </span>
                <span className="text-xs font-mono text-white block font-bold mb-2">
                  Open NDMA Protocol
                </span>
                <p className="text-xs text-on-surface-variant font-sans leading-relaxed">
                  Direct integration with Common Alerting Protocol (CAP) and HP State Disaster authorities.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Pillar 2: Ancient Mountains. New Intelligence. (Kath-Kuni Design Philosophy) */}
        <ScrollReveal direction="zoom" duration={850}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-surface-container-low p-8 sm:p-12 rounded-lg border border-mountain-border">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-primary">
                <Compass className="w-4 h-4 text-primary" />
                <span>INDIGENOUS VERNACULAR ARCHITECTURE & CLIMATE AI</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                Ancient Mountains. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-glacial">
                  New Intelligence.
                </span>
              </h3>

              <p className="text-sm text-on-surface-variant font-sans leading-relaxed">
                For centuries, the people of Himachal Pradesh engineered <strong className="text-white">Kath-Kuni</strong> structures—interlocking alternate courses of deodar timber and dry stone without mortar—to absorb seismic shocks and extreme cloudburst deluge.
              </p>

              <p className="text-sm text-on-surface-variant font-sans leading-relaxed">
                MeghDrishti translates this indigenous philosophy of modular structural resilience into modern software architecture: distributed IoT nodes, multi-tier failsafes, and AI-driven early warnings that safeguard Himalayan communities before disaster strikes.
              </p>

              <div className="pt-2 flex flex-wrap gap-3 text-xs font-mono">
                <span className="px-3 py-1 rounded bg-forest/80 text-primary border border-primary/30 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kath-Kuni Elastic Resilience</span>
                </span>
                <span className="px-3 py-1 rounded bg-surface-container-high text-glacial border border-mountain-border flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sub-Second Sensor Fault-Tolerance</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              {/* Kath-Kuni Geometric Architectural Diagram Graphic */}
              <div className="p-6 rounded bg-surface-lowest border border-mountain-border relative overflow-hidden">
                <div className="kath-kuni-teeth-border mb-4" />
                
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded bg-forest/40 border border-primary/30 text-white flex justify-between items-center hover:bg-forest/60 transition-colors">
                    <span>TIMBER LAYER // IoT ARRAY</span>
                    <span className="text-primary font-bold">ACTIVE</span>
                  </div>
                  <div className="p-3 rounded bg-surface-container border border-mountain-border text-white flex justify-between items-center hover:bg-surface-container-high transition-colors">
                    <span>STONE BEARING // XGBOOST ML</span>
                    <span className="text-glacial font-bold">STABLE</span>
                  </div>
                  <div className="p-3 rounded bg-forest/40 border border-primary/30 text-white flex justify-between items-center hover:bg-forest/60 transition-colors">
                    <span>TIMBER LAP JOINT // GEMINI 2.5</span>
                    <span className="text-primary font-bold">READY</span>
                  </div>
                  <div className="p-3 rounded bg-surface-container border border-mountain-border text-white flex justify-between items-center hover:bg-surface-container-high transition-colors">
                    <span>BEDROCK PLANE // HP-SDMA</span>
                    <span className="text-saffron font-bold">LINKED</span>
                  </div>
                </div>

                <div className="kath-kuni-teeth-border mt-4" />
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
