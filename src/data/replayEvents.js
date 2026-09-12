// Historical Cloudburst & Extreme Storm Replay Scenarios for Demo Mode

export const REPLAY_EVENTS = [
  {
    id: "beas-2023-cloudburst",
    title: "Beas Basin Supercell Cloudburst (July 2023)",
    date: "09-10 July 2023",
    description: "Multi-point high-altitude convective cloudbursts across Manikaran, Kasol, and Sainj valleys resulting in historic peak discharge of 4,200 m³/s at Pandoh Dam.",
    peakDistrict: "Kullu",
    maxPrecipMmHr: 124.5,
    frames: [
      { time: "T-06h (Pre-Convection)", kulluRisk: 0.22, mandiRisk: 0.18, kangraRisk: 0.15, notes: "Subtle barometric decline (1014 hPa), humid SW monsoon currents entering lower valley." },
      { time: "T-04h (Orographic Trapping)", kulluRisk: 0.45, mandiRisk: 0.32, kangraRisk: 0.24, notes: "Updraft velocities increase to 8.2 m/s as cloud deck hits Dhauladhar-Pir Panjal divide." },
      { time: "T-02h (Meso-Vortex Genesis)", kulluRisk: 0.76, mandiRisk: 0.58, kangraRisk: 0.38, notes: "Sudden 14 hPa pressure drop across Manikaran cluster. Humidity hits 98%." },
      { time: "T-00h (Cloudburst Genesis)", kulluRisk: 0.94, mandiRisk: 0.88, kangraRisk: 0.52, notes: "Critical micro-rupture. 118 mm/hr concentrated rainfall over 42 sq km catchment." },
      { time: "T+02h (Downstream Surge)", kulluRisk: 0.81, mandiRisk: 0.92, kangraRisk: 0.44, notes: "Peak hydraulic surge reaches Aut tunnel and Pandoh gorge. Debris flows active." },
      { time: "T+04h (Attenuation)", kulluRisk: 0.48, mandiRisk: 0.62, kangraRisk: 0.28, notes: "Convective cell dissipates toward Spiti trans-himalayan rain shadow." }
    ]
  },
  {
    id: "dharamshala-2021-flashflood",
    title: "Bhagsunag Updraft & Flash Surge (July 2021)",
    date: "12 July 2021",
    description: "Rapid localized orographic convection on southern slopes of Dhauladhar range precipitating intense torrents through Bhagsu Nullah.",
    peakDistrict: "Kangra",
    maxPrecipMmHr: 98.0,
    frames: [
      { time: "T-04h", kulluRisk: 0.18, mandiRisk: 0.20, kangraRisk: 0.28, notes: "Moderate cloud build-up along Dharamkot crest line." },
      { time: "T-02h", kulluRisk: 0.22, mandiRisk: 0.28, kangraRisk: 0.65, notes: "Steep upward thermal convective plume recorded by Triund station." },
      { time: "T-00h", kulluRisk: 0.30, mandiRisk: 0.35, kangraRisk: 0.89, notes: "High intensity downpour triggers flash torrent in Bhagsunag parking zone." },
      { time: "T+02h", kulluRisk: 0.25, mandiRisk: 0.30, kangraRisk: 0.42, notes: "Runoff discharges into Kangra valley plain; system stabilises." }
    ]
  },
  {
    id: "kinnaur-2022-moraine-surge",
    title: "Sangla Valley Glacial Catchment Saturation (Aug 2022)",
    date: "19 August 2022",
    description: "Baspa river headwater surge combined with high zero-degree isotherm elevation inducing moraine stability loss and debris flow.",
    peakDistrict: "Kinnaur",
    maxPrecipMmHr: 76.0,
    frames: [
      { time: "T-04h", kulluRisk: 0.20, mandiRisk: 0.18, kinnaurRisk: 0.32, notes: "High freezing level measured at 5,100m. Moraine drainage elevated." },
      { time: "T-02h", kulluRisk: 0.28, mandiRisk: 0.24, kinnaurRisk: 0.68, notes: "Convective cloud cluster forms above Chitkul valley." },
      { time: "T-00h", kulluRisk: 0.35, mandiRisk: 0.30, kinnaurRisk: 0.86, notes: "Torrential downpour triggers rock-and-debris flow across NH-05." },
      { time: "T+02h", kulluRisk: 0.26, mandiRisk: 0.25, kinnaurRisk: 0.52, notes: "Sediment load peaks at Karcham Wangtoo reservoir." }
    ]
  }
];
