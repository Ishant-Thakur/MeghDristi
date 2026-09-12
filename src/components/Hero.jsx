import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { 
  ShieldAlert, 
  ArrowUpRight, 
  Layers, 
  Activity, 
  Wind, 
  Gauge, 
  CloudRain, 
  Radio, 
  Sparkles,
  Mountain
} from 'lucide-react';

export default function Hero({ onSelectDistrict, onOpenTwin }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative pt-16 pb-24 overflow-hidden border-b border-mountain-border min-h-[660px] flex items-center"
    >
      {/* Mountain Storm Background Image with Scroll & Mouse Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65 pointer-events-none scale-105 will-change-transform transition-transform duration-300 ease-out"
        style={{ 
          backgroundImage: "url('/hero-mountains-storm.jpg')",
          transform: `translate3d(${mousePos.x * -24}px, ${scrollY * 0.15 + mousePos.y * -16}px, 0) scale(1.08)`
        }}
      />

      {/* Atmospheric Floating Mist Drifting Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-glacial/10 via-transparent to-primary/10 pointer-events-none animate-drift-slow" />

      {/* Cinematic Directional Gradients for Contrast & Legibility */}
      {/* Left dark scrim for headline readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-surface-lowest via-surface-lowest/80 to-surface-lowest/20 pointer-events-none" />
      {/* Top and Bottom atmospheric fade to integrate with theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-lowest/90 via-transparent to-surface pointer-events-none" />

      {/* Scanline CRT overlay */}
      <div className="scanline-overlay" />

      {/* Subtle Topographic Accent Lines & Floating Orbs */}
      <div className="absolute inset-0 bg-kath-kuni-pattern opacity-15 pointer-events-none" />
      <div 
        className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none animate-float-subtle transition-transform duration-700"
        style={{ transform: `translate3d(${mousePos.x * 30}px, ${mousePos.y * 30}px, 0)` }}
      />
      <div 
        className="absolute top-1/3 right-1/4 w-80 h-80 bg-vermilion/15 rounded-full blur-3xl pointer-events-none animate-float-subtle transition-transform duration-700"
        style={{ transform: `translate3d(${mousePos.x * -40}px, ${mousePos.y * -40}px, 0)` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission, Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Mission Category Chip */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-surface-container border border-primary/30 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-glacial animate-pulse" />
              <span className="text-primary font-medium">HIMACHAL PRADESH DISASTER MANAGEMENT INITIATIVE</span>
            </div>

            {/* Main Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.1]">
              Understanding the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mist via-primary to-glacial">
                Himalayas Before
              </span> <br />
              the Storm.
            </h1>

            {/* Detailed scientific explanation */}
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed font-sans">
              MeghDrishti is an AI-powered high-altitude climate digital twin that anticipates catastrophic cloudbursts, flash floods, and orographic micro-ruptures across Himachal Pradesh's 12 districts before radar echoes saturate.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenTwin) onOpenTwin();
                }}
                className="flex items-center space-x-2 px-6 py-3.5 rounded bg-forest hover:bg-forest-hover border border-primary/80 text-white font-display font-semibold text-sm shadow-xl shadow-forest/50 hover:shadow-primary/30 transition-all hover:scale-[1.03] group cursor-pointer"
              >
                <Layers className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
                <span className="tracking-wide">START DIGITAL TWIN</span>
                <ArrowUpRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectDistrict) onSelectDistrict('kullu');
                }}
                className="flex items-center space-x-2 px-6 py-3.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-vermilion/50 text-vermilion-bright font-display font-semibold text-sm transition-all hover:border-vermilion hover:scale-[1.02] cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-vermilion-bright animate-pulse" />
                <span>View Live Alerts (Kullu 87%)</span>
              </button>
            </div>

            {/* High-altitude telemetry summary badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-mountain-border/60 max-w-lg">
              <div>
                <span className="block text-2xl font-bold font-display text-white tnum">12</span>
                <span className="text-xs text-on-surface-variant font-mono">Districts Monitored</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-display text-vermilion-bright tnum">94.8%</span>
                <span className="text-xs text-on-surface-variant font-mono">Precursor Recall</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-display text-glacial tnum">&lt; 45s</span>
                <span className="text-xs text-on-surface-variant font-mono">Inference Latency</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Digital Twin Live Preview Card */}
          <div className="lg:col-span-5">
            <div 
              className="kath-kuni-card p-5 border border-mountain-border/80 bg-surface-container-low/95 shadow-2xl relative overflow-hidden group will-change-transform"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 10}deg) rotateX(${mousePos.y * -10}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-mountain-border/60 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-vermilion-bright animate-ping" />
                  <span className="text-xs font-mono font-semibold tracking-wider text-white uppercase">
                    Live Telemetry Reticle
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-forest/80 text-primary border border-primary/30">
                  HP-KLU // 3,200m
                </span>
              </div>

              {/* Real Leaflet 3D Radar Vector Screen */}
              <div className="relative h-56 rounded bg-surface-lowest border border-mountain-border overflow-hidden">
                <MapContainer
                  center={[31.9579, 77.1095]} // Kullu/Parvati Basin
                  zoom={9}
                  scrollWheelZoom={false}
                  zoomControl={false}
                  className="w-full h-full"
                  attributionControl={false}
                >
                  <TileLayer
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    maxZoom={17}
                  />

                  {/* Doppler Cloudburst Epicenter Marker */}
                  <CircleMarker
                    center={[31.9579, 77.1095]}
                    radius={28}
                    pathOptions={{
                      color: '#ff5449',
                      fillColor: '#a33a2b',
                      fillOpacity: 0.5,
                      weight: 2,
                      dashArray: '4,4'
                    }}
                  />
                  <CircleMarker
                    center={[31.9579, 77.1095]}
                    radius={8}
                    pathOptions={{
                      color: '#ffffff',
                      fillColor: '#a33a2b',
                      fillOpacity: 0.9,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="font-mono text-xs">
                        <strong className="text-white block">Parvati Catchment (Kullu)</strong>
                        <span className="text-vermilion-bright font-bold">87% Critical Cloudburst Genesis</span>
                      </div>
                    </Popup>
                  </CircleMarker>
                </MapContainer>

                {/* Overlaid Radar Sweep Simulation on real map */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-56 h-56 rounded-full border border-vermilion/30 animate-radar-sweep relative">
                    <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-gradient-to-tr from-transparent via-vermilion/10 to-vermilion/30 -translate-x-full -translate-y-full origin-bottom-right transform" />
                  </div>
                </div>

                {/* Overlaid HUD tags */}
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                  <span className="text-[10px] font-mono font-bold text-vermilion-bright bg-surface-lowest/90 px-2 py-0.5 rounded border border-vermilion/40 shadow">
                    PARVATI BASIN: 87% RISK
                  </span>
                </div>

                {/* Ambient Elevation Vector Grid */}
                <div className="absolute bottom-2 left-3 z-20 text-[10px] font-mono text-white bg-surface-lowest/80 px-1.5 py-0.5 rounded border border-mountain-border flex items-center space-x-1">
                  <Mountain className="w-3 h-3 text-glacial" />
                  <span>ELEV: 3,200m MSL</span>
                </div>
                <div className="absolute bottom-2 right-3 z-20 text-[10px] font-mono text-glacial bg-surface-lowest/80 px-1.5 py-0.5 rounded border border-mountain-border flex items-center space-x-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>DOPPLER 62.4 dBZ</span>
                </div>
              </div>

              {/* Real-time metrics bar */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded bg-surface-container border border-mountain-border/60">
                  <span className="text-[10px] font-mono text-on-surface-variant block">BAROMETRIC</span>
                  <span className="text-sm font-bold font-mono text-vermilion-bright tnum">982.4 hPa</span>
                  <span className="text-[9px] font-mono text-vermilion-bright block">-18.4 hPa / 90m</span>
                </div>
                <div className="p-2 rounded bg-surface-container border border-mountain-border/60">
                  <span className="text-[10px] font-mono text-on-surface-variant block">PRECIP RATE</span>
                  <span className="text-sm font-bold font-mono text-white tnum">84.6 mm/h</span>
                  <span className="text-[9px] font-mono text-glacial block">+32.0 mm/h</span>
                </div>
                <div className="p-2 rounded bg-surface-container border border-mountain-border/60">
                  <span className="text-[10px] font-mono text-on-surface-variant block">UPDRAFT</span>
                  <span className="text-sm font-bold font-mono text-saffron tnum">14.8 m/s</span>
                  <span className="text-[9px] font-mono text-saffron block">Meso-Vortex</span>
                </div>
              </div>

              {/* Gemini AI Synthesis Callout */}
              <div className="mt-4 p-3 rounded bg-surface-container-high border border-primary/20 flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-on-surface leading-snug font-sans">
                  <strong className="text-primary font-mono text-[11px] block uppercase">Gemini 2.5 Flash Autonomous Alert:</strong>
                  Orographic cloudburst rupture imminent in upper Manikaran. Early-warning dispatch broadcast to HP-SDMA.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
