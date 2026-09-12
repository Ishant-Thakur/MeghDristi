import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowUpRight, CloudRain, Activity, Gauge, ChevronRight } from 'lucide-react';
import { getDistricts } from '../services/api';
import ScrollReveal from './ScrollReveal';

export default function DistrictRiskGrid({ onSelectDistrict }) {
  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getDistricts();
        if (isMounted) {
          setDistricts(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 30000); // refresh every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Filter 4 key highlight districts (or first 4)
  const highlightDistricts = districts.length > 0 
    ? districts.filter(d => ['kullu', 'mandi', 'kangra', 'solan', 'shimla', 'kinnaur'].includes(d.id)).slice(0, 4)
    : [];

  return (
    <section id="vulnerability-grid" className="py-20 bg-surface relative border-b border-mountain-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Scroll Reveal */}
        <ScrollReveal direction="up" duration={700}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-vermilion-bright mb-2">
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                <span>LIVE DISTRICT RISK SCORES // ML INFERENCE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                When the Clouds Become a Threat.
              </h2>
            </div>
            <p className="mt-3 md:mt-0 text-sm text-on-surface-variant max-w-md font-sans">
              Live Random Forest & Neural-WRF risk predictions across high-altitude catchments from Open-Meteo feeds. Click any card to drill down into live sensor telemetry.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Cards Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlightDistricts.map((district, index) => {
            const isCritical = district.riskLevel === 'CRITICAL' || district.riskScore >= 0.75;
            const isHigh = district.riskLevel === 'HIGH' || district.riskScore >= 0.45;
            const isModerate = district.riskLevel === 'MODERATE' || district.riskScore >= 0.25;

            return (
              <ScrollReveal
                key={district.id}
                direction="up"
                delay={index * 130}
                duration={700}
              >
                <div
                  onClick={() => onSelectDistrict(district.id)}
                  className={`kath-kuni-card p-6 bg-surface-container transition-all duration-500 cursor-pointer group hover:-translate-y-2 hover:scale-[1.02] h-full flex flex-col justify-between ${
                    isCritical 
                      ? 'border-vermilion/60 hover:border-vermilion hover:shadow-2xl hover:shadow-vermilion/30' 
                      : isHigh 
                      ? 'border-saffron/50 hover:border-saffron hover:shadow-2xl hover:shadow-saffron/20' 
                      : 'border-mountain-border hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10'
                  }`}
                >
                  <div>
                    {/* District and Status Header */}
                    <div className="flex items-center justify-between border-b border-mountain-border/60 pb-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold font-display text-white group-hover:text-primary transition-colors">
                          {district.name}
                        </span>
                        <span className="text-xs font-devanagari text-on-surface-variant">
                          {district.devanagari}
                        </span>
                      </div>

                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold border uppercase ${
                        isCritical 
                          ? 'bg-vermilion/20 text-vermilion-bright border-vermilion/40 animate-pulse' 
                          : isHigh 
                          ? 'bg-saffron/20 text-saffron border-saffron/40' 
                          : 'bg-surface-lowest text-glacial border-mountain-border'
                      }`}>
                        {district.riskLevel}
                      </span>
                    </div>

                    {/* Big Percentage Score Display */}
                    <div className="my-4">
                      <div className="flex items-baseline space-x-2">
                        <span className={`text-4xl sm:text-5xl font-bold font-display tracking-tight tnum ${
                          isCritical ? 'text-vermilion-bright' : isHigh ? 'text-saffron' : 'text-white'
                        }`}>
                          {(district.riskScore * 100).toFixed(0)}%
                        </span>
                        <span className="text-xs font-mono text-on-surface-variant">
                          Cloudburst Risk
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-2 text-xs font-mono">
                        <span className={district.isTrendingUp ? "text-vermilion-bright" : "text-glacial"}>
                          {district.trend || "Live Model"}
                        </span>
                        <span className="text-mountain-light">•</span>
                        <span className="text-on-surface-variant">Elev: {district.elevationM || district.elevation_m || 2200}m</span>
                      </div>
                    </div>

                    {/* Brief telemetry line */}
                    <div className="space-y-1.5 py-3 border-t border-mountain-border/60 text-xs font-mono text-on-surface-variant">
                      <div className="flex justify-between">
                        <span>Pressure:</span>
                        <span className="text-white font-medium">{district.telemetry?.barometricPressure || 982.4} hPa</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Precipitation:</span>
                        <span className="text-white font-medium">{district.telemetry?.precipRate || 14.2} mm/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Primary Focus:</span>
                        <span className="text-glacial truncate max-w-[130px]">{district.majorCatchments?.[0] || district.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Drill Down Footer */}
                  <div className="mt-4 pt-3 border-t border-mountain-border/60 flex items-center justify-between text-xs font-mono text-primary group-hover:text-white transition-colors">
                    <span>Drill Down</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
