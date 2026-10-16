import React, { useState } from 'react';
import { Check, ShieldCheck, Sparkles, Layers, ArrowUpRight, Award, Info } from 'lucide-react';
import { LivePulseBeacon, CarthageCornerMotif } from './CarthageArtwork';

export interface TrlStep {
  level: number;
  label: string;
  description: string;
  stage: 'Concept' | 'Lab Proof' | 'System Prototype' | 'Commercial Fab';
}

const TRL_STAGES: TrlStep[] = [
  { level: 1, label: 'TRL 1', description: 'Basic physical principles observed in academic literature', stage: 'Concept' },
  { level: 2, label: 'TRL 2', description: 'Technology concept or application formulated', stage: 'Concept' },
  { level: 3, label: 'TRL 3', description: 'Analytical and experimental critical function proof of concept', stage: 'Lab Proof' },
  { level: 4, label: 'TRL 4', description: 'Component or breadboard validation in laboratory environment', stage: 'Lab Proof' },
  { level: 5, label: 'TRL 5', description: 'Component or breadboard validation in relevant industrial environment', stage: 'System Prototype' },
  { level: 6, label: 'TRL 6', description: 'System or subsystem model/prototype demonstration in relevant environment', stage: 'System Prototype' },
  { level: 7, label: 'TRL 7', description: 'System prototype demonstration in operational environment', stage: 'System Prototype' },
  { level: 8, label: 'TRL 8', description: 'Actual system completed and qualified through test and demonstration', stage: 'Commercial Fab' },
  { level: 9, label: 'TRL 9', description: 'Actual system proven through successful mission operations in production', stage: 'Commercial Fab' },
];

interface TrlMaturityStepperProps {
  currentTrl?: string | number; // e.g. "TRL 6" or 6
  baselineValue?: string;
  targetValue?: string;
  frontierValue?: string;
  metricName?: string;
  metricUnit?: string;
  onSelectTrl?: (level: number) => void;
}

export const TrlMaturityStepper: React.FC<TrlMaturityStepperProps> = ({
  currentTrl = 'TRL 6',
  baselineValue = '12.4 kW/L',
  targetValue = '25.0 kW/L',
  frontierValue = '32.1 kW/L',
  metricName = 'Power Density',
  metricUnit = 'kW/L',
  onSelectTrl,
}) => {
  const parseTrlNumber = (val: string | number): number => {
    if (typeof val === 'number') return val;
    const match = String(val).match(/\d+/);
    return match ? parseInt(match[0], 10) : 6;
  };

  const activeLevel = parseTrlNumber(currentTrl);
  const [hoveredStep, setHoveredStep] = useState<TrlStep | null>(null);

  const selectedStep = hoveredStep || TRL_STAGES.find((s) => s.level === activeLevel) || TRL_STAGES[5];

  return (
    <div className="bg-white border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs relative overflow-hidden">
      <CarthageCornerMotif className="w-8 h-8 absolute top-2 right-2 opacity-40 text-[#8C6527]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE3D7]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LivePulseBeacon color="gold" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C6527]">
              Technology Readiness Level (TRL 1–9)
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-[#0F2038]">
            Maturity Stepper &amp; Parameter Target Envelope
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold bg-[#FAF8F5] text-[#0F2038] border border-[#D5C8B5]">
            Active Status: TRL {activeLevel}
          </span>
          <span className="px-2 py-1 rounded-lg font-mono text-xs font-semibold bg-[#EFE9DF] text-[#8C6527] border border-[#D5C8B5]">
            {selectedStep.stage}
          </span>
        </div>
      </div>

      {/* TRL Stepper Bar */}
      <div className="space-y-3">
        <div className="relative pt-2">
          {/* Connecting Line */}
          <div className="absolute top-6 left-4 right-4 h-1 bg-[#E5DDD0] rounded-full z-0" />
          <div
            className="absolute top-6 left-4 h-1 bg-[#8C6527] rounded-full z-0 transition-all duration-500"
            style={{ width: `${((activeLevel - 1) / 8) * 100}%` }}
          />

          {/* Stepper Nodes */}
          <div className="relative z-10 flex items-center justify-between">
            {TRL_STAGES.map((step) => {
              const isPassed = step.level <= activeLevel;
              const isCurrent = step.level === activeLevel;

              return (
                <button
                  key={step.level}
                  type="button"
                  onClick={() => onSelectTrl && onSelectTrl(step.level)}
                  onMouseEnter={() => setHoveredStep(step)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#0F2038] text-white ring-4 ring-[#D5C8B5] shadow-md scale-110'
                        : isPassed
                        ? 'bg-[#8C6527] text-white shadow-2xs'
                        : 'bg-[#FAF8F5] text-[#718096] border border-[#E5DDD0] hover:border-[#8C6527]'
                    }`}
                  >
                    {step.level}
                  </div>
                  <span
                    className={`text-[10px] font-mono mt-1.5 transition-colors hidden sm:block ${
                      isCurrent ? 'font-bold text-[#0F2038]' : isPassed ? 'text-[#8C6527]' : 'text-[#718096]'
                    }`}
                  >
                    TRL {step.level}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hovered / Selected Step Details */}
        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] flex items-start gap-3 text-xs">
          <Info className="w-4 h-4 text-[#8C6527] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-serif font-bold text-[#0F2038] flex items-center gap-2">
              <span>TRL {selectedStep.level} — {selectedStep.label}</span>
              <span className="text-[10px] font-mono text-[#8C6527] bg-white px-1.5 py-0.2 rounded border border-[#E5DDD0]">
                {selectedStep.stage}
              </span>
            </div>
            <p className="text-[#5A6E85] leading-relaxed">{selectedStep.description}</p>
          </div>
        </div>
      </div>

      {/* Parameter Envelope Visual Range Box */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-serif font-bold text-[#0F2038]">
            {metricName} Envelope ({metricUnit})
          </span>
          <span className="font-mono text-[10px] text-[#718096]">
            Empirical Range Comparison
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#E5DDD0] space-y-1">
            <span className="text-[10px] font-mono text-[#718096] uppercase tracking-wider block">
              Baseline System
            </span>
            <span className="text-base font-mono font-bold text-[#0F2038] block">
              {baselineValue}
            </span>
            <span className="text-[10px] text-[#718096] block">Current Production Spec</span>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#D5C8B5] space-y-1 relative">
            <span className="text-[10px] font-mono text-[#8C6527] font-bold uppercase tracking-wider block">
              Target Envelope
            </span>
            <span className="text-base font-mono font-bold text-[#0F2038] block">
              {targetValue}
            </span>
            <span className="text-[10px] text-[#8C6527] font-medium block">Project Requirement</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0F2038] text-white space-y-1 relative overflow-hidden">
            <CarthageCornerMotif className="w-5 h-5 absolute top-1 right-1 opacity-30 text-[#C5A880]" />
            <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider block font-bold">
              Global Frontier
            </span>
            <span className="text-base font-mono font-bold text-white block">
              {frontierValue}
            </span>
            <span className="text-[10px] text-slate-300 block">World Best Literature</span>
          </div>
        </div>
      </div>
    </div>
  );
};
