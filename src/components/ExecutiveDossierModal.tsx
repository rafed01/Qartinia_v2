import React, { useRef } from 'react';
import { UserAccount, ProtectedProjectRoom, FrontierBenchmark, EvidenceNode } from '../types/qartinia';
import { X, Printer, Download, ShieldCheck, Lock, FileText, CheckCircle2, Award, QrCode } from 'lucide-react';
import { QartiniaCrestSvg, QartiniaLogo } from './QartiniaLogo';
import { CarthageHarborPanorama, CarthageCornerMotif, ColumnsWatermark, PunicFiligreeDivider } from './CarthageArtwork';

interface ExecutiveDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  project?: ProtectedProjectRoom | null;
  frontier?: FrontierBenchmark | null;
  evidenceNodes?: EvidenceNode[];
}

export const ExecutiveDossierModal: React.FC<ExecutiveDossierModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  project,
  frontier,
  evidenceNodes = [],
}) => {
  const dossierRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0F2038]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#D5C8B5] rounded-2xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl my-6 space-y-6 relative overflow-hidden max-h-[92vh] flex flex-col">
        {/* Floating Action Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D7] shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold bg-[#0F2038] text-white">
              Executive Briefing Dossier
            </span>
            <span className="text-xs text-[#5A6E85] font-mono hidden sm:inline">
              Ref ID: QR-DOSSIER-2026-X
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white text-[#0F2038] border border-[#D5C8B5] hover:bg-[#FAF8F5] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#8C6527]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#5A6E85] hover:text-[#0F2038] hover:bg-white rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Document Content Container (Printable Area) */}
        <div
          ref={dossierRef}
          className="bg-white border border-[#E5DDD0] rounded-xl p-6 sm:p-10 space-y-8 overflow-y-auto relative shadow-sm text-[#0F2038]"
        >
          <CarthageCornerMotif className="w-10 h-10 absolute top-3 right-3 opacity-30 text-[#8C6527]" />
          <ColumnsWatermark className="w-64 h-64 absolute -right-12 -bottom-12 opacity-[0.06] text-[#0F2038]" />

          {/* 1. Dossier Official Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b-2 border-[#0F2038] relative z-10">
            <div className="space-y-2">
              <QartiniaLogo height={36} />
              <p className="text-xs font-mono text-[#8C6527] uppercase tracking-wider font-bold">
                Deep-Tech Intelligence &amp; IP Escrow Consortium
              </p>
            </div>

            <div className="text-left sm:text-right text-xs font-mono space-y-0.5 text-[#5A6E85]">
              <div><strong className="text-[#0F2038]">Date:</strong> {currentDate}</div>
              <div><strong className="text-[#0F2038]">Security Level:</strong> RESTRICTED / NDA</div>
              <div><strong className="text-[#0F2038]">Consortium Tier:</strong> Tier 1 Verified</div>
            </div>
          </div>

          {/* 2. Executive Overview Subject Box */}
          <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C6527]">
                Project &amp; Research Portfolio Briefing
              </span>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#0F2038] text-white">
                VERIFIED PROVENANCE
              </span>
            </div>

            <h1 className="font-serif text-2xl font-bold text-[#0F2038]">
              {project?.title || frontier?.title || 'Qartinia Deep-Tech System Evaluation Dossier'}
            </h1>

            <p className="text-xs text-[#5A6E85] leading-relaxed">
              {project?.problemStatement || frontier?.gapRootCauseAnalysis || 'This executive briefing summarizes technical benchmarks, NDA-protected project milestones, supplier component validation, and literature evidence nodes compiled under the Qartinia condition-aware framework.'}
            </p>

            <PunicFiligreeDivider />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
              <div>
                <span className="text-[10px] text-[#718096] block">Domain</span>
                <strong className="text-[#0F2038]">{project?.domain || frontier?.domain || 'Power Electronics'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#718096] block">Legal Stage</span>
                <strong className="text-[#8C6527]">{project?.legalStage || 'Mutual NDA Executed'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#718096] block">TRL Maturity</span>
                <strong className="text-[#0F2038]">{frontier?.maturityTrl || 'TRL 6 Prototype'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#718096] block">Audited Author</span>
                <strong className="text-[#0F2038]">{currentUser?.fullName || 'Verified Member'}</strong>
              </div>
            </div>
          </div>

          {/* 3. Detailed Empirical Metrics & Milestones */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#0F2038] pb-1 border-b border-[#E5DDD0]">
              Empirical Performance &amp; Governance Schedule
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-[#E5DDD0] space-y-2 bg-white">
                <span className="font-mono text-[10px] font-bold text-[#8C6527] uppercase block">
                  Operating Envelope &amp; Performance
                </span>
                <div className="space-y-1 text-[#0F2038]">
                  <div><strong>Primary Metric:</strong> {frontier?.metricName || 'Power Density'}</div>
                  <div><strong>Target Value:</strong> {frontier?.targetValue || '25.0 kW/L'}</div>
                  <div><strong>Operating Envelope:</strong> {frontier?.operatingEnvelope || '1200V / 150°C Junction / 200kHz'}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E5DDD0] space-y-2 bg-white">
                <span className="font-mono text-[10px] font-bold text-[#8C6527] uppercase block">
                  IP Escrow &amp; Partner Access Scope
                </span>
                <div className="space-y-1 text-[#0F2038]">
                  <div><strong>Lead Organization:</strong> {currentUser?.organizationName || 'Deep-Tech Consortium'}</div>
                  <div><strong>Escrow Status:</strong> Active &amp; Persisted</div>
                  <div><strong>Audit Trail:</strong> Full Log Hash Sealed</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Literature & Evidence Provenance Table */}
          {evidenceNodes.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#0F2038] pb-1 border-b border-[#E5DDD0]">
                Linked Evidence Node Provenance ({evidenceNodes.length})
              </h2>

              <div className="border border-[#E5DDD0] rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#E5DDD0] font-mono text-[10px] uppercase font-bold text-[#8C6527]">
                      <th className="py-2.5 px-3">Title &amp; Source</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Performance Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE3D7]">
                    {evidenceNodes.slice(0, 4).map((node) => (
                      <tr key={node.id}>
                        <td className="py-2.5 px-3 font-semibold text-[#0F2038]">{node.title}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#8C6527]">{node.category}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#5A6E85]">{node.demonstratedPerformance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Official Verification Stamp & Signature Block */}
          <div className="pt-6 border-t-2 border-[#0F2038] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#D5C8B5] flex items-center justify-center text-[#8C6527]">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="space-y-0.5 text-[10px] text-[#718096]">
                <div className="font-bold text-[#0F2038]">QARTINIA IP PROVENANCE SEAL</div>
                <div>Hash: 0x8F90...41A3B</div>
                <div>Digital Audit Timestamp Validated</div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="h-8 border-b border-[#0F2038] min-w-[200px] flex items-end justify-center font-serif italic text-sm text-[#0F2038]">
                {currentUser?.fullName || 'Consortium Executive Principal'}
              </div>
              <div className="text-[10px] text-[#718096] uppercase">Authorized Executive Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
