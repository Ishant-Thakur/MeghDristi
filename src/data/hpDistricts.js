// Himachal Pradesh District Telemetry, Geospatial GeoJSON Boundaries & AI Early Warnings

export const HP_DISTRICTS_DATA = [
  {
    id: "kullu",
    name: "Kullu",
    devanagari: "कुल्लू",
    code: "HP-KLU",
    elevationM: 3200,
    headquarters: "Kullu",
    majorCatchments: ["Parvati Valley", "Beas River Basin", "Sainj Valley", "Tirthan Basin"],
    center: [31.9579, 77.1095],
    riskScore: 0.87,
    riskLevel: "CRITICAL",
    riskCategory: "Immediate Warning",
    statusColor: "#a33a2b", // Vermilion
    trend: "+14.2% / hr",
    isTrendingUp: true,
    telemetry: {
      barometricPressure: 982.4, // hPa - sharp sudden drop
      humidity: 96.8, // %
      precipRate: 84.6, // mm/hr
      windGust: 78.2, // km/h
      updraftVelocity: 14.8, // m/s
      surfaceMoistureSaturation: 94.2, // %
      cloudBaseHeightM: 1420,
      radarEchoDbz: 62.4,
      sensorHealth: 98.4,
      activeIoTNtCount: 14,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Extreme Orographic Convective Updraft Detected in Parvati Catchment",
      reasoning: "A severe barometric pressure collapse of 18.4 hPa over the last 90 minutes, coupled with 96.8% relative humidity and a 14.8 m/s vertical updraft velocity at 3,200m elevation, indicates high-probability meso-cyclonic cloudburst genesis in upper Manikaran & Kasol catchment zones.",
      affectedAreas: ["Manikaran Valley", "Kasol", "Bhuntar Confluence", "Malana Stream"],
      recommendedAction: "Trigger immediate Phase-4 evacuation protocol for riverside settlements along Parvati & Beas confluence. Sound siren grid at Bhuntar and halt NH-305 transit.",
      confidence: 94.8,
      evacuationRoute: "Evacuation Corridor B (NH-3 higher contour switchbacks toward Aut Ridge)",
      ndmaProtocolLevel: "RED - Level 4 Immediate Dispatch"
    },
    sensors: [
      { id: "S-KLU-01", name: "Manikaran High-Altitude Node", coords: [32.0270, 77.3486], status: "ACTIVE", battery: "94%", signal: "STRONG", alert: true },
      { id: "S-KLU-02", name: "Kasol Hydrometric Gauge", coords: [32.0100, 77.3150], status: "ACTIVE", battery: "89%", signal: "STRONG", alert: true },
      { id: "S-KLU-03", name: "Bhuntar Beas Confluence Array", coords: [31.8785, 77.1539], status: "ACTIVE", battery: "97%", signal: "OPTIMAL", alert: false },
      { id: "S-KLU-04", name: "Jalori Pass Doppler Relay", coords: [31.5348, 77.3670], status: "ACTIVE", battery: "92%", signal: "OPTIMAL", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 28, baro: 1012, precip: 8, humidity: 65 },
      { time: "17:00", risk: 34, baro: 1009, precip: 14, humidity: 72 },
      { time: "18:00", risk: 42, baro: 1004, precip: 26, humidity: 81 },
      { time: "19:00", risk: 58, baro: 998, precip: 48, humidity: 88 },
      { time: "20:00", risk: 73, baro: 991, precip: 67, humidity: 93 },
      { time: "21:00", risk: 82, baro: 985, precip: 79, humidity: 95 },
      { time: "22:00", risk: 87, baro: 982, precip: 85, humidity: 97 },
      { time: "23:00 (Pred)", risk: 91, baro: 978, precip: 94, humidity: 98 },
      { time: "00:00 (Pred)", risk: 85, baro: 981, precip: 75, humidity: 96 },
      { time: "01:00 (Pred)", risk: 62, baro: 989, precip: 40, humidity: 90 },
    ]
  },
  {
    id: "mandi",
    name: "Mandi",
    devanagari: "मंडी",
    code: "HP-MND",
    elevationM: 1040,
    headquarters: "Mandi",
    majorCatchments: ["Beas Lower Gorge", "Uh River Basin", "Suketi Khad"],
    center: [31.5892, 76.9182],
    riskScore: 0.74,
    riskLevel: "HIGH",
    riskCategory: "Elevated Watch",
    statusColor: "#d69a32", // Saffron
    trend: "+8.9% / hr",
    isTrendingUp: true,
    telemetry: {
      barometricPressure: 994.1,
      humidity: 89.2,
      precipRate: 58.4,
      windGust: 62.0,
      updraftVelocity: 9.6,
      surfaceMoistureSaturation: 88.5,
      cloudBaseHeightM: 1650,
      radarEchoDbz: 53.8,
      sensorHealth: 99.1,
      activeIoTNtCount: 11,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Surge Runoff Propagation from Upper Catchment Impending",
      reasoning: "Hydrological lag models predict downriver hydraulic surge along Beas canyon within 120 minutes following convective activity in Kullu. Uh river reservoir headwaters are experiencing rapid inflow exceeding 340 m³/s.",
      affectedAreas: ["Pandoh Dam spillway", "Mandi Town ghats", "Jogindernagar", "Aut Tunnel Corridor"],
      recommendedAction: "Coordinate with BBMB for regulated floodgate discharge at Pandoh. Activate flood sirens in lower Mandi bazaar and reinforce slope retaining barriers.",
      confidence: 91.2,
      evacuationRoute: "Mandi-Rewalsar Upper Ridge Link Road",
      ndmaProtocolLevel: "ORANGE - Level 3 Preparedness"
    },
    sensors: [
      { id: "S-MND-01", name: "Pandoh Dam Telemetry Node", coords: [31.6708, 77.0545], status: "ACTIVE", battery: "98%", signal: "OPTIMAL", alert: true },
      { id: "S-MND-02", name: "Victoria Bridge River Radar", coords: [31.7084, 76.9320], status: "ACTIVE", battery: "95%", signal: "OPTIMAL", alert: false },
      { id: "S-MND-03", name: "Barot Valley Hydrology Mast", coords: [32.0347, 76.8402], status: "ACTIVE", battery: "91%", signal: "GOOD", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 22, baro: 1014, precip: 4, humidity: 59 },
      { time: "17:00", risk: 28, baro: 1011, precip: 8, humidity: 66 },
      { time: "18:00", risk: 36, baro: 1007, precip: 18, humidity: 74 },
      { time: "19:00", risk: 49, baro: 1002, precip: 32, humidity: 80 },
      { time: "20:00", risk: 61, baro: 998, precip: 46, humidity: 85 },
      { time: "21:00", risk: 69, baro: 996, precip: 52, humidity: 87 },
      { time: "22:00", risk: 74, baro: 994, precip: 58, humidity: 89 },
      { time: "23:00 (Pred)", risk: 78, baro: 992, precip: 64, humidity: 91 },
      { time: "00:00 (Pred)", risk: 76, baro: 993, precip: 60, humidity: 90 },
      { time: "01:00 (Pred)", risk: 65, baro: 998, precip: 42, humidity: 84 },
    ]
  },
  {
    id: "kangra",
    name: "Kangra",
    devanagari: "कांगड़ा",
    code: "HP-KNG",
    elevationM: 1450,
    headquarters: "Dharamshala",
    majorCatchments: ["Dhauladhar South Slopes", "Bhagsu Stream", "Gaj River"],
    center: [32.0998, 76.2691],
    riskScore: 0.42,
    riskLevel: "MODERATE",
    riskCategory: "Advisory",
    statusColor: "#78b7c9", // Glacial Melt Blue
    trend: "+2.1% / hr",
    isTrendingUp: false,
    telemetry: {
      barometricPressure: 1006.2,
      humidity: 78.4,
      precipRate: 24.1,
      windGust: 38.5,
      updraftVelocity: 5.1,
      surfaceMoistureSaturation: 69.4,
      cloudBaseHeightM: 2100,
      radarEchoDbz: 38.0,
      sensorHealth: 97.8,
      activeIoTNtCount: 16,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Localized Dhauladhar Convective Pockets Observed",
      reasoning: "Moderate moisture convergence against Triund face is yielding localized showers of 24 mm/hr without micro-barometric rupture. Flash flood risk remains bounded to seasonal nullahs.",
      affectedAreas: ["Bhagsunag upper trail", "McLeodganj ridge", "Dharamkot"],
      recommendedAction: "Maintain advisory for high-altitude trekking trails above 2,500m. Standard drainage clearing around Dharamshala urban core.",
      confidence: 89.0,
      evacuationRoute: "Dharamshala-Kangra Expressway",
      ndmaProtocolLevel: "YELLOW - Level 2 Advisory"
    },
    sensors: [
      { id: "S-KNG-01", name: "Triund Crest Weather Station", coords: [32.2590, 76.3533], status: "ACTIVE", battery: "99%", signal: "OPTIMAL", alert: false },
      { id: "S-KNG-02", name: "Bhagsunag Hydrometric Probe", coords: [32.2470, 76.3385], status: "ACTIVE", battery: "93%", signal: "OPTIMAL", alert: false },
      { id: "S-KNG-03", name: "Dharamshala Command Tower", coords: [32.2190, 76.3234], status: "ACTIVE", battery: "100%", signal: "OPTIMAL", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 18, baro: 1011, precip: 5, humidity: 60 },
      { time: "17:00", risk: 24, baro: 1010, precip: 10, humidity: 68 },
      { time: "18:00", risk: 32, baro: 1009, precip: 16, humidity: 72 },
      { time: "19:00", risk: 38, baro: 1008, precip: 20, humidity: 75 },
      { time: "20:00", risk: 40, baro: 1007, precip: 22, humidity: 77 },
      { time: "21:00", risk: 41, baro: 1006, precip: 23, humidity: 78 },
      { time: "22:00", risk: 42, baro: 1006, precip: 24, humidity: 78 },
      { time: "23:00 (Pred)", risk: 39, baro: 1007, precip: 20, humidity: 76 },
      { time: "00:00 (Pred)", risk: 35, baro: 1008, precip: 15, humidity: 74 },
      { time: "01:00 (Pred)", risk: 28, baro: 1010, precip: 8, humidity: 70 },
    ]
  },
  {
    id: "shimla",
    name: "Shimla",
    devanagari: "शिमला",
    code: "HP-SML",
    elevationM: 2276,
    headquarters: "Shimla",
    majorCatchments: ["Sutlej Tributaries", "Giri River Headwaters", "Pabar Basin"],
    center: [31.1048, 77.1734],
    riskScore: 0.38,
    riskLevel: "MODERATE",
    riskCategory: "Advisory",
    statusColor: "#78b7c9",
    trend: "+1.2% / hr",
    isTrendingUp: false,
    telemetry: {
      barometricPressure: 1008.5,
      humidity: 74.5,
      precipRate: 18.2,
      windGust: 32.0,
      updraftVelocity: 4.2,
      surfaceMoistureSaturation: 62.1,
      cloudBaseHeightM: 2400,
      radarEchoDbz: 32.5,
      sensorHealth: 99.4,
      activeIoTNtCount: 15,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Stable Atmospheric Column Across Ridge & Chotta Shimla",
      reasoning: "Ridge telemetry indicates steady barometric gradient at 1008.5 hPa. Moderate stratiform rainfall with low turbulence index across Rohru and Rampur belts.",
      affectedAreas: ["Rampur Bushahr", "Rohru riverside", "The Ridge"],
      recommendedAction: "Standard municipal road monitoring; no immediate evacuation needed.",
      confidence: 93.5,
      evacuationRoute: "NH-05 Shimla-Chandigarh Bypass",
      ndmaProtocolLevel: "GREEN - Level 1 Monitoring"
    },
    sensors: [
      { id: "S-SML-01", name: "Jakhoo Peak Met Node", coords: [31.1009, 77.1852], status: "ACTIVE", battery: "96%", signal: "OPTIMAL", alert: false },
      { id: "S-SML-02", name: "Rampur Sutlej Hydrometric", coords: [31.4500, 77.6300], status: "ACTIVE", battery: "92%", signal: "OPTIMAL", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 20, baro: 1012, precip: 6, humidity: 62 },
      { time: "17:00", risk: 25, baro: 1011, precip: 10, humidity: 66 },
      { time: "18:00", risk: 30, baro: 1010, precip: 14, humidity: 70 },
      { time: "19:00", risk: 35, baro: 1009, precip: 16, humidity: 72 },
      { time: "20:00", risk: 37, baro: 1009, precip: 17, humidity: 73 },
      { time: "21:00", risk: 38, baro: 1008, precip: 18, humidity: 74 },
      { time: "22:00", risk: 38, baro: 1008, precip: 18, humidity: 75 },
      { time: "23:00 (Pred)", risk: 36, baro: 1009, precip: 16, humidity: 73 },
      { time: "00:00 (Pred)", risk: 32, baro: 1010, precip: 12, humidity: 70 },
      { time: "01:00 (Pred)", risk: 25, baro: 1012, precip: 8, humidity: 65 },
    ]
  },
  {
    id: "kinnaur",
    name: "Kinnaur",
    devanagari: "किन्नौर",
    code: "HP-KNR",
    elevationM: 3800,
    headquarters: "Reckong Peo",
    majorCatchments: ["Sutlej Gorge", "Baspa Valley (Sangla)", "Spiti-Sutlej Junction"],
    center: [31.6510, 78.4752],
    riskScore: 0.68,
    riskLevel: "HIGH",
    riskCategory: "Elevated Watch",
    statusColor: "#d69a32",
    trend: "+7.4% / hr",
    isTrendingUp: true,
    telemetry: {
      barometricPressure: 991.2,
      humidity: 86.4,
      precipRate: 46.8,
      windGust: 71.0,
      updraftVelocity: 11.2,
      surfaceMoistureSaturation: 84.0,
      cloudBaseHeightM: 1850,
      radarEchoDbz: 51.2,
      sensorHealth: 96.2,
      activeIoTNtCount: 9,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Glacial Moraine Lake Surcharge & Baspa Convective Buildup",
      reasoning: "High freezing-level elevation combined with heavy localized cloud formation over Sangla valley creates twin hazard of flash flooding and debris flow along steep schist slopes.",
      affectedAreas: ["Sangla Valley", "Batseri", "Chitkul", "Reckong Peo NH-05 slide zones"],
      recommendedAction: "Halt heavy vehicular traffic along NH-05 between Tapri and Pooh. Station earth-moving machinery at Nigulsari slide corridor.",
      confidence: 90.4,
      evacuationRoute: "Upper Sangla Staging Ground via Rakchham",
      ndmaProtocolLevel: "ORANGE - Level 3 Preparedness"
    },
    sensors: [
      { id: "S-KNR-01", name: "Sangla Hydrology Sentry", coords: [31.4255, 78.2612], status: "ACTIVE", battery: "91%", signal: "OPTIMAL", alert: true },
      { id: "S-KNR-02", name: "Karcham Dam Spillway Telemetry", coords: [31.5012, 78.1820], status: "ACTIVE", battery: "98%", signal: "OPTIMAL", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 15, baro: 1010, precip: 2, humidity: 55 },
      { time: "17:00", risk: 24, baro: 1007, precip: 8, humidity: 63 },
      { time: "18:00", risk: 36, baro: 1003, precip: 18, humidity: 71 },
      { time: "19:00", risk: 48, baro: 998, precip: 28, humidity: 78 },
      { time: "20:00", risk: 57, baro: 994, precip: 38, humidity: 82 },
      { time: "21:00", risk: 63, baro: 992, precip: 42, humidity: 85 },
      { time: "22:00", risk: 68, baro: 991, precip: 47, humidity: 86 },
      { time: "23:00 (Pred)", risk: 72, baro: 989, precip: 52, humidity: 88 },
      { time: "00:00 (Pred)", risk: 66, baro: 993, precip: 40, humidity: 84 },
      { time: "01:00 (Pred)", risk: 50, baro: 999, precip: 25, humidity: 76 },
    ]
  },
  {
    id: "lahaul_spiti",
    name: "Lahaul & Spiti",
    devanagari: "लाहौल और स्पीति",
    code: "HP-LSP",
    elevationM: 4280,
    headquarters: "Keylong",
    majorCatchments: ["Chandra-Bhaga Basin", "Spiti River Canyon", "Pin Valley"],
    center: [32.3200, 77.8500],
    riskScore: 0.29,
    riskLevel: "LOW",
    riskCategory: "Normal",
    statusColor: "#78b7c9",
    trend: "+0.4% / hr",
    isTrendingUp: false,
    telemetry: {
      barometricPressure: 1014.0,
      humidity: 52.0,
      precipRate: 6.2,
      windGust: 44.0,
      updraftVelocity: 3.1,
      surfaceMoistureSaturation: 38.0,
      cloudBaseHeightM: 3400,
      radarEchoDbz: 22.0,
      sensorHealth: 95.0,
      activeIoTNtCount: 8,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Arid Trans-Himalayan Shadow Inversion Active",
      reasoning: "High-altitude rainshadow mechanics shield Spiti valley floor from monsoon moisture plume. Minor high-altitude snow melt with low localized convective energy.",
      affectedAreas: ["Kaza", "Tabo", "Keylong"],
      recommendedAction: "Normal operations. Monitor Rohtang / Atal Tunnel north portal road icing.",
      confidence: 96.0,
      evacuationRoute: "Atal Tunnel South Access",
      ndmaProtocolLevel: "GREEN - Level 1 Monitoring"
    },
    sensors: [
      { id: "S-LSP-01", name: "Keylong Meteorological Tower", coords: [32.5710, 77.0320], status: "ACTIVE", battery: "94%", signal: "GOOD", alert: false },
      { id: "S-LSP-02", name: "Kaza Trans-Himalayan Sensor", coords: [32.2276, 78.0710], status: "ACTIVE", battery: "88%", signal: "GOOD", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 10, baro: 1016, precip: 0, humidity: 44 },
      { time: "17:00", risk: 14, baro: 1015, precip: 1, humidity: 48 },
      { time: "18:00", risk: 20, baro: 1015, precip: 3, humidity: 50 },
      { time: "19:00", risk: 24, baro: 1014, precip: 4, humidity: 51 },
      { time: "20:00", risk: 27, baro: 1014, precip: 5, humidity: 52 },
      { time: "21:00", risk: 28, baro: 1014, precip: 6, humidity: 52 },
      { time: "22:00", risk: 29, baro: 1014, precip: 6, humidity: 52 },
      { time: "23:00 (Pred)", risk: 26, baro: 1015, precip: 4, humidity: 50 },
      { time: "00:00 (Pred)", risk: 22, baro: 1016, precip: 2, humidity: 48 },
      { time: "01:00 (Pred)", risk: 18, baro: 1017, precip: 0, humidity: 45 },
    ]
  },
  {
    id: "chamba",
    name: "Chamba",
    devanagari: "चंबा",
    code: "HP-CHM",
    elevationM: 2100,
    headquarters: "Chamba",
    majorCatchments: ["Ravi River Basin", "Budhil River", "Pangi Valley"],
    center: [32.5534, 76.1258],
    riskScore: 0.53,
    riskLevel: "MODERATE",
    riskCategory: "Advisory",
    statusColor: "#78b7c9",
    trend: "+4.1% / hr",
    isTrendingUp: true,
    telemetry: {
      barometricPressure: 1002.8,
      humidity: 82.0,
      precipRate: 34.0,
      windGust: 48.0,
      updraftVelocity: 6.8,
      surfaceMoistureSaturation: 74.0,
      cloudBaseHeightM: 1900,
      radarEchoDbz: 42.0,
      sensorHealth: 98.2,
      activeIoTNtCount: 10,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Upper Ravi Catchment Moisture Accretion",
      reasoning: "Mid-level convective cells forming along Mani Mahesh ridge. Discharge rates in Budhil nallah rising at 18 m³/s.",
      affectedAreas: ["Bharmour", "Holi catchment", "Chamba Town"],
      recommendedAction: "Pre-position rescue boats near Chamba barrage and caution pilgrims in Bharmour.",
      confidence: 88.5,
      evacuationRoute: "Chamba-Pathankot Highway",
      ndmaProtocolLevel: "YELLOW - Level 2 Advisory"
    },
    sensors: [
      { id: "S-CHM-01", name: "Bharmour Alpine Probe", coords: [32.4410, 76.5410], status: "ACTIVE", battery: "93%", signal: "OPTIMAL", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 20, baro: 1012, precip: 8, humidity: 68 },
      { time: "17:00", risk: 28, baro: 1010, precip: 14, humidity: 72 },
      { time: "18:00", risk: 38, baro: 1007, precip: 22, humidity: 76 },
      { time: "19:00", risk: 45, baro: 1005, precip: 28, humidity: 79 },
      { time: "20:00", risk: 49, baro: 1004, precip: 31, humidity: 81 },
      { time: "21:00", risk: 51, baro: 1003, precip: 33, humidity: 82 },
      { time: "22:00", risk: 53, baro: 1002, precip: 34, humidity: 82 },
      { time: "23:00 (Pred)", risk: 55, baro: 1001, precip: 36, humidity: 83 },
      { time: "00:00 (Pred)", risk: 48, baro: 1004, precip: 28, humidity: 78 },
      { time: "01:00 (Pred)", risk: 36, baro: 1008, precip: 18, humidity: 72 },
    ]
  },
  {
    id: "solan",
    name: "Solan",
    devanagari: "सोलन",
    code: "HP-SOL",
    elevationM: 1500,
    headquarters: "Solan",
    majorCatchments: ["Giri Tributaries", "Ashwani Khad"],
    center: [30.9045, 77.0967],
    riskScore: 0.21,
    riskLevel: "LOW",
    riskCategory: "Normal",
    statusColor: "#78b7c9",
    trend: "-0.5% / hr",
    isTrendingUp: false,
    telemetry: {
      barometricPressure: 1012.0,
      humidity: 64.0,
      precipRate: 9.5,
      windGust: 22.0,
      updraftVelocity: 2.4,
      surfaceMoistureSaturation: 48.0,
      cloudBaseHeightM: 2600,
      radarEchoDbz: 18.0,
      sensorHealth: 99.0,
      activeIoTNtCount: 12,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Minimal Convective Disturbance Across Shivalik Foot-Hills",
      reasoning: "Stable boundary layer conditions with light intermittent precipitation. Soil saturation well below critical plastic limit.",
      affectedAreas: ["Kalka-Shimla Highway stretches", "Kumarhatti"],
      recommendedAction: "Routine surveillance. Clear debris culverts.",
      confidence: 97.0,
      evacuationRoute: "NH-05 Kalka Corridor",
      ndmaProtocolLevel: "GREEN - Level 1 Monitoring"
    },
    sensors: [
      { id: "S-SOL-01", name: "Kandaghat Observation Point", coords: [30.9630, 77.1060], status: "ACTIVE", battery: "99%", signal: "OPTIMAL", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 12, baro: 1015, precip: 2, humidity: 55 },
      { time: "17:00", risk: 15, baro: 1014, precip: 4, humidity: 58 },
      { time: "18:00", risk: 19, baro: 1013, precip: 7, humidity: 61 },
      { time: "19:00", risk: 22, baro: 1012, precip: 9, humidity: 63 },
      { time: "20:00", risk: 22, baro: 1012, precip: 9, humidity: 64 },
      { time: "21:00", risk: 21, baro: 1012, precip: 9, humidity: 64 },
      { time: "22:00", risk: 21, baro: 1012, precip: 9, humidity: 64 },
      { time: "23:00 (Pred)", risk: 18, baro: 1013, precip: 6, humidity: 60 },
      { time: "00:00 (Pred)", risk: 15, baro: 1014, precip: 3, humidity: 56 },
      { time: "01:00 (Pred)", risk: 12, baro: 1015, precip: 1, humidity: 52 },
    ]
  },
  {
    id: "sirmaur",
    name: "Sirmaur",
    devanagari: "सिरमौर",
    code: "HP-SRM",
    elevationM: 1200,
    headquarters: "Nahan",
    majorCatchments: ["Giri River", "Tons Confluence", "Bata River"],
    center: [30.6300, 77.4500],
    riskScore: 0.26,
    riskLevel: "LOW",
    riskCategory: "Normal",
    statusColor: "#78b7c9",
    trend: "+0.8% / hr",
    isTrendingUp: false,
    telemetry: {
      barometricPressure: 1011.5,
      humidity: 68.0,
      precipRate: 12.0,
      windGust: 26.0,
      updraftVelocity: 2.8,
      surfaceMoistureSaturation: 52.0,
      cloudBaseHeightM: 2500,
      radarEchoDbz: 20.0,
      sensorHealth: 98.6,
      activeIoTNtCount: 9,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Sub-Himalayan Catchments Stable",
      reasoning: "Giri river discharge stable at 45 m³/s with gentle Shivalik wind flow. No high-altitude convective clouds detected.",
      affectedAreas: ["Nahan", "Paonta Sahib plain"],
      recommendedAction: "Standard water gauge monitoring.",
      confidence: 95.0,
      evacuationRoute: "Paonta-Dehradun Highway",
      ndmaProtocolLevel: "GREEN - Level 1 Monitoring"
    },
    sensors: [
      { id: "S-SRM-01", name: "Renuka Ji Hydrology Station", coords: [30.6050, 77.4550], status: "ACTIVE", battery: "97%", signal: "OPTIMAL", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 14, baro: 1014, precip: 3, humidity: 58 },
      { time: "18:00", risk: 20, baro: 1013, precip: 8, humidity: 64 },
      { time: "20:00", risk: 25, baro: 1012, precip: 11, humidity: 67 },
      { time: "22:00", risk: 26, baro: 1011, precip: 12, humidity: 68 },
      { time: "00:00 (Pred)", risk: 20, baro: 1013, precip: 6, humidity: 62 },
    ]
  },
  {
    id: "bilaspur",
    name: "Bilaspur",
    devanagari: "बिलासपुर",
    code: "HP-BLS",
    elevationM: 670,
    headquarters: "Bilaspur",
    majorCatchments: ["Gobind Sagar Reservoir", "Sutlej Lake"],
    center: [31.3260, 76.7580],
    riskScore: 0.31,
    riskLevel: "LOW",
    riskCategory: "Normal",
    statusColor: "#78b7c9",
    trend: "+1.0% / hr",
    isTrendingUp: false,
    telemetry: {
      barometricPressure: 1010.0,
      humidity: 71.0,
      precipRate: 14.5,
      windGust: 28.0,
      updraftVelocity: 3.2,
      surfaceMoistureSaturation: 56.0,
      cloudBaseHeightM: 2400,
      radarEchoDbz: 24.0,
      sensorHealth: 99.2,
      activeIoTNtCount: 8,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Gobind Sagar Reservoir Level Within Operating Limit",
      reasoning: "Current reservoir capacity is 62% filled with sufficient buffer to absorb upriver Sutlej surges over next 36 hours.",
      affectedAreas: ["Bilaspur Town", "Bhakra Head"],
      recommendedAction: "Continuous reservoir volume telemetry synchronization.",
      confidence: 94.0,
      evacuationRoute: "Bilaspur-Kiratpur 4-Lane",
      ndmaProtocolLevel: "GREEN - Level 1 Monitoring"
    },
    sensors: [
      { id: "S-BLS-01", name: "Gobind Sagar Reservoir Gauge", coords: [31.3300, 76.7500], status: "ACTIVE", battery: "98%", signal: "OPTIMAL", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 16, baro: 1013, precip: 4, humidity: 62 },
      { time: "18:00", risk: 24, baro: 1011, precip: 9, humidity: 67 },
      { time: "20:00", risk: 30, baro: 1010, precip: 13, humidity: 70 },
      { time: "22:00", risk: 31, baro: 1010, precip: 14, humidity: 71 },
      { time: "00:00 (Pred)", risk: 25, baro: 1012, precip: 8, humidity: 65 },
    ]
  },
  {
    id: "hamirpur",
    name: "Hamirpur",
    devanagari: "हमीरपुर",
    code: "HP-HMR",
    elevationM: 780,
    headquarters: "Hamirpur",
    majorCatchments: ["Kunah Khad", "Man Khad"],
    center: [31.6862, 76.5213],
    riskScore: 0.19,
    riskLevel: "NORMAL",
    riskCategory: "Normal",
    statusColor: "#78b7c9",
    trend: "-0.2% / hr",
    isTrendingUp: false,
    telemetry: {
      barometricPressure: 1013.2,
      humidity: 61.0,
      precipRate: 7.0,
      windGust: 20.0,
      updraftVelocity: 1.9,
      surfaceMoistureSaturation: 42.0,
      cloudBaseHeightM: 2800,
      radarEchoDbz: 14.0,
      sensorHealth: 99.8,
      activeIoTNtCount: 7,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Calm Low-Altitude Atmospheric Basin",
      reasoning: "No orographic lift anomalies. Low probability of flash flooding or cloudburst triggers in the next 12 hours.",
      affectedAreas: ["Hamirpur bazaar", "Nadaun"],
      recommendedAction: "All systems green.",
      confidence: 98.0,
      evacuationRoute: "Hamirpur-Una Highway",
      ndmaProtocolLevel: "GREEN - Level 1 Monitoring"
    },
    sensors: [
      { id: "S-HMR-01", name: "NIT Hamirpur Weather Cluster", coords: [31.7080, 76.5270], status: "ACTIVE", battery: "100%", signal: "OPTIMAL", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 10, baro: 1015, precip: 2, humidity: 52 },
      { time: "18:00", risk: 14, baro: 1014, precip: 4, humidity: 57 },
      { time: "20:00", risk: 18, baro: 1013, precip: 6, humidity: 60 },
      { time: "22:00", risk: 19, baro: 1013, precip: 7, humidity: 61 },
      { time: "00:00 (Pred)", risk: 14, baro: 1014, precip: 3, humidity: 56 },
    ]
  },
  {
    id: "una",
    name: "Una",
    devanagari: "ऊना",
    code: "HP-UNA",
    elevationM: 369,
    headquarters: "Una",
    majorCatchments: ["Swan River Basin (Sorrow of Una)"],
    center: [31.4685, 76.2708],
    riskScore: 0.24,
    riskLevel: "LOW",
    riskCategory: "Normal",
    statusColor: "#78b7c9",
    trend: "+0.3% / hr",
    isTrendingUp: false,
    telemetry: {
      barometricPressure: 1012.8,
      humidity: 63.5,
      precipRate: 11.2,
      windGust: 24.0,
      updraftVelocity: 2.1,
      surfaceMoistureSaturation: 46.0,
      cloudBaseHeightM: 2700,
      radarEchoDbz: 16.0,
      sensorHealth: 99.5,
      activeIoTNtCount: 8,
    },
    geminiInsight: {
      timestamp: "2026-09-09T22:00:00+05:30",
      model: "gemini-2.5-flash",
      headline: "Swan River Embankments Holding Normal Flow",
      reasoning: "River channelisation project handling monsoon discharge with 3.2m freeboard clearance. Upstream runoff minimal.",
      affectedAreas: ["Swan River floodplains", "Mehatpur"],
      recommendedAction: "Routine check of drainage sluice gates.",
      confidence: 96.5,
      evacuationRoute: "Una-Nangal Expressway",
      ndmaProtocolLevel: "GREEN - Level 1 Monitoring"
    },
    sensors: [
      { id: "S-UNA-01", name: "Swan River Sluice Telemetry", coords: [31.4500, 76.2600], status: "ACTIVE", battery: "98%", signal: "OPTIMAL", alert: false }
    ],
    trendData: [
      { time: "16:00", risk: 12, baro: 1015, precip: 3, humidity: 54 },
      { time: "18:00", risk: 17, baro: 1014, precip: 6, humidity: 59 },
      { time: "20:00", risk: 22, baro: 1013, precip: 9, humidity: 62 },
      { time: "22:00", risk: 24, baro: 1012, precip: 11, humidity: 63 },
      { time: "00:00 (Pred)", risk: 18, baro: 1014, precip: 5, humidity: 58 },
    ]
  }
];

