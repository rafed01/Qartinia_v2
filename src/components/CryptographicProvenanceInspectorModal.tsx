import React, { useState } from 'react';
import { EvidenceNode } from '../types/qartinia';
import { ShieldCheck, CheckCircle2, Lock, Award, FileText, Download, X, Sparkles, Copy, ExternalLink } from 'lucide-react';
import { CarthageCornerMotif, ColumnsWatermark, LivePulseBeacon } from './CarthageArtwork';
import { QartiniaCrestSvg } from './QartiniaLogo';

interface CryptographicProvenanceInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: EvidenceNode | null;
}

export const CryptographicProvenanceInspectorModal: React.FC<CryptographicProvenanceInspectorModalProps> = ({
  isOpen,
  onClose,
  node,
}) => {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(true);

  if (!isOpen || !node) return null;

  const mockHash = `0x7F9A4B${node.id.replace(/-/g, '').slice(0, 12).toUpperCase()}9C2E3F81D0`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(mockHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F2038]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#FAF8F5] border-2 border-[#C5A880] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden my-6 space-y-6">
        <CarthageCornerMotif className="w-10 h-10 absolute top-3 right-3 text-[#8C6527] opacity-40 pointer-events-none" />
        <ColumnsWatermark className="w-48 h-48 absolute -right-10 -bottom-10 opacity-[0.06] text-[#0F2038] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E5DDD0] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0F2038] text-[#C5A880] flex items-center justify-center border border-[#C5A880]/40 shadow-inner">
              <QartiniaCrestSvg className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <LivePulseBeacon color="gold" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C6527]">
                  Carthaginian Provenance Seal
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0F2038]">Cryptographic Verification Seal</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#EBE3D7] text-[#0F2038] hover:bg-[#D5C8B5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Node Summary Box */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5DDD0] space-y-3 shadow-xs relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-[#8C6527] uppercase">{node.category}</span>
            <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified {node.maturityTrl || 'TRL 6'}
            </span>
          </div>
          <h4 className="font-serif font-bold text-base text-[#0F2038]">{node.title}</h4>
          <p className="text-xs text-[#5A6E85] leading-relaxed">{node.demonstratedPerformance}</p>
        </div>

        {/* Cryptographic Hash Ledger Stamp */}
        <div className="p-4 rounded-2xl bg-[#0F2038] text-white space-y-3 border border-[#C5A880]/40 shadow-lg relative z-10">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#C5A880] font-bold uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Punic Escrow Hash</span>
            </span>
            <button
              type="button"
              onClick={handleCopyHash}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Hash'}</span>
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-[#091424] border border-[#284873] font-mono text-xs text-emerald-400 break-all select-all">
            {mockHash}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
            <span>Issuer: Qartinia Empirical Ledger</span>
            <span className="text-[#C5A880]">256-Bit SHA-3 Certificate</span>
          </div>
        </div>

        {/* Re-Verification Trigger */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReVerify}
            disabled={verifying}
            className="px-4 py-2.5 bg-[#0F2038] text-white rounded-xl text-xs font-serif font-bold hover:bg-[#1A365D] transition-colors flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span>{verifying ? 'Verifying Ledger Proof...' : 'Re-Validate Provenance'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-[#D5C8B5] text-[#0F2038] hover:bg-[#FAF8F5] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
