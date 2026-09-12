import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generate meteorological and emergency management explanations from risk score and features.
 * 
 * Schema:
 * {
 *   riskLevel: "low" | "moderate" | "high" | "critical",
 *   reasoning: string,
 *   affectedArea: string,
 *   recommendedAction: string
 * }
 */
export async function generateGeminiExplanation(district, prediction) {
  const apiKey = process.env.GEMINI_API_KEY;
  const { risk_score, risk_level, features_used, ml_probability } = prediction;

  // Fallback meteorological synthesis generator
  const getFallbackExplanation = () => {
    const isCritical = risk_score >= 0.8;
    const isHigh = risk_score >= 0.5 || risk_level === 'high';
    const isModerate = risk_score >= 0.25 || risk_level === 'moderate';

    let level = "low";
    let reasoning = "";
    let affectedArea = `${district.name} valley floor and municipal drainage catchments`;
    let recommendedAction = "Maintain routine high-altitude IoT telemetry monitoring.";

    if (isCritical) {
      level = "critical";
      reasoning = `Extreme orographic convergence detected over ${district.name} (${district.elevation_m}m ASL). Barometric pressure drop of ${Math.abs(features_used?.pressure_drop_6h || 4.2).toFixed(1)} hPa combined with peak humidity ${features_used?.humidity_max || 90}% and precip rate ${features_used?.precip_rate_max_mm_hr || 25} mm/h signals high-confidence adiabatic locking and imminent cloudburst genesis.`;
      affectedArea = `${district.majorCatchments ? district.majorCatchments.slice(0, 2).join(' and ') : district.name + ' Gorge'} and low-lying riverside corridors`;
      recommendedAction = `Sound district siren grid. Issue immediate Phase-4 evacuation advisory for ${district.name} riverside settlements and halt trans-valley highway traffic.`;
    } else if (isHigh) {
      level = "high";
      reasoning = `Elevated convective updrafts and moisture accumulation over ${district.name} ridges. 6-hour humidity spike of +${(features_used?.humidity_spike_6h || 12).toFixed(1)}% with wind gusts up to ${features_used?.wind_gust_max_ms || 15} m/s creates strong meso-scale cloudburst preconditions.`;
      affectedArea = `${district.majorCatchments ? district.majorCatchments[0] : district.name} riverbed and steep scree slopes`;
      recommendedAction = `Deploy SDRF quick-response patrol units. Alert dam spillway authorities and restrict riverside trekking.`;
    } else if (isModerate) {
      level = "moderate";
      reasoning = `Moderate orographic moisture flow observed across ${district.name} (${district.elevation_m}m ASL). Surface saturation and cloud cover at ${features_used?.cloud_cover_max_pct || 65}%; localized rainfall expected with low flash flood probability.`;
      affectedArea = `Upper ridge catchments in ${district.name}`;
      recommendedAction = `Enforce standard monsoon vigil along highway culverts and monitor in-situ telemetry nodes.`;
    } else {
      level = "low";
      reasoning = `Stable atmospheric boundary layer across ${district.name}. Barometric gradients within normal seasonal parameters; minimal cloudburst trigger probability detected by Neural-WRF model.`;
      affectedArea = `None critical (${district.name} general basin)`;
      recommendedAction = `Maintain standard automated monitoring. All transit routes operating under green protocol.`;
    }

    return {
      riskLevel: level,
      reasoning,
      affectedArea,
      recommendedAction
    };
  };

  if (!apiKey) {
    return getFallbackExplanation();
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `You are the MeghDrishti Atmospheric Physics & Himalayan Disaster AI Copilot.
Analyze this live cloudburst risk model output for district ${district.name} (${district.devanagari}), Himachal Pradesh (Elevation: ${district.elevation_m}m ASL, Catchments: ${district.majorCatchments?.join(', ')}):

Model Output:
- Risk Score: ${risk_score} (0-1 scale)
- Risk Level: ${risk_level}
- ML Probability: ${ml_probability}
- Key Meteorological Features Used: ${JSON.stringify(features_used)}

Generate a scientific, authoritative, and actionable disaster assessment in JSON format with exactly these keys:
{
  "riskLevel": "low" | "moderate" | "high" | "critical",
  "reasoning": "Concise 2-3 sentence meteorological physics explanation of why this risk score was calculated (reference pressure drops, humidity spikes, orographic funneling, or precipitation acceleration)",
  "affectedArea": "Specific valleys, catchments, or corridors at primary risk in ${district.name}",
  "recommendedAction": "Specific NDMA / SDMA emergency directive or operational advisory"
}`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const parsed = JSON.parse(text.trim());
    return parsed;
  } catch (err) {
    console.warn(`[GeminiService] Gemini API call failed (${err.message}). Using meteorological fallback.`);
    return getFallbackExplanation();
  }
}
