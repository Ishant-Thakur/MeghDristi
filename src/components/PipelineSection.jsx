import React from 'react';
import { Radio, Cpu, Sparkles, Send, ShieldCheck, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "High-Altitude IoT Mesh",
    subtitle: "Micro-Barometric & Doppler Arrays",
    icon: Radio,
    color: "text-primary",
    bgColor: "bg-forest/50 border-primary/40",
    desc: "114 high-durability sensor nodes stationed at critical elevation thresholds (1,000m – 4,500m) measuring barometric delta, humidity saturation, and upward convective wind vectors at 15-second cycles."
  },
  {
    step: "02",
    title: "XGBoost Inference",
    subtitle: "Gradient Boosted Risk Engine",
    icon: Cpu,
    color: "text-glacial",
    bgColor: "bg-surface-container-high border-glacial/40",
    desc: "Trained on 15 years of Western Himalayan cloudburst telemetry, the model correlates multi-station pressure collapses with terrain steepness to predict cloudburst probability (0.00 – 1.00)."
  },
  {
    step: "03",
    title: "Gemini 2.5 Flash Layer",
    subtitle: "Structured AI Situational Reasoning",
    icon: Sparkles,
    color: "text-primary-fixed",
    bgColor: "bg-forest-dark border-primary/50",
    desc: "Takes structured risk scores, river basin geometries, and sensor anomalies to generate plain-language early warnings, downstream lag predictions, and actionable evacuation corridors."
  },
  {
    step: "04",
    title: "HP-SDMA Rapid Dispatch",
    subtitle: "Automated Early Warning Siren Grid",
    icon: Send,
    color: "text-vermilion-bright",
    bgColor: "bg-vermilion-container/60 border-vermilion/50",
    desc: "Delivers sub-second encrypted situational briefs to District Magistrates, NDMA disaster operations centers, village pradhans, and automated riverside siren clusters."
  }
];

export default function PipelineSection() {
  return (
    <section id="pipeline" className="py-20 bg-surface-low border-b border-mountain-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title with Scroll Reveal */}
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-glacial mb-2">
              <ShieldCheck className="w-4 h-4 text-glacial" />
              <span>END-TO-END TELEMETRY & INFERENCE ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              From Raw Data to Prediction.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-on-surface-variant font-sans">
              How MeghDrishti transforms raw atmospheric pressure drops into lives-saving early-warning intelligence across rugged mountain terrain.
            </p>
          </div>
        </ScrollReveal>

        {/* 4-Step Pipeline Flow with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {PIPELINE_STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={item.step}
                direction="up"
                delay={index * 140}
                duration={700}
              >
                <div 
                  className="kath-kuni-card p-6 bg-surface-container border border-mountain-border flex flex-col justify-between relative group hover:border-primary/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full"
                >
                  <div>
                    {/* Step number badge & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-lowest text-on-surface-variant border border-mountain-border group-hover:border-primary/40 transition-colors">
                        PHASE {item.step}
                      </span>
                      <div className={`w-10 h-10 rounded border flex items-center justify-center ${item.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-lg font-bold font-display text-white mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs font-mono text-glacial block mb-4">
                      {item.subtitle}
                    </span>

                    {/* Description */}
                    <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom Step Indicator */}
                  <div className="mt-6 pt-3 border-t border-mountain-border/60 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                    <span>Latency</span>
                    <span className="text-white font-medium group-hover:text-primary transition-colors">
                      {index === 0 ? "15s polling" : index === 1 ? "< 120ms" : index === 2 ? "< 800ms" : "< 1.2s dispatch"}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