// District boundary polygon approximations for Himachal Pradesh cartographic rendering
export const HP_GEOJSON_FEATURES = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "kullu",
      properties: { name: "Kullu", id: "kullu", risk: 0.87, level: "CRITICAL" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.02, 32.22], [77.38, 32.26], [77.65, 32.08], [77.72, 31.75],
          [77.48, 31.42], [77.12, 31.55], [76.92, 31.85], [77.02, 32.22]
        ]]
      }
    },
    {
      type: "Feature",
      id: "mandi",
      properties: { name: "Mandi", id: "mandi", risk: 0.74, level: "HIGH" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.82, 32.05], [77.02, 32.22], [76.92, 31.85], [77.12, 31.55],
          [77.08, 31.35], [76.78, 31.30], [76.65, 31.65], [76.82, 32.05]
        ]]
      }
    },
    {
      type: "Feature",
      id: "kangra",
      properties: { name: "Kangra", id: "kangra", risk: 0.42, level: "MODERATE" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.60, 32.30], [76.30, 32.45], [76.82, 32.05], [76.65, 31.65],
          [76.25, 31.80], [75.75, 31.95], [75.60, 32.30]
        ]]
      }
    },
    {
      type: "Feature",
      id: "shimla",
      properties: { name: "Shimla", id: "shimla", risk: 0.38, level: "MODERATE" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.08, 31.35], [77.48, 31.42], [77.82, 31.55], [77.95, 31.15],
          [77.60, 30.85], [77.15, 31.00], [77.08, 31.35]
        ]]
      }
    },
    {
      type: "Feature",
      id: "kinnaur",
      properties: { name: "Kinnaur", id: "kinnaur", risk: 0.68, level: "HIGH" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.72, 31.75], [78.20, 32.05], [78.95, 31.85], [78.65, 31.25],
          [78.15, 31.15], [77.82, 31.55], [77.72, 31.75]
        ]]
      }
    },
    {
      type: "Feature",
      id: "lahaul_spiti",
      properties: { name: "Lahaul & Spiti", id: "lahaul_spiti", risk: 0.29, level: "LOW" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.50, 32.90], [77.45, 33.25], [78.60, 32.65], [78.20, 32.05],
          [77.65, 32.08], [77.38, 32.26], [77.02, 32.22], [76.82, 32.40],
          [76.50, 32.90]
        ]]
      }
    },
    {
      type: "Feature",
      id: "chamba",
      properties: { name: "Chamba", id: "chamba", risk: 0.53, level: "MODERATE" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.75, 33.20], [76.50, 33.20], [76.50, 32.90], [76.82, 32.40],
          [76.30, 32.45], [75.60, 32.30], [75.75, 33.20]
        ]]
      }
    },
    {
      type: "Feature",
      id: "solan",
      properties: { name: "Solan", id: "solan", risk: 0.21, level: "LOW" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.78, 31.30], [77.08, 31.35], [77.15, 31.00], [77.30, 30.75],
          [76.85, 30.80], [76.78, 31.30]
        ]]
      }
    },
    {
      type: "Feature",
      id: "sirmaur",
      properties: { name: "Sirmaur", id: "sirmaur", risk: 0.26, level: "LOW" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.15, 31.00], [77.60, 30.85], [77.75, 30.55], [77.25, 30.40],
          [77.30, 30.75], [77.15, 31.00]
        ]]
      }
    },
    {
      type: "Feature",
      id: "bilaspur",
      properties: { name: "Bilaspur", id: "bilaspur", risk: 0.31, level: "LOW" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.55, 31.50], [76.85, 31.45], [76.78, 31.30], [76.50, 31.25],
          [76.40, 31.38], [76.55, 31.50]
        ]]
      }
    },
    {
      type: "Feature",
      id: "hamirpur",
      properties: { name: "Hamirpur", id: "hamirpur", risk: 0.19, level: "NORMAL" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.35, 31.85], [76.65, 31.75], [76.55, 31.50], [76.25, 31.60],
          [76.35, 31.85]
        ]]
      }
    },
    {
      type: "Feature",
      id: "una",
      properties: { name: "Una", id: "una", risk: 0.24, level: "LOW" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.95, 31.75], [76.35, 31.85], [76.25, 31.60], [76.40, 31.20],
          [75.95, 31.30], [75.95, 31.75]
        ]]
      }
    }
  ]
};
