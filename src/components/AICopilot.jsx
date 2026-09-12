import React, { useState } from 'react';
import { Sparkles, Send, Terminal, Bot, User, CornerDownLeft, Loader2, ArrowRight } from 'lucide-react';
import { sendAICopilotQuery } from '../services/api';
import ScrollReveal from './ScrollReveal';

const QUICK_PROMPTS = [
  "Why is Parvati Valley at 87% critical risk right now?",
  "What is the hydrological surge lag to Mandi / Pandoh Dam?",
  "List designated HP-SDMA evacuation corridors for Kullu.",
  "Explain barometric pressure drop correlation with cloudburst genesis."
];

export default function AICopilot({ activeDistrict }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `**MeghDrishti Climate AI Copilot Initialized.**\n\nI have real-time telemetry access to all 114 IoT nodes and XGBoost predictions across Himachal Pradesh. Currently monitoring **${activeDistrict?.name || 'Kullu'}** with critical focus on upper orographic catchments. Ask me any meteorological, hydrological, or disaster management question.`
    }
  ]);

  const handleSend = async (textToSend) => {
    const userText = textToSend || query;
    if (!userText.trim() || loading) return;

    const userMessage = { sender: 'user', text: userText };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await sendAICopilotQuery(userText, activeDistrict);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: response.answer,
          meta: `Confidence: ${(response.confidence * 100).toFixed(0)}% • ${response.source}`
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "An error occurred while synthesizing high-altitude meteorological data. Please retry."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-copilot" className="py-20 bg-surface-low relative border-b border-mountain-border overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Copilot Description & Preset Prompts with Scroll Reveal */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="left" duration={800}>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-primary mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>NATURAL LANGUAGE CLIMATE INTELLIGENCE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Ask the Himalayas.
              </h2>

              <p className="text-sm text-on-surface-variant font-sans leading-relaxed mt-2">
                Powered by Google Gemini 2.5 Flash in JSON mode, our AI layer translates complex barometric gradients, Doppler sweeps, and hydrological models into instant, human-actionable emergency guidance.
              </p>

              {/* Quick Prompts List */}
              <div className="space-y-2 pt-4">
                <span className="text-xs font-mono text-glacial block font-semibold uppercase">
                  Suggested Meteorological Queries:
                </span>
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="w-full text-left p-3 rounded bg-surface-container hover:bg-surface-container-high border border-mountain-border hover:border-primary/40 text-xs font-mono text-on-surface transition-all flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Interactive Terminal AI Chat HUD with Scroll Reveal */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="right" duration={800} delay={150}>
              <div className="kath-kuni-card bg-surface-lowest border border-mountain-border overflow-hidden shadow-2xl flex flex-col h-[520px]">
              
              {/* Terminal Titlebar */}
              <div className="bg-surface-container-high px-4 py-3 border-b border-mountain-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-vermilion" />
                  <div className="w-3 h-3 rounded-full bg-saffron" />
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="ml-2 text-xs font-mono font-bold text-white">
                    GEMINI-2.5-FLASH // CLIMATE_COPILOT_HUD
                  </span>
                </div>
                <span className="text-[10px] font-mono text-glacial bg-surface-lowest px-2 py-0.5 rounded border border-mountain-border">
                  TELEMETRY ATTACHED: {activeDistrict?.name.toUpperCase()}
                </span>
              </div>

              {/* Chat Message Scroll Window */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
                {messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded bg-forest border border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                    )}

                    <div className={`p-3.5 rounded-lg max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-forest/60 text-white border border-primary/30 font-sans'
                        : 'bg-surface-container border border-mountain-border text-on-surface font-sans'
                    }`}>
                      <div className="whitespace-pre-line text-xs font-sans">
                        {msg.text}
                      </div>

                      {msg.meta && (
                        <div className="mt-2 pt-2 border-t border-mountain-border/60 text-[10px] font-mono text-glacial">
                          {msg.meta}
                        </div>
                      )}
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded bg-surface-container-highest border border-mountain-border flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-on-surface-variant" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center space-x-2 text-xs font-mono text-primary p-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini 2.5 Flash is synthesizing high-altitude telemetry...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-surface-container border-t border-mountain-border">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(query);
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask Gemini about cloudburst risk, barometric drops, or evacuation routes..."
                    className="flex-1 bg-surface-lowest border border-mountain-border rounded px-3.5 py-2.5 text-xs font-sans text-white focus:outline-none focus:border-primary placeholder:text-on-surface-variant/60"
                  />
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-4 py-2.5 rounded bg-forest hover:bg-forest-hover border border-primary/50 text-white font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all disabled:opacity-50"
                  >
                    <span>SEND</span>
                    <Send className="w-3.5 h-3.5 text-primary" />
                  </button>
                </form>
              </div>

            </div>
          </ScrollReveal>
        </div>

      </div>

    </div>
  </section>
);
}
