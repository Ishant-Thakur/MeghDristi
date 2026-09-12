import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  CircleMarker,
  Polyline,
  Tooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  ShieldAlert,
  Activity,
  Wind,
  Gauge,
  CloudRain,
  Radio,
  Sparkles,
  Mountain,
  Play,
  Pause,
  Layers,
  Send,
  Volume2,
  VolumeX,
  Crosshair,
  Plane,
  Maximize2,
  Minus,
  Terminal,
  Zap,
  ArrowLeft,
  X,
  Compass,
  AlertTriangle,
  History,
  SkipForward,
  SkipBack,
  RotateCcw,
  FileText,
  Database,
  Flame,
  CheckCircle2,
  Info
} from 'lucide-react';
import { soundManager } from '../utils/audioAlert';
import { getDistricts } from '../services/api';
import { HP_DISTRICTS_DATA } from '../data/hpDistricts';
import { POSITIVE_TRAINING_EVENTS } from '../data/trainingEvents';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Map Viewport Controller
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.invalidateSize();
      if (center && Array.isArray(center) && center.length === 2) {
        map.flyTo(center, zoom, { duration: 1.2 });
      }
    }
  }, [center, zoom, map]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (map) map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

// District Geospatial & Physics Metadata Registry
const DISTRICT_GEO_METADATA = {
  kullu: {
    landmark: 'Jalori Pass & Solang Crest (3,160m)',
    highway: 'NH-03 (Manali-Leh Highway)',
    catchment: 'Solang & Upper Beas Basin',
    genesisZone: 'Solang Nullah & Kasol Ridge',
    confluence: 'Beas & Parvati Confluence',
    area: '412 km²',
    avgSlope: '38.4°',
    chokePoint: 'Palchan Bridge (km 22.4)'
  },
  mandi: {
    landmark: 'Kamrunag Peak & Pandoh Gorge (3,334m)',
    highway: 'NH-21 (Chandigarh-Manali Highway)',
    catchment: 'Pandoh & Uhl Gorge Catchment',
    genesisZone: 'Uhl Valley Choke',
    confluence: 'Pandoh Dam Reservoir',
    area: '390 km²',
    avgSlope: '36.8°',
    chokePoint: 'Aut Tunnel Entrance (885m)'
  },
  shimla: {
    landmark: 'Jakhoo Crest & Kufri Ridge (2,455m)',
    highway: 'NH-05 (Hindustan-Tibet Road)',
    catchment: 'Giri & Ashwani Khad Basin',
    genesisZone: 'Jakhoo & Kufri Ridge',
    confluence: 'Giri River Confluence',
    area: '340 km²',
    avgSlope: '31.5°',
    chokePoint: 'Shoghi-Dhalli Bypass'
  },
  solan: {
    landmark: 'Karol Tibba Ridge (2,240m)',
    highway: 'NH-05 (Kalka-Shimla Expressway)',
    catchment: 'Giri & Gambhar Catchment',
    genesisZone: 'Barog Ridge & Kasauli Crest',
    confluence: 'Giri & Gambhar Confluence',
    area: '290 km²',
    avgSlope: '29.2°',
    chokePoint: 'Kumarhatti Junction'
  },
  kinnaur: {
    landmark: 'Kinner Kailash Pass (6,050m)',
    highway: 'NH-05 (Karcham-Wangtoo Corridor)',
    catchment: 'Baspa & Karcham Gorge',
    genesisZone: 'Sangla Ridge Crest',
    confluence: 'Satluj Hydro Confluence',
    area: '560 km²',
    avgSlope: '42.1°',
    chokePoint: 'Nigulsari Rockfall Sentry'
  },
  chamba: {
    landmark: 'Sach Pass Crest (4,414m)',
    highway: 'NH-154A (Chamba-Pathankot Highway)',
    catchment: 'Ravi & Baira Catchment',
    genesisZone: 'Pir Panjal Ridge Crest',
    confluence: 'Chamera Reservoir Inflow',
    area: '480 km²',
    avgSlope: '39.8°',
    chokePoint: 'Bharmour Riverside Choke'
  },
  sirmaur: {
    landmark: 'Churdhar Peak (3,647m)',
    highway: 'NH-07 / NH-707 (Paonta Corridor)',
    catchment: 'Giri & Tons River Basin',
    genesisZone: 'Churdhar Sanctuary Ridge',
    confluence: 'Giri-Yamuna Confluence',
    area: '330 km²',
    avgSlope: '30.4°',
    chokePoint: 'Renuka Ji River Flats'
  },
  bilaspur: {
    landmark: 'Bandla Ridge & Govind Sagar (1,375m)',
    highway: 'NH-205 (Kiratpur-Manali Highway)',
    catchment: 'Govind Sagar Reservoir Basin',
    genesisZone: 'Swarghat & Tiun Ridge',
    confluence: 'Bhakra Reservoir Inflow',
    area: '310 km²',
    avgSlope: '24.6°',
    chokePoint: 'Swarghat Ghat Section'
  },
  kangra: {
    landmark: 'Triund Ridge & Dhauladhar (2,850m)',
    highway: 'NH-154 (Pathankot-Mandi)',
    catchment: 'Dhauladhar & Banganga Basin',
    genesisZone: 'Dhauladhar Snowline',
    confluence: 'Pong Dam Reservoir',
    area: '520 km²',
    avgSlope: '37.2°',
    chokePoint: 'Gaggal River Nullah'
  },
  'lahaul-spiti': {
    landmark: 'Kunzum Pass & Rohtang North (4,551m)',
    highway: 'NH-03 / NH-505 (Atal Tunnel Corridor)',
    catchment: 'Chandra-Bhaga & Spiti Basin',
    genesisZone: 'Rohtang North Saddle',
    confluence: 'Chenab River Gorge',
    area: '780 km²',
    avgSlope: '41.0°',
    chokePoint: 'Koksar River Bypass'
  }
};

const MAP_LAYERS = {
  '3d_mesh': {
    name: '3D Elevation Mesh',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri World Imagery & 3D Topographic Mesh'
  },
  'dbz_radar': {
    name: 'dBZ Radar Echo',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Doppler Radar Network & Satellite Base'
  },
  'runoff_vel': {
    name: 'Runoff Velocity (m/s)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Hydro-WRF Streamlines & Inflow'
  },
  'soil_shear': {
    name: 'Soil Shear Stress',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'OpenTopoMap / Topographic Relief'
  }
};

