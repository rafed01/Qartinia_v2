import React, { useState } from 'react';
import { Sparkles, TrendingUp, Cpu, FlaskConical, ShieldCheck, Activity, ChevronRight, Pause, Play } from 'lucide-react';
import { LivePulseBeacon } from './CarthageArtwork';

interface SignalItem {
  id: string;
  category: 'Frontier' | 'Fab Sample' | 'Test Bench' | 'IP Escrow' | 'Simulation';
  message: string;
  metricChange?: string;
  timestamp: string;
}

const LIVE_SIGNALS: SignalItem[] = [
  {
    id: 'sig-1',
    category: 'Frontier',
    message: '1200V SiC MOSFET Inverter Efficiency Benchmark Updated (+1.4% at 150°C)',
    metricChange: '+1.4% η',
    timestamp: '2m ago',
  },
  {
    id: 'sig-2',
    category: 'Fab Sample',
    message: 'STMicroelectronics 8-inch SiC Epi-Wafer Batch #4092 Passed AQG-324 Screening',
    metricChange: 'Verified',
    timestamp: '14m ago',
  },
  {
    id: 'sig-3',
    category: 'Test Bench',
    message: 'NREL High-Voltage Dyno Bench Slot Allocated for Brembo Thermal Validation',
    metricChange: 'Scheduled',
    timestamp: '32m ago',
  },
  {
    id: 'sig-4',
    category: 'IP Escrow',
    message: 'Joint Project "GaN Traction Inverter v3" Executed Mutual NDA & Patent Escrow',
    metricChange: 'Encrypted',
    timestamp: '1h ago',
  },
  {
    id: 'sig-5',
    category: 'Simulation',
    message: 'TCAD Thermal Breakdown Solver Completed 10,000 Pulse Cycles on Gate Oxide',
    metricChange: '0.02% Shift',
    timestamp: '2h ago',
  },
];

export const LiveSignalTicker: React.FC<{ onNavigateToSection?: (section: string) => void }> = ({
  onNavigateToSection,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="bg-[#0F2038] text-white border-b border-[#1A3254] py-1.5 px-4 text-xs select-none overflow-hidden relative shadow-inner">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0 border-r border-[#1A3254] pr-4">
          <LivePulseBeacon color="gold" />
          <span className="font-serif font-bold text-[#C5A880] tracking-wider text-[11px] uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            <span>Empirical Intelligence Ticker</span>
          </span>
        </div>

        {/* Scrolling Ticker Line */}
        <div
          className="flex-1 overflow-hidden relative cursor-pointer group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex items-center gap-8 whitespace-nowrap transition-transform duration-1000 ${
              isPaused ? '' : 'animate-wave-drift'
            }`}
          >
            {LIVE_SIGNALS.map((sig) => (
              <div
                key={sig.id}
                onClick={() => onNavigateToSection && onNavigateToSection('frontier')}
                className="inline-flex items-center gap-2 text-[11px] text-slate-200 hover:text-[#C5A880] transition-colors"
              >
                <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold uppercase bg-[#1A3254] text-[#C5A880] border border-[#284873]">
                  {sig.category}
                </span>
                <span className="font-medium truncate max-w-md">{sig.message}</span>
                {sig.metricChange && (
                  <span className="font-mono font-bold text-emerald-400 text-[10px]">
                    [{sig.metricChange}]
                  </span>
                )}
                <span className="text-[#5A6E85] font-mono text-[10px]">{sig.timestamp}</span>
                <span className="text-[#284873] ml-2">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Status Control */}
        <div className="hidden md:flex items-center gap-3 shrink-0 pl-4 border-l border-[#1A3254] text-[10px] font-mono text-[#A0AEC0]">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            title={isPaused ? 'Resume live ticker scroll' : 'Pause ticker scroll'}
          >
            {isPaused ? <Play className="w-3 h-3 text-[#C5A880]" /> : <Pause className="w-3 h-3 text-[#A0AEC0]" />}
            <span>{isPaused ? 'Paused' : 'Live Sync'}</span>
          </button>
          <span className="text-[#284873]">|</span>
          <span className="text-emerald-400 font-bold">100% Provenance</span>
        </div>
      </div>
    </div>
  );
};
