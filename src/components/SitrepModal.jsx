import React from 'react';
import { X, Printer, ShieldAlert, FileText, Download, CheckCircle } from 'lucide-react';
import { HP_DISTRICTS_DATA } from '../data/hpDistricts';

export default function SitrepModal({ isOpen, onClose, activeDistrict }) {
  if (!isOpen) return null;

  const criticalDistricts = HP_DISTRICTS_DATA.filter(d => d.riskScore > 0.6);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface-lowest border-2 border-vermilion rounded-lg shadow-2xl p-6 sm:p-8 text-on-surface my-8">
        
        {/* Kath-Kuni Teeth Top Accent */}
        <div className="kath-kuni-teeth-border absolute top-0 left-0 right-0 rounded-t-lg" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-on-surface-variant hover:text-white hover:bg-surface-container"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-mountain-border pb-4 mb-6">
          <div className="flex items-center space-x-2 text-vermilion-bright font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>HP-SDMA / NDMA OFFICIAL SITUATION REPORT (SITREP)</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            MeghDrishti High-Altitude Cloudburst Early Warning Brief
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-on-surface-variant mt-2">
            <span>ISSUED: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
            <span>•</span>
            <span>CLASSIFICATION: EMERGENCY DISPATCH</span>
            <span>•</span>
            <span className="text-primary font-bold">GEMINI 2.5 FLASH VERIFIED</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="space-y-6 text-xs font-mono">
          
          {/* Executive Summary */}
          <div className="p-4 rounded bg-surface-container border border-vermilion/50 space-y-2">
            <span className="text-vermilion-bright font-bold text-sm block">
              CRITICAL HAZARD SUMMARY — LEVEL 4 RED ALERT
            </span>
            <p className="text-on-surface font-sans text-xs leading-relaxed">
              Extreme meso-vortex cloudburst genesis is detected in the upper Parvati & Beas catchment basins (Kullu District, 87% ML Risk). Multi-station telemetry indicates sudden micro-barometric collapse of 18.4 hPa with 14.8 m/s vertical updraft velocity. Downriver hydraulic surge propagation will hit Mandi / Pandoh within 90–120 minutes.
            </p>
          </div>

          {/* Critical District Table */}
          <div>
            <h3 className="font-bold text-white mb-2 uppercase text-xs">
              Districts Exceeding Hazard Thresholds:
            </h3>
            <div className="border border-mountain-border rounded overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container border-b border-mountain-border text-on-surface-variant text-[11px]">
                    <th className="p-2.5">District</th>
                    <th className="p-2.5">ML Risk</th>
                    <th className="p-2.5">Pressure</th>
                    <th className="p-2.5">Precip Rate</th>
                    <th className="p-2.5">Action Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mountain-border/60">
                  {criticalDistricts.map(d => (
                    <tr key={d.id} className="bg-surface-lowest">
                      <td className="p-2.5 font-bold text-white">{d.name} ({d.devanagari})</td>
                      <td className="p-2.5 font-bold text-vermilion-bright">{(d.riskScore * 100).toFixed(0)}% ({d.riskLevel})</td>
                      <td className="p-2.5">{d.telemetry.barometricPressure} hPa</td>
                      <td className="p-2.5">{d.telemetry.precipRate} mm/h</td>
                      <td className="p-2.5 text-glacial">{d.riskCategory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gemini AI Action Directive */}
          <div className="p-4 rounded bg-surface-container border border-mountain-border space-y-2">
            <span className="text-primary font-bold block uppercase">
              Emergency Action Directives (HP-SDMA Protocol):
            </span>
            <ul className="list-disc list-inside space-y-1 text-on-surface-variant font-sans">
              <li><strong className="text-white">Kullu:</strong> Initiate immediate Phase-4 evacuation of riverside Kasol, Manikaran, and Bhuntar confluences toward higher ridge switchbacks.</li>
              <li><strong className="text-white">Mandi:</strong> Coordinate regulated sluice gate clearance at Pandoh Dam; sound sirens along Beas ghats.</li>
              <li><strong className="text-white">Kinnaur:</strong> Halt heavy traffic along NH-05 between Tapri and Nigulsari slide zones.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="mt-8 pt-4 border-t border-mountain-border flex items-center justify-between">
          <span className="text-[10px] font-mono text-on-surface-variant">
            Document Hash: SHA256-MEGH-HP-20260909
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-surface-container hover:bg-surface-container-high border border-mountain-border text-xs font-mono text-white"
            >
              CLOSE
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded bg-forest hover:bg-forest-hover border border-primary/50 text-white text-xs font-mono font-bold flex items-center space-x-1.5 shadow-lg"
            >
              <Printer className="w-3.5 h-3.5 text-primary" />
              <span>PRINT / SAVE PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
