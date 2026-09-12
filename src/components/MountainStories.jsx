import React from 'react';
import { Mountain, Waves, Compass, ShieldAlert, ChevronRight, Activity } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const STORIES = [
  {
    id: "kullu",
    title: "Parvati Valley",
    district: "Kullu District",
    elevation: "3,200m MSL",
    risk: "87% CRITICAL",
    riskColor: "text-vermilion-bright",
    borderColor: "border-vermilion/50 hover:border-vermilion",
    bgBadge: "bg-vermilion/20 text-vermilion-bright border-vermilion/40",
    description: "Narrow V-shaped glacial gorge forces saturated southwesterly monsoon currents into violent vertical updrafts, creating rapid meso-vortex cloudburst chambers.",
    hazard: "Flash Floods & Debris Flows",
    leadTime: "45–60 min warning window"
  },
  {
    id: "mandi",
    title: "Beas Lower Gorge",
    district: "Mandi District",
    elevation: "1,040m MSL",
    risk: "74% HIGH",
    riskColor: "text-saffron",
    borderColor: "border-saffron/40 hover:border-saffron",
    bgBadge: "bg-saffron/20 text-saffron border-saffron/40",
    description: "Acts as the primary hydraulic choke point for cumulative upstream discharge from Kullu, Bhuntar, and Sainj basins into Pandoh Dam reservoir.",
    hazard: "Hydraulic Surcharge & River Swelling",
    leadTime: "90–120 min lag surge window"
  },
  {
    id: "kangra",
    title: "Dhauladhar Escarpment",
    district: "Kangra District",
    elevation: "1,450m MSL",
    risk: "42% MODERATE",
    riskColor: "text-glacial",
    borderColor: "border-glacial/30 hover:border-glacial",
    bgBadge: "bg-glacial/20 text-glacial border-glacial/30",
    description: "Steep granite front rising directly from the Punjab plains causes instantaneous condensation along Bhagsu and Triund ridgelines.",
    hazard: "Seasonal Nullah Torrents",
    leadTime: "30–45 min local alert"
  },
  {
    id: "lahaul_spiti",
    title: "Spiti Rainshadow Basin",
    district: "Lahaul & Spiti",
    elevation: "4,280m MSL",
    risk: "29% LOW",
    riskColor: "text-primary",
    borderColor: "border-primary/30 hover:border-primary",
    bgBadge: "bg-forest/60 text-primary border-primary/30",
    description: "Protected behind the Greater Himalayan crestline. Low moisture levels with glacial melt stability dominating regional hydrology.",
    hazard: "Moraine Lake Drainage (GLOF)",
    leadTime: "Long-term monitoring"
  }
];

export default function MountainStories({ onSelectDistrict }) {
  return (
    <section className="py-20 bg-surface relative border-b border-mountain-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal direction="up" duration={700}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-primary mb-2">
                <Compass className="w-4 h-4 text-primary" />
                <span>GEOMORPHOLOGICAL VULNERABILITY MATRIX</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Every Mountain Tells a Risk Story.
              </h2>
            </div>
            <p className="mt-4 md:mt-0 text-sm text-on-surface-variant max-w-md font-sans">
              Each valley in the Western Himalayas possesses a distinct thermal signature, altitude profile, and hydrological lag response.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Terrain Cards Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORIES.map((story, index) => (
            <ScrollReveal
              key={story.id}
              direction="up"
              delay={index * 120}
              duration={700}
            >
              <div
                onClick={() => onSelectDistrict(story.id)}
                className={`kath-kuni-card p-6 bg-surface-container transition-all duration-500 cursor-pointer group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl h-full flex flex-col justify-between ${story.borderColor}`}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-mountain-border/60 pb-3 mb-4">
                    <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                      {story.district}
                    </span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border font-bold ${story.bgBadge}`}>
                      {story.risk}
                    </span>
                  </div>

                  {/* Title & Elevation */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-primary transition-colors flex items-center justify-between">
                      <span>{story.title}</span>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <span className="text-xs font-mono text-glacial flex items-center space-x-1 mt-1">
                      <Mountain className="w-3 h-3" />
                      <span>{story.elevation}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-6 font-sans">
                    {story.description}
                  </p>
                </div>

                {/* Footer specs */}
                <div className="pt-3 border-t border-mountain-border/60 space-y-1.5 text-[11px] font-mono mt-auto">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>Primary Hazard:</span>
                    <span className="text-white font-medium">{story.hazard}</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>Lead Time:</span>
                    <span className="text-glacial">{story.leadTime}</span>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
