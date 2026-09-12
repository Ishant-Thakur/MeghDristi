import React from 'react';
import { Mountain, Wind, CloudRain, Droplets, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function WhereMountainsShapeWeather() {
  return (
    <section className="py-20 bg-surface-low border-b border-mountain-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Topographic Vista Container with Scroll Reveal */}
          <div className="lg:col-span-6">
            <ScrollReveal direction="left" duration={800}>
              <div className="relative rounded-lg overflow-hidden border border-mountain-border bg-surface-lowest shadow-2xl group">
                {/* Alpine Mountain Visual Canvas */}
                <div 
                  className="relative h-80 sm:h-96 w-full bg-cover bg-center bg-no-repeat overflow-hidden flex items-end group-hover:scale-[1.03] transition-transform duration-700"
                  style={{ backgroundImage: "url('/hero-mountains-storm.jpg')" }}
                >
                  {/* Atmospheric Fog / Dark Vignette Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-lowest via-surface-lowest/40 to-transparent" />
                  <div className="absolute inset-0 bg-forest/20 mix-blend-multiply" />

                  {/* Overlaid Telemetry Badge on Image */}
                  <div className="relative z-10 p-6 w-full flex items-end justify-between">
                    <div className="bg-surface-container-high/90 backdrop-blur-md p-3 rounded border border-mountain-border shadow-xl">
                      <span className="text-[10px] font-mono text-glacial block font-semibold uppercase">
                        Parvati Valley Gorge Focus
                      </span>
                      <span className="text-sm font-bold font-display text-white">
                        Orographic Moisture Funneling
                      </span>
                    </div>

                    <span className="text-xs font-mono text-primary bg-forest/80 px-2.5 py-1 rounded border border-primary/30">
                      ELEV 3,200m
                    </span>
                  </div>
                </div>

                {/* Bottom status strip */}
                <div className="p-3 bg-surface-container-high border-t border-mountain-border text-xs font-mono text-on-surface-variant flex items-center justify-between">
                  <span>SENSOR RETICLE: KASOL-MANIKARAN ARRAY</span>
                  <span className="text-vermilion-bright font-semibold">THERMAL INVERSION ACTIVE</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Deep Meteorological Narrative & Metrics */}
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal direction="right" duration={800} delay={100}>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-glacial mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-glacial" />
                <span>OROGRAPHIC DYNAMICS & HIGH-ALTITUDE PHYSICS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Where the Mountains <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-glacial">
                  Shape the Weather.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans mt-4">
                Unlike flatland precipitation systems, Himalayan cloudbursts are hyper-localized thermodynamic events. Monsoon moisture plumes funneling up narrow valleys strike vertical granite massifs, triggering explosive vertical updrafts exceeding 15 m/s.
              </p>

              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans mt-3">
                In under 45 minutes, massive cumulonimbus towers collapse into catastrophic deluges. MeghDrishti's digital twin models the micro-barometric precursor gradient, providing critical 60–90 minute early-warning windows to safeguard vulnerable settlements.
              </p>

              {/* Key Telemetry Pillars matching design.png */}
              <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-mountain-border/60">
                <ScrollReveal direction="up" delay={200} duration={600}>
                  <div className="p-3 rounded bg-surface-container border border-mountain-border hover:border-primary/40 transition-colors">
                    <span className="text-2xl font-bold font-display text-white tnum block">3,124m</span>
                    <span className="text-[11px] font-mono text-on-surface-variant">Mean Inversion Level</span>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={300} duration={600}>
                  <div className="p-3 rounded bg-surface-container border border-mountain-border hover:border-vermilion/40 transition-colors">
                    <span className="text-2xl font-bold font-display text-vermilion-bright tnum block">+480mm/h</span>
                    <span className="text-[11px] font-mono text-on-surface-variant">Max Micro-Burst Rate</span>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={400} duration={600}>
                  <div className="p-3 rounded bg-surface-container border border-mountain-border hover:border-glacial/40 transition-colors">
                    <span className="text-2xl font-bold font-display text-glacial tnum block">4,500 km²</span>
                    <span className="text-[11px] font-mono text-on-surface-variant">Catchment Monitored</span>
                  </div>
                </ScrollReveal>
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