export default function DigitalTwinDashboard({
  onReturnToLanding,
  soundEnabled = false,
  setSoundEnabled
}) {
  const [liveDistricts, setLiveDistricts] = useState(HP_DISTRICTS_DATA);
  const [selectedDistrictId, setSelectedDistrictId] = useState('kullu');
  const [viewMode, setViewMode] = useState('3d_mesh');
  const [isHudMinimized, setIsHudMinimized] = useState(false);
  
  // Historical Training Simulation Mode State
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('E01');
  const [simulationStepIndex, setSimulationStepIndex] = useState(3); // Default to T-00h Genesis
  const [isSimPlaying, setIsSimPlaying] = useState(false);
  const [showEventInspectorModal, setShowEventInspectorModal] = useState(false);
  const [trainingFilterDistrict, setTrainingFilterDistrict] = useState('all');

  const [layers, setLayers] = useState({
    meshContours: true,
    dopplerDbz: true,
    windVectors: true,
    hydroDischarge: true,
    landslideAlerts: true
  });

  // Load live district predictions on mount and poll
  useEffect(() => {
    let isMounted = true;
    async function fetchLive() {
      try {
        const data = await getDistricts();
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setLiveDistricts(data);
        }
      } catch (err) {
        // Fallback silently to static data
      }
    }
    fetchLive();
    const interval = setInterval(fetchLive, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Resolve current active training event and snapshot
  const currentTrainingEvent = useMemo(() => {
    return POSITIVE_TRAINING_EVENTS.find(e => e.id === selectedEventId) || POSITIVE_TRAINING_EVENTS[0];
  }, [selectedEventId]);

  const currentSnapshot = useMemo(() => {
    return currentTrainingEvent.snapshots[simulationStepIndex] || currentTrainingEvent.snapshots[0];
  }, [currentTrainingEvent, simulationStepIndex]);

  // Active district resolution (either selected or derived from simulation)
  const activeDistrict = useMemo(() => {
    if (isSimulationMode) {
      const found = liveDistricts.find(d => d.id === currentTrainingEvent.districtId);
      return found || liveDistricts[0] || HP_DISTRICTS_DATA[0];
    }
    const found = liveDistricts.find(d => d.id === selectedDistrictId);
    return found || liveDistricts[0] || HP_DISTRICTS_DATA[0];
  }, [liveDistricts, selectedDistrictId, isSimulationMode, currentTrainingEvent]);

  // Geo metadata for the active district / simulation
  const activeGeo = useMemo(() => {
    return DISTRICT_GEO_METADATA[activeDistrict.id] || {
      landmark: `${activeDistrict.name} Topographic Benchmark (${activeDistrict.elevationM || 2200}m)`,
      highway: `NH Corridor (${activeDistrict.name})`,
      catchment: `${activeDistrict.majorCatchments?.[0] || activeDistrict.name + ' Basin'}`,
      genesisZone: `${activeDistrict.name} Upper Ridge`,
      confluence: `${activeDistrict.name} Valley Floor`,
      area: '380 km²',
      avgSlope: '34.0°',
      chokePoint: `${activeDistrict.name} Highway Choke Point`
    };
  }, [activeDistrict]);

  // Effective map center & coordinates
  const activeMapCenter = useMemo(() => {
    if (isSimulationMode && currentTrainingEvent.coords) {
      return currentTrainingEvent.coords;
    }
    return activeDistrict.center || [31.9579, 77.1095];
  }, [isSimulationMode, currentTrainingEvent, activeDistrict]);

  // Effective risk score and level
  const effectiveRiskScore = isSimulationMode 
    ? currentSnapshot.riskScore 
    : (activeDistrict.riskScore ?? 0.35);

  const effectiveRiskLevel = isSimulationMode 
    ? currentSnapshot.riskLevel 
    : (activeDistrict.riskLevel || 'MODERATE');

  const isCritical = effectiveRiskScore >= 0.75 || effectiveRiskLevel === 'CRITICAL';
  const isHigh = (effectiveRiskScore >= 0.45 && !isCritical) || effectiveRiskLevel === 'HIGH';
  const riskPct = Math.round(effectiveRiskScore * 100);
  const liveProbText = `${riskPct}% PROBABILITY`;

  // Generate dynamic in-situ AWS nodes for the active district / training simulation
  const dynamicNodes = useMemo(() => {
    const center = activeMapCenter;
    const baseElev = isSimulationMode ? currentTrainingEvent.elevationM : (activeDistrict.elevationM || 2200);
    const precipBase = isSimulationMode 
      ? currentSnapshot.precipRateMax 
      : (activeDistrict.telemetry?.precipRate ?? (effectiveRiskScore * 70 + 5));
    const gustBase = isSimulationMode 
      ? currentSnapshot.windGustKmh 
      : (activeDistrict.telemetry?.windGust ?? (effectiveRiskScore * 60 + 20));
    const humBase = isSimulationMode 
      ? currentSnapshot.humidityMax 
      : (activeDistrict.telemetry?.humidity ?? (effectiveRiskScore * 40 + 55));
    const tempBase = Math.max(8, 26 - Math.round(baseElev / 180));
    const baroDropVal = isSimulationMode 
      ? Math.abs(currentSnapshot.pressureDrop6h).toFixed(2) 
      : (effectiveRiskScore * 4.2 + 0.6).toFixed(1);

    return [
      {
        id: `AWS-01-${activeDistrict.code || 'HP'}`,
        name: `AWS-01 ${isSimulationMode ? currentTrainingEvent.title.split(' ')[0] : activeDistrict.name} Crest Observatory`,
        badge: isCritical ? 'FLASH WARNING' : isHigh ? 'ELEVATED' : 'STABLE',
        badgeType: isCritical ? 'critical' : isHigh ? 'high' : 'cyan',
        coords: [center[0] + 0.038, center[1] + 0.032],
        elevText: `${Math.round(baseElev * 1.18)}m • High-Altitude Crest Array`,
        m1: 'Precip Rate',
        v1: `${(precipBase * 1.15).toFixed(1)} mm/h`,
        m2: 'CAPE Tensor',
        v2: `${Math.round(effectiveRiskScore * 2600 + 450)} J/kg`,
        m3: 'Baro Drop',
        v3: `-${baroDropVal} hPa/6h`
      },
      {
        id: `AWS-02-${activeDistrict.code || 'HP'}`,
        name: `AWS-02 ${isSimulationMode ? currentTrainingEvent.catchment : activeGeo.catchment} Sentry`,
        badge: `${(precipBase * 0.85).toFixed(1)} mm/h`,
        badgeType: 'cyan',
        coords: [center[0] + 0.012, center[1] - 0.038],
        elevText: `${Math.round(baseElev * 0.88)}m • Orographic Updraft Node`,
        m1: 'PWV',
        v1: `${Math.round(humBase * 0.48 + 8)}mm`,
        m2: 'Gust',
        v2: `${Math.round(gustBase)}km/h`,
        m3: 'RH',
        v3: `${Math.round(humBase)}%`
      },
      {
        id: `AWS-03-${activeDistrict.code || 'HP'}`,
        name: `AWS-03 ${activeDistrict.majorCatchments?.[0] || activeDistrict.name + ' Basin'} Gauge`,
        badge: 'ACTIVE',
        badgeType: 'cyan',
        coords: [center[0] - 0.028, center[1] + 0.022],
        elevText: `${Math.round(baseElev * 0.58)}m • River Hydrology Gauge`,
        m1: 'Soil Sat',
        v1: `${Math.min(99, Math.round(effectiveRiskScore * 45 + 50))}%`,
        m2: 'Temp',
        v2: `${tempBase.toFixed(1)}°C`,
        m3: 'Discharge',
        v3: `${Math.round(effectiveRiskScore * 380 + 110)} m³/s`
      },
      {
        id: `AWS-04-${activeDistrict.code || 'HP'}`,
        name: `AWS-04 ${activeGeo.chokePoint || activeDistrict.headquarters}`,
        badge: 'ONLINE',
        badgeType: 'cyan',
        coords: [center[0] - 0.042, center[1] - 0.024],
        elevText: `${Math.round(baseElev * 0.38)}m • Highway / Sluice Inflow`,
        m1: 'Silt Load',
        v1: `${Math.round(effectiveRiskScore * 2800 + 700)} ppm`,
        m2: 'Turbine',
        v2: isCritical ? 'Emergency Trip' : isHigh ? 'Caution' : 'Nominal',
        m3: 'Gate',
        v3: isCritical ? 'Level 4 Sluice' : isHigh ? 'Level 2' : 'Level 1'
      }
    ];
  }, [activeDistrict, activeGeo, activeMapCenter, isSimulationMode, currentTrainingEvent, currentSnapshot, effectiveRiskScore, isCritical, isHigh]);

  // Dynamic Operational Directives based on live risk / training simulation
  const dynamicDirectives = useMemo(() => {
    const risk = effectiveRiskScore;
    const isCrit = risk >= 0.75;
    const isHg = risk >= 0.45;
    const insight = activeDistrict.geminiInsight || {};

    if (isSimulationMode) {
      return [
        {
          icon: isCrit ? '🚫' : isHg ? '⚠️' : '🟢',
          title: `[TRAINING REPLAY #${currentTrainingEvent.eventId}] ${activeGeo.highway}:`,
          desc: isCrit
            ? `Historical Ground Truth (label=1): Catastrophic debris flow triggered. Traffic blocked along ${activeGeo.chokePoint}.`
            : isHg
            ? `Pre-genesis Phase (T-${currentSnapshot.leadHours}h): Barometric gradient dropping; highway sentries reporting rockfall alerts.`
            : `Initial Phase (T-${currentSnapshot.leadHours}h): Moisture advection entering valley floor under nominal protocol.`
        },
        {
          icon: isCrit ? '🌊' : isHg ? '⚡' : '💧',
          title: `${currentTrainingEvent.catchment} Dam & River Basin:`,
          desc: isCrit
            ? `Peak hydraulic wave recorded at ${currentTrainingEvent.peakSurge} with inflow surge reaching ${Math.round(risk * 480 + 200)} m³/s.`
            : `Catchment saturation at ${Math.round(currentSnapshot.humidityMax)}%; reservoir sluice sluicing active.`
        },
        {
          icon: isCrit ? '🛡️' : isHg ? '🚨' : '📡',
          title: 'Meteorological Ground Truth & AI Benchmark:',
          desc: currentSnapshot.notes
        }
      ];
    }

    return [
      {
        icon: isCrit ? '🚫' : isHg ? '⚠️' : '🟢',
        title: `${activeGeo.highway} Transit Protocol:`,
        desc: isCrit
          ? `Halt all heavy commercial & tourist transit along ${activeGeo.chokePoint} immediately due to active debris flow hazard.`
          : isHg
          ? `Enforce pilot vehicle convoy escort along ${activeGeo.highway}. Restrict night transit near vulnerable scree slopes.`
          : `Clear transit operating under green protocol along ${activeGeo.highway}. Routine culvert clearance active.`
      },
      {
        icon: isCrit ? '🌊' : isHg ? '⚡' : '💧',
        title: `${activeGeo.catchment} Sluice Gate Control:`,
        desc: isCrit
          ? `Trigger urgent pre-discharge of ${Math.round(risk * 480 + 150)} m³/s to buffer incoming flood crest.`
          : isHg
          ? `Initiate regulated spillway release at ${Math.round(risk * 320 + 80)} m³/s and activate desilting flush cycles.`
          : `Maintain standard hydro-power turbine throughput; baseline inflow nominal.`
      },
      {
        icon: isCrit ? '🛡️' : isHg ? '🚨' : '📡',
        title: 'Emergency Response & Early Warning Advisory:',
        desc: insight.recommendedAction || (
          isCrit
            ? `Sound siren grid in ${activeDistrict.name} riverside settlements and deploy SDRF swift-water rescue craft to low-lying flats.`
            : isHg
            ? `Alert district disaster management cells. Deploy quick-response mobile teams to monitor vulnerable water crossings.`
            : `Maintain automated IoT sentinel monitoring across all ${activeDistrict.name} high-altitude nodes.`
        )
      }
    ];
  }, [effectiveRiskScore, activeDistrict, activeGeo, isSimulationMode, currentTrainingEvent, currentSnapshot]);

  // Real-time clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulation auto-play timer
  useEffect(() => {
    let timer = null;
    if (isSimPlaying && isSimulationMode) {
      timer = setInterval(() => {
        setSimulationStepIndex(prev => {
          if (prev >= 3) {
            setIsSimPlaying(false);
            return 3;
          }
          if (soundManager) soundManager.playChime(520 + prev * 80, 780 + prev * 80, 0.1);
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isSimPlaying, isSimulationMode]);

  // Trigger Gemini terminal output when simulation event or step changes
  useEffect(() => {
    if (isSimulationMode) {
      const step = currentSnapshot;
      const event = currentTrainingEvent;
      setTerminalLogs(prev => [
        ...prev,
        {
          type: 'system',
          text: `[SIMULATION #${event.eventId}] ${event.title} • ${step.timeLabel} (${event.district} | ${event.elevationM}m ASL)`
        },
        {
          type: 'analysis',
          text: `METEOROLOGY: ${step.geminiAnalysis}\nPHYSICS: Baro Drop = ${step.pressureDrop6h} hPa/6h | Humidity Spike = +${step.humiditySpike6h}% | Precip Rate = ${step.precipRateMax} mm/h | Wind Gust = ${step.windGustKmh} km/h | ML Risk = ${Math.round(step.riskScore * 100)}% (${step.riskLevel}).`
        }
      ]);
    }
  }, [isSimulationMode, selectedEventId, simulationStepIndex]);

  // Simulation states
  const [isSimulatingBreach, setIsSimulatingBreach] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [flightMode, setFlightMode] = useState(false);

  // Gemini Physics Terminal logs
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'system', text: `SYSTEM: MeghDrishti Neural-WRF Core connected to active telemetry matrix.` },
    { type: 'query', text: `QUERY: Compute orographic moisture convergence vector for ${activeGeo.catchment}.` },
    { type: 'analysis', text: `ANALYSIS: Low-level jet intersecting ${activeDistrict.name} ${activeGeo.avgSlope} slopes produces forced vertical velocity w = +${(effectiveRiskScore * 8 + 1.2).toFixed(1)} m/s.` }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalScrollRef = useRef(null);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const handleSendTerminal = (promptText) => {
    const query = promptText || terminalInput;
    if (!query.trim()) return;

    const newLogs = [
      ...terminalLogs,
      { type: 'query', text: `QUERY: ${query}` }
    ];
    setTerminalLogs(newLogs);
    setTerminalInput('');

    setTimeout(() => {
      let response = '';
      const qLower = query.toLowerCase();
      if (qLower.includes('training') || qLower.includes('dataset') || qLower.includes('benchmark') || qLower.includes('e0') || qLower.includes('ev0')) {
        response = `ANALYSIS [TRAINING GROUND TRUTH]: Event #${currentTrainingEvent.eventId} recorded in ${currentTrainingEvent.district} (Month ${currentTrainingEvent.monthName}, Day ${currentTrainingEvent.dayOfYear}). Multi-timestep feature matrix shows rapid adiabatic collapse from T-9h to T-0h with peak rainfall rate ${currentTrainingEvent.peakPrecipRate} mm/h. Model correctly flags positive cloudburst genesis (label=1).`;
      } else if (qLower.includes('feature') || qLower.includes('shap') || qLower.includes('weight')) {
        response = `ANALYSIS [ML FEATURE IMPORTANCE]: Top cloudburst predictors: 1) pressure_drop_6h (weight: 0.31), 2) humidity_spike_6h (weight: 0.28), 3) humidity_pressure_interaction (weight: 0.19), 4) precip_acceleration (weight: 0.14), 5) elevation_m (weight: 0.08).`;
      } else if (qLower.includes('rohtang') || qLower.includes('funneling') || qLower.includes('updraft')) {
        response = `ANALYSIS: ${activeGeo.landmark} produces severe orographic Venturi acceleration. Low-level moist airflow accelerates rapidly, forcing adiabatic cooling and convective cloud top development.`;
      } else if (qLower.includes('debris') || qLower.includes('highway') || qLower.includes('nh-')) {
        response = `ANALYSIS: ${activeGeo.highway} debris runout simulation at ${activeGeo.chokePoint} indicates estimated sediment yield of ${Math.round(effectiveRiskScore * 22000 + 4000)} m³ with high pore pressure.`;
      } else {
        response = `ANALYSIS: Neural-WRF micro-physics computed for ${activeDistrict.name}. Risk probability: ${riskPct}%. Orographic moisture divergence threshold evaluated.`;
      }

      setTerminalLogs(prev => [
        ...prev,
        { type: 'analysis', text: response }
      ]);
    }, 600);
  };

  const handleSimulateBreach = () => {
    setIsSimulatingBreach(true);
    if (soundManager) {
      soundManager.playChime(440, 880, 0.2);
    }
    setTerminalLogs(prev => [
      ...prev,
      { type: 'system', text: `HYDRAULIC SURGE SIMULATION: ${activeGeo.catchment} upstream breach modeled with +${(effectiveRiskScore * 3.2 + 0.8).toFixed(2)}m surge front.` }
    ]);
    setTimeout(() => setIsSimulatingBreach(false), 6000);
  };

  const handleSelectDistrict = (district) => {
    setSelectedDistrictId(district.id);
    if (soundManager) {
      soundManager.playChime(520, 659.25, 0.08);
    }
    setTerminalLogs(prev => [
      ...prev,
      { type: 'system', text: `TELEMETRY HANDOFF: Reticle targeted to sector [${district.code || 'HP'}] ${district.name}. Real-time AWS telemetry synchronized.` }
    ]);
  };

  const handleSelectTrainingEvent = (event) => {
    setSelectedEventId(event.id);
    setSimulationStepIndex(3); // Start on genesis or T-00h
    setIsSimPlaying(false);
    if (soundManager) {
      soundManager.playChime(659, 880, 0.12);
    }
  };

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredTrainingEvents = useMemo(() => {
    if (trainingFilterDistrict === 'all') return POSITIVE_TRAINING_EVENTS;
    return POSITIVE_TRAINING_EVENTS.filter(e => e.districtId === trainingFilterDistrict);
  }, [trainingFilterDistrict]);

  return (
    <div className="min-h-screen bg-[#08100f] text-[#dce4e2] font-mono select-none flex flex-col antialiased overflow-x-hidden">
      
      {/* 1. TOP HEADER */}
      <header className="w-full bg-[#08100f] border-b border-[#263238] px-4 py-2 flex items-center justify-between z-40 text-xs shrink-0">
        
        {/* Left: Brand + Active District Live Context */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold font-display tracking-tight text-base sm:text-lg flex items-center space-x-1.5">
              <span>MEGHDRISHTI</span>
            </span>
            <span className="text-[11px] text-primary px-1.5 py-0.2 rounded bg-forest/80 border border-primary/30 font-devanagari">
              मेघदृष्टि
            </span>
            <span className="text-[#78b7c9]/80 font-mono text-[11px]">// v2.4 Live Twin</span>
          </div>

          <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded bg-[#151d1c] border border-primary/30 text-[11px]">
            {isSimulationMode ? (
              <>
                <Flame className="w-3.5 h-3.5 text-vermilion-bright animate-pulse" />
                <span className="text-vermilion-bright font-bold">TRAINING REPLAY:</span>
                <span className="text-white font-semibold">[{currentTrainingEvent.eventId}] {currentTrainingEvent.title.split(' ')[0]} ({currentSnapshot.timeLabel.split(' ')[0]})</span>
              </>
            ) : (
              <>
                <CloudRain className="w-3.5 h-3.5 text-glacial" />
                <span className="text-white font-medium">{activeDistrict.name} ({activeGeo.catchment}):</span>
                <span className="text-glacial font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-glacial animate-ping" />
                  <span>Live ML Telemetry</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center Mode Switcher Tabs: Live vs Training Replays */}
        <div className="flex items-center space-x-2 bg-[#151d1c] p-1 rounded border border-[#263238] text-[11px]">
          <button 
            onClick={() => {
              setIsSimulationMode(false);
              setIsSimPlaying(false);
            }}
            className={`px-3 py-1 rounded font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              !isSimulationMode 
                ? 'bg-[#173b32] text-primary border border-primary/40 shadow-md' 
                : 'text-[#8b9995] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>LIVE DIGITAL TWIN</span>
          </button>

          <button 
            onClick={() => {
              setIsSimulationMode(true);
              setSimulationStepIndex(3);
              if (soundManager) soundManager.playChime(659, 880, 0.12);
            }}
            className={`px-3 py-1 rounded font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              isSimulationMode 
                ? 'bg-vermilion text-white shadow-lg shadow-vermilion/50 border border-vermilion-bright animate-pulse' 
                : 'text-vermilion-bright hover:text-white hover:bg-[#232c2a]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>PAST CLOUDBURST REPLAY ({POSITIVE_TRAINING_EVENTS.length} EVENTS)</span>
          </button>
        </div>

        {/* Right Utilities */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded bg-[#151d1c] border border-[#263238] text-[11px]">
            <span className="text-[#8b9995]">Mode:</span>
            <span className={`font-bold ${isSimulationMode ? 'text-vermilion-bright' : 'text-white'}`}>
              {isSimulationMode ? 'Training Dataset Replay' : 'Live Sensor Grid'}
            </span>
            <span className="text-[#263238]">|</span>
            <span className="text-glacial font-mono font-semibold">{currentTime || '12:00:00 IST'}</span>
          </div>

          <button 
            onClick={() => setShowEventInspectorModal(true)}
            title="Inspect Training Event Ground Truth & ML Features"
            className="flex items-center space-x-1 px-2 py-1 rounded bg-[#151d1c] border border-primary/40 hover:bg-[#232c2a] text-primary hover:text-white transition-all cursor-pointer text-[11px]"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dataset & ML Features</span>
          </button>

          <button 
            onClick={() => {
              if (setSoundEnabled) {
                setSoundEnabled(!soundEnabled);
                soundManager.toggleSound(!soundEnabled);
              }
            }}
            title={soundEnabled ? "Mute Radar Audio" : "Unmute Radar Audio"}
            className="p-1.5 rounded bg-[#151d1c] border border-[#263238] hover:border-primary/50 text-[#8b9995] hover:text-white transition-all cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-primary" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {onReturnToLanding && (
            <button
              onClick={onReturnToLanding}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-[#232c2a] hover:bg-[#2e3635] border border-glacial/30 text-glacial hover:text-white text-[11px] transition-all cursor-pointer"
              title="Return to Story Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Landing</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. DYNAMIC BAR: LIVE HIMALAYAN SECTORS OR HISTORICAL TRAINING EVENTS SELECTOR */}
      <div className="w-full bg-[#0d1514] border-b border-[#263238] px-4 py-1.5 flex items-center space-x-3 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
        
        {isSimulationMode ? (
          <>
            <div className="flex items-center space-x-1.5 text-vermilion-bright uppercase font-bold shrink-0">
              <Flame className="w-3.5 h-3.5" />
              <span>TRAINING CLOUDBURST EVENTS:</span>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0 pr-2 border-r border-[#263238]">
              {['all', 'kullu', 'mandi', 'shimla', 'kinnaur', 'kangra', 'chamba', 'bilaspur', 'solan'].map((distKey) => (
                <button
                  key={distKey}
                  onClick={() => setTrainingFilterDistrict(distKey)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                    trainingFilterDistrict === distKey 
                      ? 'bg-vermilion text-white' 
                      : 'bg-[#151d1c] text-[#8b9995] hover:text-white'
                  }`}
                >
                  {distKey}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {filteredTrainingEvents.map((evt) => {
                const isActive = currentTrainingEvent.id === evt.id;
                return (
                  <button
                    key={evt.id}
                    onClick={() => handleSelectTrainingEvent(evt)}
                    className={`px-3 py-1 rounded transition-all flex items-center space-x-1.5 font-medium whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-vermilion border border-vermilion-bright text-white shadow-lg shadow-vermilion/50 font-bold'
                        : 'bg-[#151d1c] border border-[#263238] text-[#c1c8c4] hover:text-white hover:border-vermilion/50'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-vermilion-bright animate-ping" />
                    <span>[{evt.eventId}] {evt.district}: {evt.title.split(' ')[1]}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-white font-mono">
                      {evt.elevationM}m • {evt.peakSurge}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-1.5 text-[#8b9995] uppercase font-bold shrink-0">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>HIMALAYAN SECTORS:</span>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {liveDistricts.map((district) => {
                const isActive = activeDistrict.id === district.id;
                const distRiskPct = Math.round((district.riskScore ?? 0.3) * 100);
                const distLevel = (district.riskLevel || 'LOW').toUpperCase();
                const isDistCritical = distLevel === 'CRITICAL' || distRiskPct >= 75;
                const isDistHigh = distLevel === 'HIGH' || distRiskPct >= 45;

                return (
                  <button
                    key={district.id}
                    onClick={() => handleSelectDistrict(district)}
                    className={`px-3 py-1 rounded transition-all flex items-center space-x-1.5 font-medium whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#173b32] border border-primary text-white shadow-md shadow-[#173b32]/50'
                        : 'bg-[#151d1c] border border-[#263238] text-[#c1c8c4] hover:text-white hover:border-[#3c494f]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isDistCritical 
                        ? 'bg-vermilion-bright animate-ping' 
                        : isDistHigh 
                        ? 'bg-saffron' 
                        : 'bg-glacial'
                    }`} />
                    <span>{district.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isDistCritical
                        ? 'bg-vermilion/40 text-vermilion-bright border border-vermilion/50'
                        : isDistHigh
                        ? 'bg-saffron/30 text-saffron'
                        : 'bg-glacial/20 text-glacial'
                    }`}>
                      [{distRiskPct}% {distLevel}]
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 3. 3-COLUMN TACTICAL VIEWPORT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 min-h-0">
        
        {/* LEFT COLUMN: Catchment, AWS Nodes & Physics Layers */}
        <div className="lg:col-span-3 flex flex-col space-y-3 min-h-0 overflow-y-auto pr-0.5">
          
          {/* Topographic & Catchment Card */}
          <div className="bg-[#151d1c] border border-[#263238] rounded p-3 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#263238] pb-1.5">
              <div className="flex items-center space-x-1.5 text-white font-bold text-xs">
                <Mountain className="w-3.5 h-3.5 text-glacial" />
                <span>{isSimulationMode ? currentTrainingEvent.catchment : activeGeo.catchment}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isSimulationMode 
                  ? 'bg-vermilion text-white font-bold border border-vermilion-bright' 
                  : 'bg-[#173b32] border border-primary/30 text-primary'
              }`}>
                {isSimulationMode ? `TRAIN-${currentTrainingEvent.eventId}` : (activeDistrict.code || 'HP-00')}
              </span>
            </div>

            <div className="text-[11px] text-[#8b9995] flex items-center justify-between">
              <span>Elevation Range:</span>
              <span className="text-glacial font-semibold">
                {isSimulationMode 
                  ? `${currentTrainingEvent.elevationM}m ASL (High Strike Datum)` 
                  : `${Math.round((activeDistrict.elevationM || 2200) * 1.25)}m → ${Math.round((activeDistrict.elevationM || 2200) * 0.4)}m ASL`}
              </span>
            </div>

            <div className="relative h-20 w-full bg-[#08100f] border border-[#263238] rounded overflow-hidden p-1">
              <svg className="w-full h-full" viewBox="0 0 300 70" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#78b7c9" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#173b32" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#08100f" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path d="M 0,15 Q 80,18 140,35 T 300,58 L 300,70 L 0,70 Z" fill="url(#elevGradient)" />
                <path d="M 0,15 Q 80,18 140,35 T 300,58" fill="none" stroke="#78b7c9" strokeWidth="2" />
                <circle cx="80" cy="18" r="4" fill={isCritical ? '#ff5449' : isHigh ? '#d69a32' : '#78b7c9'} className="animate-ping" />
                <circle cx="80" cy="18" r="3" fill={isCritical ? '#ff5449' : isHigh ? '#d69a32' : '#78b7c9'} />
                <line x1="80" y1="18" x2="80" y2="65" stroke={isCritical ? '#ff5449' : '#78b7c9'} strokeDasharray="2,2" strokeWidth="1" />
                <text x="10" y="14" fill={isCritical ? '#ff5449' : '#78b7c9'} fontSize="8" fontFamily="monospace" fontWeight="bold">
                  Genesis ({isSimulationMode ? currentTrainingEvent.title.split(' ')[0] : activeGeo.genesisZone})
                </text>
                <text x="170" y="52" fill="#78b7c9" fontSize="8" fontFamily="monospace">
                  {isSimulationMode ? currentTrainingEvent.catchment.split(' ')[0] + ' Confluence' : activeGeo.confluence}
                </text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#8b9995] font-mono border-t border-[#263238]/60 pt-1.5">
              <span>Peak Rain Rate: <strong className="text-vermilion-bright">{isSimulationMode ? `${currentTrainingEvent.peakPrecipRate} mm/h` : `${(activeDistrict.telemetry?.precipRate || 45).toFixed(1)} mm/h`}</strong></span>
              <span>Flash Surge: <strong className="text-glacial">{isSimulationMode ? currentTrainingEvent.peakSurge : '+2.40m'}</strong></span>
            </div>
          </div>

          {/* Dynamic In-situ AWS Telemetry Nodes */}
          <div className="bg-[#151d1c] border border-[#263238] rounded p-3 space-y-2.5 flex-1">
            <div className="flex items-center justify-between border-b border-[#263238] pb-1.5 text-xs">
              <div className="flex items-center space-x-1.5 text-white font-bold">
                <Radio className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px]">{isSimulationMode ? `DATASET TELEMETRY (T-${currentSnapshot.leadHours}h)` : 'IN-SITU AWS TELEMETRY NODES'}</span>
              </div>
              <span className="text-[10px] text-glacial font-semibold font-mono bg-[#173b32] px-1.5 py-0.5 rounded border border-primary/30">
                {isSimulationMode ? `ML LABEL: +1` : '4 / 4 ONLINE'}
              </span>
            </div>

            <div className="space-y-2">
              {dynamicNodes.map((node) => (
                <div 
                  key={node.id} 
                  onClick={() => handleSendTerminal(`Inspect telemetry stream for ${node.name}`)}
                  className="p-2 rounded bg-[#0d1514] border border-[#263238] hover:border-primary/40 transition-all text-xs space-y-1.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        node.badgeType === 'critical' 
                          ? 'bg-vermilion-bright animate-ping' 
                          : node.badgeType === 'high' 
                          ? 'bg-saffron' 
                          : 'bg-glacial'
                      }`} />
                      <span className="font-bold text-white text-[11px]">{node.name}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase font-mono ${
                      node.badgeType === 'critical' 
                        ? 'bg-vermilion text-white animate-pulse' 
                        : node.badgeType === 'high'
                        ? 'bg-saffron/40 text-saffron'
                        : 'bg-[#173b32] text-glacial border border-glacial/30'
                    }`}>
                      {node.badge}
                    </span>
                  </div>

                  <div className="text-[10px] text-[#8b9995] font-mono">
                    {node.elevText}
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#263238]/60 text-[10px] font-mono">
                    <div>
                      <span className="text-[#8b9995] block text-[9px]">{node.m1}</span>
                      <span className={`font-bold ${node.badgeType === 'critical' ? 'text-vermilion-bright' : 'text-white'}`}>{node.v1}</span>
                    </div>
                    <div>
                      <span className="text-[#8b9995] block text-[9px]">{node.m2}</span>
                      <span className="font-bold text-white">{node.v2}</span>
                    </div>
                    <div>
                      <span className="text-[#8b9995] block text-[9px]">{node.m3}</span>
                      <span className={`font-bold ${node.v3.includes('-') ? 'text-vermilion-bright' : 'text-white'}`}>{node.v3}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Cockpit Overlays & Physics Layers */}
          <div className="bg-[#151d1c] border border-[#263238] rounded p-3 space-y-2 text-xs">
            <div className="flex items-center space-x-1.5 text-white font-bold border-b border-[#263238] pb-1.5 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>COCKPIT OVERLAYS & PHYSICS LAYERS</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <label className="flex items-center space-x-2 cursor-pointer text-[#c1c8c4] hover:text-white">
                <input 
                  type="checkbox" 
                  checked={layers.meshContours} 
                  onChange={() => toggleLayer('meshContours')}
                  className="rounded border-[#3c494f] bg-[#0d1514] text-primary focus:ring-0" 
                />
                <span className="flex items-center space-x-1.5">
                  <span className="text-glacial">#</span>
                  <span>3D Topographic Mesh & Contours</span>
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-[#c1c8c4] hover:text-white">
                <input 
                  type="checkbox" 
                  checked={layers.dopplerDbz} 
                  onChange={() => toggleLayer('dopplerDbz')}
                  className="rounded border-[#3c494f] bg-[#0d1514] text-primary focus:ring-0" 
                />
                <span className="flex items-center space-x-1.5">
                  <span className="text-vermilion-bright">◎</span>
                  <span>Doppler Echo ({isSimulationMode ? currentSnapshot.radarDbz : Math.round((activeDistrict.telemetry?.precipRate ?? 10) * 0.7 + 24)} dBZ Echo)</span>
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-[#c1c8c4] hover:text-white">
                <input 
                  type="checkbox" 
                  checked={layers.windVectors} 
                  onChange={() => toggleLayer('windVectors')}
                  className="rounded border-[#3c494f] bg-[#0d1514] text-primary focus:ring-0" 
                />
                <span className="flex items-center space-x-1.5">
                  <span className="text-glacial">≈</span>
                  <span>Orographic Wind Vectors ({Math.round(isSimulationMode ? currentSnapshot.windGustKmh : (activeDistrict.telemetry?.windGust ?? 45))} km/h)</span>
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-[#c1c8c4] hover:text-white">
                <input 
                  type="checkbox" 
                  checked={layers.hydroDischarge} 
                  onChange={() => toggleLayer('hydroDischarge')}
                  className="rounded border-[#3c494f] bg-[#0d1514] text-primary focus:ring-0" 
                />
                <span className="flex items-center space-x-1.5">
                  <span className="text-primary">∿</span>
                  <span>{isSimulationMode ? currentTrainingEvent.catchment : activeGeo.catchment} Discharge</span>
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-[#c1c8c4] hover:text-white">
                <input 
                  type="checkbox" 
                  checked={layers.landslideAlerts} 
                  onChange={() => toggleLayer('landslideAlerts')}
                  className="rounded border-[#3c494f] bg-[#0d1514] text-primary focus:ring-0" 
                />
                <span className="flex items-center space-x-1.5">
                  <span className="text-saffron">▲</span>
                  <span>{activeGeo.highway} Landslide Sentry</span>
                </span>
              </label>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: 3D Tactical Radar Map with Event Epicenters */}
        <div className="lg:col-span-6 flex flex-col space-y-2 min-h-0">
          
          <div className="flex-1 bg-[#08100f] border border-[#263238] rounded relative overflow-hidden flex flex-col h-[520px] lg:h-full min-h-[520px]">
            
            {/* Mode Switcher Tabs */}
            <div className="bg-[#151d1c] border-b border-[#263238] px-3 py-1.5 flex items-center justify-between z-20 text-[11px] font-mono shrink-0">
              
              <div className="flex items-center space-x-1 overflow-x-auto">
                {Object.entries(MAP_LAYERS).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setViewMode(key)}
                    className={`px-2.5 py-1 rounded transition-all font-semibold whitespace-nowrap cursor-pointer ${
                      viewMode === key 
                        ? 'bg-[#173b32] text-primary border border-primary/40 shadow-sm' 
                        : 'text-[#8b9995] hover:text-white'
                    }`}
                  >
                    {config.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-1.5 text-[#8b9995]">
                <button 
                  onClick={() => handleSendTerminal(`Center crosshairs on active cloudburst genesis vector`)}
                  className="p-1 hover:text-white hover:bg-[#232c2a] rounded cursor-pointer" 
                  title="Target Reticle"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => {
                    setFlightMode(!flightMode);
                    handleSendTerminal(flightMode ? 'Deactivate UAV drone flyover' : `Engage autonomous UAV lidar drone flyover over ${activeDistrict.name}`);
                  }}
                  className={`p-1 rounded cursor-pointer ${flightMode ? 'text-primary bg-[#173b32]' : 'hover:text-white hover:bg-[#232c2a]'}`} 
                  title="Drone Flyover Mode"
                >
                  <Plane className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleSendTerminal(`Toggle high-resolution elevation contour wireframe`)}
                  className="p-1 hover:text-white hover:bg-[#232c2a] rounded cursor-pointer" 
                  title="Layer Mesh"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen().catch(() => {});
                    } else {
                      document.exitFullscreen().catch(() => {});
                    }
                  }}
                  className="p-1 hover:text-white hover:bg-[#232c2a] rounded cursor-pointer" 
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Tactical Map Area with Photorealistic Satellite Layer */}
            <div className="flex-1 relative w-full h-full min-h-[440px] bg-[#08100f] overflow-hidden">
              
              <MapContainer
                center={activeMapCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="w-full h-full absolute inset-0 z-0"
                attributionControl={false}
              >
                <MapController center={activeMapCenter} zoom={12} />

                <TileLayer
                  key={`satellite-${viewMode}`}
                  url={MAP_LAYERS[viewMode].url}
                  attribution={MAP_LAYERS[viewMode].attribution}
                  maxZoom={19}
                />

                {layers.hydroDischarge && (
                  <>
                    <Polyline
                      positions={[
                        [activeMapCenter[0] + 0.05, activeMapCenter[1] + 0.02],
                        [activeMapCenter[0] + 0.02, activeMapCenter[1] + 0.01],
                        [activeMapCenter[0], activeMapCenter[1]],
                        [activeMapCenter[0] - 0.04, activeMapCenter[1] - 0.02]
                      ]}
                      pathOptions={{
                        color: '#78b7c9',
                        weight: 4,
                        opacity: 0.85,
                        dashArray: isSimulatingBreach ? '6,6' : null
                      }}
                    />
                    <Polyline
                      positions={[
                        [activeMapCenter[0] + 0.03, activeMapCenter[1] - 0.04],
                        [activeMapCenter[0] + 0.01, activeMapCenter[1] - 0.01],
                        [activeMapCenter[0], activeMapCenter[1]]
                      ]}
                      pathOptions={{
                        color: '#a8cfc2',
                        weight: 3,
                        opacity: 0.75
                      }}
                    />
                  </>
                )}

                {/* Doppler Radar dBZ Echo Rings */}
                {layers.dopplerDbz && (
                  <>
                    <CircleMarker
                      center={activeMapCenter}
                      radius={isSimulationMode ? (simulationStepIndex + 1) * 22 : 45}
                      pathOptions={{
                        color: isCritical ? '#ff5449' : isHigh ? '#d69a32' : '#78b7c9',
                        fillColor: isCritical ? '#a33a2b' : isHigh ? '#8c6019' : '#173b32',
                        fillOpacity: 0.35,
                        weight: 2,
                        dashArray: '4,4'
                      }}
                    />
                    <CircleMarker
                      center={activeMapCenter}
                      radius={isSimulationMode ? (simulationStepIndex + 1) * 38 : 85}
                      pathOptions={{
                        color: '#d69a32',
                        fillColor: 'transparent',
                        weight: 1,
                        dashArray: '2,4'
                      }}
                    />
                  </>
                )}

                {/* In Simulation Mode: Render All Historical Training Event Epicenter Pins on Map */}
                {isSimulationMode && POSITIVE_TRAINING_EVENTS.map((evt) => {
                  const isSelectedEvt = evt.id === currentTrainingEvent.id;
                  return (
                    <CircleMarker
                      key={`evt-${evt.id}`}
                      center={evt.coords}
                      radius={isSelectedEvt ? 14 : 8}
                      pathOptions={{
                        color: isSelectedEvt ? '#ff5449' : '#d69a32',
                        fillColor: isSelectedEvt ? '#ff5449' : '#173b32',
                        fillOpacity: isSelectedEvt ? 0.95 : 0.8,
                        weight: isSelectedEvt ? 3 : 1.5
                      }}
                      eventHandlers={{
                        click: () => handleSelectTrainingEvent(evt)
                      }}
                    >
                      <Tooltip permanent direction="top" offset={[0, -12]} className="font-mono text-[10px]">
                        <div className="flex flex-col space-y-0.5 text-left min-w-[140px]">
                          <div className="flex items-center space-x-1.5 font-bold">
                            <span className="w-2 h-2 rounded-full bg-vermilion-bright animate-ping" />
                            <span className={`font-bold ${isSelectedEvt ? 'text-vermilion-bright' : 'text-white'}`}>
                              ⚡ [{evt.eventId}] {evt.district}
                            </span>
                            <span className="text-[8px] px-1 py-0.2 rounded bg-vermilion/40 text-white font-mono uppercase">
                              {evt.monthName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-[9px] text-[#c1c8c4] border-t border-[#263238]/60 pt-0.5">
                            <span>Rain: <strong className="text-vermilion-bright">{evt.peakPrecipRate} mm/h</strong></span>
                            <span>•</span>
                            <span>Surge: <strong className="text-white">{evt.peakSurge}</strong></span>
                            <span>•</span>
                            <span className="text-glacial">{evt.elevationM}m</span>
                          </div>
                        </div>
                      </Tooltip>
                    </CircleMarker>
                  );
                })}

                {/* In-situ dynamic AWS nodes rendered on map with rich telemetry info */}
                {dynamicNodes.map((node) => (
                  <CircleMarker
                    key={node.id}
                    center={node.coords}
                    radius={node.badgeType === 'critical' ? 9 : 6}
                    pathOptions={{
                      color: node.badgeType === 'critical' ? '#ff5449' : node.badgeType === 'high' ? '#d69a32' : '#78b7c9',
                      fillColor: node.badgeType === 'critical' ? '#a33a2b' : '#173b32',
                      fillOpacity: 0.95,
                      weight: 2
                    }}
                  >
                    <Tooltip permanent direction="top" offset={[0, -10]} className="font-mono text-[10px]">
                      <div className="flex flex-col space-y-0.5 text-left min-w-[130px]">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            node.badgeType === 'critical' ? 'bg-vermilion-bright animate-ping' : node.badgeType === 'high' ? 'bg-saffron' : 'bg-glacial'
                          }`} />
                          <span className="text-white font-bold">{node.name.split(' ')[0]} {node.name.split(' ')[1]}</span>
                          <span className={`text-[8px] px-1 py-0.2 rounded uppercase font-mono ${
                            node.badgeType === 'critical' 
                              ? 'bg-vermilion text-white font-bold animate-pulse' 
                              : node.badgeType === 'high'
                              ? 'bg-saffron/40 text-saffron'
                              : 'bg-[#173b32] text-glacial'
                          }`}>
                            {node.badge}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[9px] text-[#c1c8c4] border-t border-[#263238]/60 pt-0.5">
                          <span>Rain: <strong className="text-white">{node.v1}</strong></span>
                          <span>•</span>
                          <span>Baro: <strong className={node.v3.includes('-') ? 'text-vermilion-bright' : 'text-glacial'}>{node.v3}</strong></span>
                          <span>•</span>
                          <span className="text-glacial">{node.elevText.split('•')[0].trim()}</span>
                        </div>
                      </div>
                    </Tooltip>
                  </CircleMarker>
                ))}

              </MapContainer>

              {layers.meshContours && (
                <div className="absolute inset-0 pointer-events-none bg-kath-kuni-pattern opacity-30 z-10" />
              )}

              {layers.dopplerDbz && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex items-center justify-center">
                  <div className="w-[600px] h-[600px] rounded-full border border-vermilion/20 relative animate-spin" style={{ animationDuration: '8s' }}>
                    <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-transparent via-vermilion/10 to-vermilion/30 -translate-x-full -translate-y-full origin-bottom-right transform" />
                  </div>
                </div>
              )}

              {/* Dynamic Landmark Badge */}
              <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <div className="px-2.5 py-1 rounded bg-[#0d1514]/90 border border-[#78b7c9]/40 text-[10px] font-mono text-white flex items-center space-x-1.5 shadow-xl">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSimulationMode ? 'bg-vermilion-bright animate-ping' : 'bg-glacial'}`} />
                  <span>{isSimulationMode ? `Ground Truth: ${currentTrainingEvent.title}` : activeGeo.landmark}</span>
                </div>
              </div>

              {/* Dynamic Inversion / Base Elevation Badge */}
              <div className="absolute bottom-16 right-6 z-20 pointer-events-none">
                <div className="px-2.5 py-1 rounded bg-[#0d1514]/90 border border-glacial/40 text-[10px] font-mono text-[#78b7c9] flex items-center space-x-1.5 shadow-xl">
                  <span>≈ Base Inversion Layer ({Math.round((isSimulationMode ? currentTrainingEvent.elevationM : (activeDistrict.elevationM || 2200)) * 0.65)}m)</span>
                </div>
              </div>

              {/* Dynamic Simulation / Telemetry Status Pill */}
              <div className="absolute top-8 left-6 z-20 pointer-events-none">
                <div className={`px-2.5 py-1 rounded border text-[10px] font-mono flex items-center space-x-1.5 shadow-lg ${
                  isCritical 
                    ? 'bg-vermilion/50 border-vermilion text-white font-bold' 
                    : isHigh 
                    ? 'bg-saffron/40 border-saffron/70 text-saffron' 
                    : 'bg-[#173b32]/80 border-glacial/40 text-glacial'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-vermilion-bright animate-ping' : isHigh ? 'bg-saffron' : 'bg-glacial'}`} />
                  <span>
                    {isSimulationMode 
                      ? `[TRAINING SNAPSHOT: ${currentSnapshot.timeLabel}] Rain: ${currentSnapshot.precipRateMax} mm/h` 
                      : (isCritical ? 'Imminent Cloudburst Risk' : isHigh ? 'High Convective Updraft' : 'Standard Monitoring Horizon')}
                  </span>
                </div>
              </div>

              {/* Floating Tactical Alert HUD Card with Minimize Option */}
              {isHudMinimized ? (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 transition-all">
                  <div className="px-3 py-1.5 rounded-lg bg-[#151d1c]/95 border border-primary/50 text-xs font-mono text-white flex items-center space-x-3 shadow-2xl backdrop-blur-md">
                    <span className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-vermilion-bright animate-ping' : isHigh ? 'bg-saffron' : 'bg-glacial'}`} />
                    <span className="font-bold uppercase font-display text-[11px]">
                      {isSimulationMode ? `[${currentTrainingEvent.eventId}] ${currentTrainingEvent.title.split(' ')[0]}` : activeDistrict.name}: {liveProbText} [{effectiveRiskLevel}]
                    </span>
                    <button
                      onClick={() => setIsHudMinimized(false)}
                      className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#173b32] hover:bg-[#1e4e42] text-primary border border-primary/40 font-bold text-[10px] uppercase cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Expand HUD</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[90%] max-w-[440px] transition-all">
                  <div className={`p-4 rounded border backdrop-blur-md transition-all shadow-2xl ${
                    isSimulatingBreach 
                      ? 'bg-[#182422]/95 border-glacial shadow-glacial/50' 
                      : isCritical
                      ? 'bg-[#151d1c]/96 border-vermilion-bright shadow-vermilion/50 ring-1 ring-vermilion/40'
                      : isHigh
                      ? 'bg-[#151d1c]/94 border-saffron/70 shadow-black/80'
                      : 'bg-[#151d1c]/94 border-[#263238] shadow-black/80'
                  }`}>
                    
                    {/* Header with Title + Minimize Button */}
                    <div className="flex items-center justify-between border-b border-[#263238] pb-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-vermilion-bright animate-ping' : isHigh ? 'bg-saffron' : 'bg-glacial'}`} />
                        <span className="font-bold text-xs text-white uppercase tracking-wider font-display">
                          {isSimulationMode 
                            ? `REPLAY #${currentTrainingEvent.eventId}: ${currentTrainingEvent.title}`
                            : (activeDistrict.geminiInsight?.headline || `${effectiveRiskLevel} Cloudburst Alert — ${activeDistrict.name}`)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded text-white font-bold text-[10px] uppercase font-mono shadow ${
                          isCritical ? 'bg-vermilion' : isHigh ? 'bg-saffron' : 'bg-[#173b32] text-glacial'
                        }`}>
                          {liveProbText}
                        </span>
                        
                        <button
                          onClick={() => setIsHudMinimized(true)}
                          className="p-1 rounded text-[#8b9995] hover:text-white hover:bg-[#263238] transition-all cursor-pointer"
                          title="Minimize HUD to view full satellite map"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#dce4e2] leading-relaxed mb-3">
                      {isSimulationMode 
                        ? currentSnapshot.geminiAnalysis
                        : (activeDistrict.geminiInsight?.reasoning || 
                          `Neural-WRF model indicates ${effectiveRiskLevel} cloudburst probability over ${activeGeo.catchment}. In-situ telemetry nodes tracking localized atmospheric gradients.`)}
                    </p>

                    <div className="grid grid-cols-2 gap-2 bg-[#08100f]/80 p-2.5 rounded border border-[#263238] mb-3 text-[10px] font-mono">
                      <div>
                        <span className="text-[#8b9995] block text-[9px]">Timeline Snapshot</span>
                        <strong className="text-white text-[11px]">{isSimulationMode ? currentSnapshot.timeLabel : 'T+00m to T+180m IST'}</strong>
                      </div>
                      <div>
                        <span className="text-[#8b9995] block text-[9px]">Peak Flash Surge</span>
                        <strong className="text-vermilion-bright text-[11px]">
                          {isSimulationMode ? currentTrainingEvent.peakSurge : `+${((activeDistrict.riskScore || 0.3) * 3.2 + 0.5).toFixed(2)}m in 45 min`}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#8b9995] block text-[9px]">Rainfall Intensity</span>
                        <strong className="text-glacial text-[11px]">
                          {isSimulationMode ? `${currentSnapshot.precipRateMax} mm/h` : `${(activeDistrict.telemetry?.precipRate || 40).toFixed(1)} mm/h`}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#8b9995] block text-[9px]">Ground Truth Datum</span>
                        <strong className="text-white text-[11px]">
                          {isSimulationMode ? `Day ${currentTrainingEvent.dayOfYear} • ${currentTrainingEvent.elevationM}m` : activeGeo.highway}
                        </strong>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={handleSimulateBreach}
                        className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded bg-[#173b32] hover:bg-[#1e4e42] border border-primary/50 text-white font-bold text-xs transition-all hover:scale-[1.02] uppercase tracking-wide cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span>{isSimulatingBreach ? 'Surge Active...' : 'Simulate Surge'}</span>
                      </button>

                      <button
                        onClick={() => handleSendTerminal(`Run Neural-WRF Nowcasting synthesis for ${isSimulationMode ? currentTrainingEvent.title : activeDistrict.name}`)}
                        className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded bg-[#1f2928] hover:bg-[#283835] border border-glacial/40 text-glacial hover:text-white font-bold text-xs transition-all hover:scale-[1.02] uppercase tracking-wide cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Physics Run</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Bottom Timeline Scrubber: Multi-Timestep Scrubber for Live or Historical Training Events */}
            <div className="bg-[#151d1c] border-t border-[#263238] px-3 py-2 z-20 space-y-1.5 shrink-0">
              
              {isSimulationMode ? (
                /* Simulation 4-Step Lead Hour Controls (T-9h -> T-6h -> T-3h -> T-0h Genesis) */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsSimPlaying(!isSimPlaying)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-vermilion hover:bg-vermilion-bright text-white font-bold cursor-pointer shadow-md shadow-vermilion/40"
                      >
                        {isSimPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isSimPlaying ? 'PAUSE' : 'PLAY SIMULATION'}</span>
                      </button>
                      
                      <button
                        onClick={() => setSimulationStepIndex(0)}
                        className="p-1 rounded bg-[#0d1514] border border-[#263238] text-[#8b9995] hover:text-white cursor-pointer"
                        title="Reset to T-09h"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-glacial font-semibold pl-1">
                        Snapshot: <strong className="text-white">{currentSnapshot.timeLabel}</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px]">
                      <span className="text-[#8b9995]">Event:</span>
                      <span className="text-vermilion-bright font-bold">[{currentTrainingEvent.eventId}] {currentTrainingEvent.district}</span>
                      <span className="text-[#8b9995]">|</span>
                      <span className="text-white font-bold">Rain: {currentSnapshot.precipRateMax} mm/h</span>
                    </div>
                  </div>

                  {/* 4 Interactive Snapshot Stepper Buttons */}
                  <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
                    {currentTrainingEvent.snapshots.map((snap, sIdx) => {
                      const isSnapActive = simulationStepIndex === sIdx;
                      return (
                        <button
                          key={snap.snapshotId}
                          onClick={() => {
                            setSimulationStepIndex(sIdx);
                            setIsSimPlaying(false);
                            if (soundManager) soundManager.playChime(520 + sIdx * 60, 680 + sIdx * 60, 0.08);
                          }}
                          className={`p-1.5 rounded transition-all flex flex-col items-center justify-center border cursor-pointer ${
                            isSnapActive
                              ? 'bg-vermilion text-white font-bold border-vermilion-bright shadow-lg shadow-vermilion/50 scale-[1.02]'
                              : 'bg-[#0d1514] border-[#263238] text-[#8b9995] hover:text-white hover:border-[#3c494f]'
                          }`}
                        >
                          <span className="uppercase font-bold">{snap.timeLabel.split(' ')[0]}</span>
                          <span className="text-[9px] opacity-80">{snap.riskLevel} • {Math.round(snap.riskScore * 100)}%</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Live Nowcasting Horizon Scrubber */
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-glacial font-semibold">
                      Live Telemetry Stream: <strong className="text-white">Active Grid Synchronization</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-[10px] text-[#8b9995]">
                    <span>T-60m (Observed)</span>
                    <span className="text-white font-bold">T-00m (NOW)</span>
                    <span className="text-primary font-bold">T+30m (AI Nowcast)</span>
                    <span>T+180m (Hydrological Tail)</span>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Threat Index, Directives & Gemini Terminal */}
        <div className="lg:col-span-3 flex flex-col space-y-3 min-h-0 overflow-y-auto pl-0.5">
          
          {/* Regional Threat Index or Training Benchmarks */}
          <div className="bg-[#151d1c] border border-[#263238] rounded p-3 space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#263238] pb-1.5 text-xs">
              <div className="flex items-center space-x-1.5 text-white font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-vermilion-bright" />
                <span className="text-[11px]">
                  {isSimulationMode ? 'TRAINING GROUND TRUTH' : 'REGIONAL THREAT INDEX (6-HR)'}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-semibold ${isSimulationMode ? 'text-vermilion-bright' : 'text-glacial'}`}>
                {isSimulationMode ? 'LABEL=1 POSITIVES' : 'LIVE ML'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {isSimulationMode ? (
                POSITIVE_TRAINING_EVENTS.slice(0, 5).map((evt) => {
                  const isCur = evt.id === currentTrainingEvent.id;
                  return (
                    <div 
                      key={evt.id} 
                      onClick={() => handleSelectTrainingEvent(evt)}
                      className={`space-y-1 cursor-pointer p-1.5 rounded transition-all border ${
                        isCur 
                          ? 'bg-vermilion/20 border-vermilion text-white' 
                          : 'bg-[#0d1514] border-[#263238] text-[#c1c8c4] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold flex items-center space-x-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isCur ? 'bg-vermilion-bright animate-ping' : 'bg-saffron'}`} />
                          <span>[{evt.eventId}] {evt.district}</span>
                        </span>
                        <span className="font-bold text-vermilion-bright">{evt.peakPrecipRate} mm/h</span>
                      </div>
                      <div className="text-[10px] text-[#8b9995] flex justify-between">
                        <span>{evt.monthName} (Day {evt.dayOfYear})</span>
                        <span className="text-glacial">{evt.elevationM}m ASL</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                liveDistricts.slice(0, 5).map((district, idx) => {
                  const scorePct = Math.round((district.riskScore ?? 0.3) * 100);
                  const levelStr = district.riskLevel || 'LOW';
                  const isItemCritical = levelStr === 'CRITICAL' || scorePct >= 75;
                  const isItemHigh = levelStr === 'HIGH' || scorePct >= 45;
                  const colorClass = isItemCritical ? 'bg-vermilion-bright' : isItemHigh ? 'bg-saffron' : 'bg-glacial';
                  const textClass = isItemCritical ? 'text-vermilion-bright' : isItemHigh ? 'text-saffron' : 'text-glacial';

                  return (
                    <div 
                      key={district.id || idx} 
                      onClick={() => handleSelectDistrict(district)}
                      className="space-y-1 cursor-pointer hover:bg-[#0d1514] p-1 rounded transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-medium ${activeDistrict.id === district.id ? 'text-primary font-bold' : 'text-white'}`}>
                          {district.name}
                        </span>
                        <span className={`font-bold ${textClass}`}>{scorePct}% • {levelStr}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#08100f] overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${colorClass}`}
                          style={{ width: `${scorePct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Dynamic Operational Directives */}
          <div className="bg-[#151d1c] border border-[#263238] rounded p-3 space-y-2">
            <div className="flex items-center space-x-1.5 text-white font-bold border-b border-[#263238] pb-1.5 text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-glacial" />
              <span className="text-[11px]">
                {isSimulationMode ? `DISASTER DIRECTIVES (${currentTrainingEvent.district.toUpperCase()})` : `OPERATIONAL DIRECTIVES (${activeDistrict.name.toUpperCase()})`}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {dynamicDirectives.map((dir, idx) => (
                <div key={idx} className="p-2 rounded bg-[#0d1514] border border-[#263238] space-y-0.5 text-[11px]">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <span>{dir.icon}</span>
                    <span>{dir.title}</span>
                  </div>
                  <p className="text-[#c1c8c4] leading-relaxed text-[10px] pl-5">
                    {dir.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini Physics Terminal */}
          <div className="bg-[#08100f] border border-[#263238] rounded p-3 flex-1 flex flex-col space-y-2 min-h-[220px]">
            <div className="flex items-center justify-between border-b border-[#263238] pb-1.5 text-xs">
              <div className="flex items-center space-x-1.5 text-primary font-bold">
                <Sparkles className="w-3.5 h-3.5 text-glacial" />
                <span className="text-[11px]">Gemini Physics Terminal</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#173b32] text-primary border border-primary/30 font-mono">
                {isSimulationMode ? 'ML-TRAIN-AI' : 'HIM-LLM v3'}
              </span>
            </div>

            <div 
              ref={terminalScrollRef}
              className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[10px] leading-relaxed pr-1 max-h-40"
            >
              {terminalLogs.map((log, index) => (
                <div 
                  key={index}
                  className={
                    log.type === 'system' 
                      ? 'text-glacial' 
                      : log.type === 'query' 
                      ? 'text-primary font-semibold' 
                      : 'text-[#dce4e2] bg-[#151d1c]/80 p-1.5 rounded border border-[#263238]/60 whitespace-pre-wrap'
                  }
                >
                  {log.text}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1 pt-1 text-[9px] font-mono">
              {isSimulationMode ? (
                <>
                  <button
                    onClick={() => handleSendTerminal(`Explain why event #${currentTrainingEvent.eventId} triggered positive label`)}
                    className="px-2 py-0.5 rounded bg-[#151d1c] hover:bg-[#232c2a] border border-[#263238] text-glacial hover:text-white transition-all cursor-pointer"
                  >
                    + Why #{currentTrainingEvent.eventId} triggered label=1?
                  </button>
                  <button
                    onClick={() => handleSendTerminal(`Compute feature interaction for ${currentTrainingEvent.district}`)}
                    className="px-2 py-0.5 rounded bg-[#151d1c] hover:bg-[#232c2a] border border-[#263238] text-glacial hover:text-white transition-all cursor-pointer"
                  >
                    + Top ML Feature Interactions
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSendTerminal(`Explain ${activeDistrict.name} orographic funneling`)}
                    className="px-2 py-0.5 rounded bg-[#151d1c] hover:bg-[#232c2a] border border-[#263238] text-glacial hover:text-white transition-all cursor-pointer"
                  >
                    + Explain {activeDistrict.name} funneling
                  </button>
                  <button
                    onClick={() => handleSendTerminal(`Run ${activeGeo.highway} debris model`)}
                    className="px-2 py-0.5 rounded bg-[#151d1c] hover:bg-[#232c2a] border border-[#263238] text-glacial hover:text-white transition-all cursor-pointer"
                  >
                    + Run {activeGeo.highway.split(' ')[0]} debris model
                  </button>
                </>
              )}
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendTerminal();
              }}
              className="flex items-center space-x-1 pt-1"
            >
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder={isSimulationMode ? "Ask Gemini about this cloudburst training event..." : `Ask atmospheric physics engine about ${activeDistrict.name}...`}
                className="flex-1 px-2.5 py-1.5 rounded bg-[#151d1c] border border-[#263238] text-white text-[10px] font-mono focus:outline-none focus:border-primary placeholder-[#8b9995]"
              />
              <button
                type="submit"
                className="p-1.5 rounded bg-[#173b32] hover:bg-[#1e4e42] text-primary border border-primary/40 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* 4. DYNAMIC BOTTOM TELEMETRY METRICS */}
      <div className="w-full bg-[#08100f] border-t border-[#263238] px-4 py-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono shrink-0">
        <div className="flex items-center space-x-3 border-r border-[#263238] pr-2">
          <div className="w-8 h-8 rounded bg-[#151d1c] border border-glacial/30 flex items-center justify-center shrink-0">
            <CloudRain className="w-4 h-4 text-glacial" />
          </div>
          <div>
            <span className="text-[10px] text-[#8b9995] uppercase block">{isSimulationMode ? currentTrainingEvent.catchment.toUpperCase() : activeGeo.catchment.toUpperCase()} DISCHARGE</span>
            <span className="text-white font-bold text-xs">{Math.round(effectiveRiskScore * 420 + 120)} m³/s (+{Math.round(effectiveRiskScore * 250 + 30)}% surge)</span>
            <span className="text-[9px] text-vermilion-bright block">Warning threshold: {Math.round(effectiveRiskScore * 200 + 480)} m³/s</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 border-r border-[#263238] pr-2">
          <div className="w-8 h-8 rounded bg-[#151d1c] border border-vermilion/40 flex items-center justify-center shrink-0">
            <Mountain className="w-4 h-4 text-vermilion-bright" />
          </div>
          <div>
            <span className="text-[10px] text-[#8b9995] uppercase block">SLOPE INSTABILITY INDEX</span>
            <span className="text-vermilion-bright font-bold text-xs">
              {(effectiveRiskScore * 0.75 + 0.18).toFixed(2)} ({isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'ELEVATED'})
            </span>
            <span className="text-[9px] text-[#8b9995] block">Pore pressure on {activeGeo.avgSlope} shear plane</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 border-r border-[#263238] pr-2">
          <div className="w-8 h-8 rounded bg-[#151d1c] border border-primary/30 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-[10px] text-[#8b9995] uppercase block">DOPPLER RADAR RELAY</span>
            <span className="text-white font-bold text-xs">Dual-Pol X-Band ({isSimulationMode ? currentTrainingEvent.district : activeDistrict.name} Relay)</span>
            <span className="text-[9px] text-glacial block">Azimuth 42° • Elevation 3.8°</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div>
            <span className="text-[10px] text-[#8b9995] uppercase block">MoES / IMD Calibration:</span>
            <span className="text-glacial font-bold text-xs">PASSED (10-min tick)</span>
            <span className="text-[9px] text-[#8b9995] block">Autonomous Atmospheric Physics & AI Twin</span>
          </div>
        </div>
      </div>

      {/* 5. FOOTER */}
      <footer className="w-full bg-[#08100f] border-t border-[#263238] px-4 py-2 text-[10px] text-[#8b9995] flex flex-col md:flex-row items-center justify-between font-mono shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold">MEGHDRISHTI</span>
          <span>© 2026 MeghDrishti Geospatial Consortium • Autonomous Atmospheric Physics & AI Twin of India</span>
        </div>

        <div className="flex items-center space-x-3 pt-1 md:pt-0">
          <button onClick={() => handleSendTerminal('Display Mission Directive')} className="hover:text-white transition-colors cursor-pointer">Mission Directive</button>
          <span>•</span>
          <button onClick={() => setShowEventInspectorModal(true)} className="hover:text-white transition-colors cursor-pointer">Ground Truth Training Benchmarks</button>
          <span>•</span>
          <button onClick={() => handleSendTerminal('Open Hydrological Risk API endpoints')} className="hover:text-white transition-colors cursor-pointer">Hydrological Risk API</button>
          <span>•</span>
          <button onClick={() => handleSendTerminal('Check IMD Calibration Logs')} className="hover:text-white transition-colors cursor-pointer">IMD Calibration Logs</button>
        </div>
      </footer>

      {/* 6. Training Event Dataset Inspector Modal */}
      {showEventInspectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="kath-kuni-card p-6 bg-[#151d1c] border border-primary/50 max-w-3xl w-full space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#263238] pb-2">
              <div className="flex items-center space-x-2 text-white font-bold font-display">
                <Database className="w-5 h-5 text-primary" />
                <span>Training Dataset Ground Truth Benchmarks (Label=1 Positive Cloudbursts)</span>
              </div>
              <button 
                onClick={() => setShowEventInspectorModal(false)}
                className="text-[#8b9995] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#c1c8c4] leading-relaxed font-sans">
              MeghDrishti's Random Forest and Neural-WRF models are trained on real Himalayan positive cloudburst events. Select any historical event below to inspect its 4-step lead-time feature progression and simulate on the 3D digital twin map.
            </p>

            <div className="space-y-3">
              {POSITIVE_TRAINING_EVENTS.map((evt) => (
                <div key={evt.id} className="bg-[#08100f] p-3 rounded border border-[#263238] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-vermilion text-white font-bold text-[10px]">
                        [{evt.eventId}]
                      </span>
                      <strong className="text-white text-sm">{evt.title}</strong>
                    </div>
                    <button
                      onClick={() => {
                        handleSelectTrainingEvent(evt);
                        setIsSimulationMode(true);
                        setShowEventInspectorModal(false);
                      }}
                      className="px-3 py-1 rounded bg-[#173b32] hover:bg-[#1e4e42] border border-primary/50 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Simulate on Map ↗
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-[#8b9995] pt-1 border-t border-[#263238]/60">
                    <div>District: <strong className="text-white">{evt.district}</strong></div>
                    <div>Elevation: <strong className="text-white">{evt.elevationM}m ASL</strong></div>
                    <div>Month / Day: <strong className="text-white">{evt.monthName} (Day {evt.dayOfYear})</strong></div>
                    <div>Peak Rainfall: <strong className="text-vermilion-bright">{evt.peakPrecipRate} mm/h</strong></div>
                  </div>

                  {/* 4 Snapshots Grid */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1 text-[9px]">
                    {evt.snapshots.map((snap) => (
                      <div key={snap.snapshotId} className="bg-[#151d1c] p-1.5 rounded border border-[#263238] space-y-0.5">
                        <span className="font-bold text-glacial block">{snap.timeLabel.split(' ')[0]}</span>
                        <div className="text-[#c1c8c4]">Risk: <strong className="text-white">{Math.round(snap.riskScore * 100)}%</strong></div>
                        <div className="text-[#c1c8c4]">Rain: <strong className="text-vermilion-bright">{snap.precipRateMax} mm/h</strong></div>
                        <div className="text-[#c1c8c4]">Baro: <strong className="text-white">-{Math.abs(snap.pressureDrop6h).toFixed(2)} hPa</strong></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#263238]">
              <button
                onClick={() => setShowEventInspectorModal(false)}
                className="px-4 py-1.5 rounded bg-[#232c2a] hover:bg-[#2e3635] text-white text-xs font-mono transition-all cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
