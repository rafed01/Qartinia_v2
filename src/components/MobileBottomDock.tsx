import React, { useState } from 'react';
import { QartiniaSection } from '../types/qartinia';
import {
  Compass,
  Lock,
  Network,
  Cpu,
  MoreHorizontal,
  FlaskConical,
  GraduationCap,
  Activity,
  Lightbulb,
  Building2,
  FileText,
  X,
  Sparkles,
} from 'lucide-react';
import { CarthageCornerMotif, LivePulseBeacon, DropdownTranslucentWatermark } from './CarthageArtwork';

interface MobileBottomDockProps {
  activeSection: QartiniaSection;
  onSelectSection: (section: QartiniaSection) => void;
  onOpenDossier?: () => void;
  onOpenCommandPalette?: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  activeSection,
  onSelectSection,
  onOpenDossier,
  onOpenCommandPalette,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const mainItems: { id: QartiniaSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Workspace', icon: Compass },
    { id: 'frontier', label: 'Frontier', icon: Cpu },
    { id: 'projects', label: 'Projects', icon: Lock },
    { id: 'evidence', label: 'Evidence', icon: Network },
  ];

  const secondaryItems: { id: QartiniaSection; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    { id: 'suppliers', label: 'Suppliers & Fabs', icon: Building2, desc: '8-inch SiC/GaN Foundry Database' },
    { id: 'laboratories', label: 'Laboratories', icon: FlaskConical, desc: 'ISO 17025 Test Benches & Dynos' },
    { id: 'experts', label: 'Domain Experts', icon: GraduationCap, desc: 'Peer-reviewed Academic Advisors' },
    { id: 'simulations', label: 'Simulation Studio', icon: Activity, desc: 'TCAD & ANSYS Thermal Solvers' },
    { id: 'brainstorming', label: 'Brainstorming', icon: Lightbulb, desc: 'Patent Prior Art & Whiteboards' },
    { id: 'architecture', label: 'Architecture', icon: Compass, desc: 'Punic Security & Escrow Model' },
  ];

  return (
    <>
      {/* Floating Bottom Dock (Mobile & Tablet: visible up to md breakpoint) */}
      <div className="md:hidden fixed bottom-4 left-3 right-3 z-40 pointer-events-auto">
        <div className="bg-[#0F2038]/90 backdrop-blur-xl border border-[#C5A880]/40 rounded-2xl p-1.5 shadow-2xl flex items-center justify-around relative overflow-hidden">
          {/* Subtle Watermark BG */}
          <DropdownTranslucentWatermark />

          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectSection(item.id);
                  setSheetOpen(false);
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all relative select-none active:scale-95 ${
                  isActive
                    ? 'bg-[#8C6527]/30 text-[#FFF8EB] font-bold border border-[#C5A880]/50 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A880]' : 'text-slate-400'}`} />
                <span className="text-[10px] tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C5A880] shadow-[0_0_8px_#C5A880]" />
                )}
              </button>
            );
          })}

          {/* More Trigger */}
          <button
            type="button"
            onClick={() => setSheetOpen(!sheetOpen)}
            className={`py-1.5 px-3 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all select-none active:scale-95 ${
              sheetOpen
                ? 'bg-[#C5A880] text-[#0F2038] font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </div>
      </div>

      {/* Slide-Up Mobile Sheet Modal */}
      {sheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0F2038]/60 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet Body */}
          <div className="relative z-10 bg-[#FAF8F5] border-t-2 border-[#8C6527] rounded-t-3xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <CarthageCornerMotif className="w-8 h-8 absolute top-2 right-2 opacity-30 text-[#8C6527]" />
            
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-[#D5C8B5] rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD0] mb-4">
              <div className="flex items-center gap-2">
                <LivePulseBeacon color="gold" />
                <span className="font-serif font-bold text-[#0F2038] text-sm tracking-wide">
                  Qartinia Intelligence Hubs
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="p-1.5 rounded-full bg-[#EBE3D7] text-[#0F2038] hover:bg-[#D5C8B5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hub Links Grid */}
            <div className="grid grid-cols-1 gap-2.5 mb-6">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectSection(item.id);
                      setSheetOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all active:scale-[0.99] ${
                      isActive
                        ? 'bg-[#0F2038] text-white border-[#8C6527] shadow-lg'
                        : 'bg-white border-[#E5DDD0] text-[#0F2038] hover:border-[#D5C8B5] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isActive ? 'bg-[#8C6527] text-white' : 'bg-[#FAF8F5] text-[#8C6527] border border-[#EBE3D7]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-wide flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {isActive && <span className="text-[10px] font-mono text-[#C5A880] uppercase">Active</span>}
                      </div>
                      <div className={`text-[11px] mt-0.5 ${isActive ? 'text-slate-300' : 'text-[#718096]'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Executive Action Button */}
            {onOpenDossier && (
              <button
                type="button"
                onClick={() => {
                  setSheetOpen(false);
                  onOpenDossier();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0F2038] to-[#1A365D] text-white font-serif font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg border border-[#8C6527]"
              >
                <FileText className="w-4 h-4 text-[#C5A880]" />
                <span>Open Executive Dossier</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
