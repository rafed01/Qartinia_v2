import React, { useState, useEffect } from 'react';
import { FrontierBenchmark, EvidenceNode, UserAccount } from '../types/qartinia';
import { getUserPermissions } from '../utils/permissions';
import {
  Compass,
  RefreshCw,
  Lock,
  BookmarkPlus,
  Check,
  Trash2,
  Download,
  ShieldAlert,
  ShieldCheck,
  Edit3,
  X,
  Sparkles,
  ExternalLink,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { AstrolabeWatermark, WavesWatermark, CarthageCornerMotif, LivePulseBeacon } from './CarthageArtwork';
import { TrlMaturityStepper } from './TrlMaturityStepper';
import { FileText } from 'lucide-react';

interface FrontierEngineViewProps {
  frontiers: FrontierBenchmark[];
  activeFrontierId: string | null;
  currentUser?: UserAccount | null;
  onSelectFrontier: (id: string) => void;
  onRunFrontierAnalysis: (payload: {
    title: string;
    domain: string;
    technologySystem: string;
    metricName: string;
    metricUnit: string;
    customerValue: string;
    targetValue: string;
    operatingEnvelope: string;
    constraints: string;
  }) => Promise<FrontierBenchmark>;
  onReevaluateFrontier: (frontierId: string) => Promise<void>;
  onDeleteFrontier: (frontierId: string) => Promise<void>;
  onUpdateFrontier?: (frontierId: string, updates: Partial<FrontierBenchmark>) => Promise<void>;
  onSaveEvidenceNode: (node: EvidenceNode) => Promise<void>;
  onLaunchProjectFromFrontier: (frontier: FrontierBenchmark, selectedEvidence?: EvidenceNode) => void;
  onOpenExecutiveDossier?: () => void;
}

export const FrontierEngineView: React.FC<FrontierEngineViewProps> = ({
  frontiers,
  activeFrontierId,
  currentUser,
  onSelectFrontier,
  onRunFrontierAnalysis,
  onReevaluateFrontier,
  onDeleteFrontier,
  onUpdateFrontier,
  onSaveEvidenceNode,
  onLaunchProjectFromFrontier,
  onOpenExecutiveDossier,
}) => {
  const permissions = getUserPermissions(currentUser || null);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [technologySystem, setTechnologySystem] = useState('');
  const [metricName, setMetricName] = useState('');
  const [metricUnit, setMetricUnit] = useState('');
  const [customerValue, setCustomerValue] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [operatingEnvelope, setOperatingEnvelope] = useState('');
  const [constraints, setConstraints] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isReevaluating, setIsReevaluating] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Edit Frontier Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDomain, setEditDomain] = useState('');
  const [editTechnologySystem, setEditTechnologySystem] = useState('');
  const [editMetricName, setEditMetricName] = useState('');
  const [editMetricUnit, setEditMetricUnit] = useState('');
  const [editOperatingEnvelope, setEditOperatingEnvelope] = useState('');
  const [editGapAnalysis, setEditGapAnalysis] = useState('');
  const [editMaturityTrl, setEditMaturityTrl] = useState('');

  const selectedFrontier =
    frontiers.find((f) => f.id === activeFrontierId) || frontiers[0] || null;

  useEffect(() => {
    if (selectedFrontier) {
      setEditTitle(selectedFrontier.title || '');
      setEditDomain(selectedFrontier.domain || '');
      setEditTechnologySystem(selectedFrontier.technologySystem || '');
      setEditMetricName(selectedFrontier.metricName || '');
      setEditMetricUnit(selectedFrontier.metricUnit || '');
      setEditOperatingEnvelope(selectedFrontier.operatingEnvelope || '');
      setEditGapAnalysis(selectedFrontier.gapRootCauseAnalysis || '');
      setEditMaturityTrl(selectedFrontier.maturityTrl || 'TRL 6');
    }
  }, [selectedFrontier]);

  const handleOpenEditModal = () => {
    if (!selectedFrontier) return;
    setEditTitle(selectedFrontier.title || '');
    setEditDomain(selectedFrontier.domain || '');
    setEditTechnologySystem(selectedFrontier.technologySystem || '');
    setEditMetricName(selectedFrontier.metricName || '');
    setEditMetricUnit(selectedFrontier.metricUnit || '');
    setEditOperatingEnvelope(selectedFrontier.operatingEnvelope || '');
    setEditGapAnalysis(selectedFrontier.gapRootCauseAnalysis || '');
    setEditMaturityTrl(selectedFrontier.maturityTrl || 'TRL 6');
    setIsEditModalOpen(true);
  };

  const handleSaveFrontierEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFrontier || !onUpdateFrontier) return;
    setIsSavingEdit(true);
    try {
      await onUpdateFrontier(selectedFrontier.id, {
        title: editTitle.trim(),
        domain: editDomain.trim(),
        technologySystem: editTechnologySystem.trim(),
        metricName: editMetricName.trim(),
        metricUnit: editMetricUnit.trim(),
        operatingEnvelope: editOperatingEnvelope.trim(),
        gapRootCauseAnalysis: editGapAnalysis.trim(),
        maturityTrl: editMaturityTrl.trim(),
      });
      setIsEditModalOpen(false);
      setSavedNotice('Frontier benchmark updated successfully.');
      setTimeout(() => setSavedNotice(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update frontier benchmark.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!technologySystem.trim() || !customerValue.trim() || !targetValue.trim()) {
      setError('Please enter your technology system, current performance value, and target ambition.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const created = await onRunFrontierAnalysis({
        title: title.trim() || `${technologySystem.trim()} Frontier Analysis`,
        domain: domain.trim() || 'Deep-Tech Engineering',
        technologySystem: technologySystem.trim(),
        metricName: metricName.trim() || 'Primary Performance Metric',
        metricUnit: metricUnit.trim(),
        customerValue: customerValue.trim(),
        targetValue: targetValue.trim(),
        operatingEnvelope: operatingEnvelope.trim(),
        constraints: constraints.trim(),
      });
      if (created?.id) {
        onSelectFrontier(created.id);
      }
      setTitle('');
      setDomain('');
      setTechnologySystem('');
      setMetricName('');
      setMetricUnit('');
      setCustomerValue('');
      setTargetValue('');
      setOperatingEnvelope('');
      setConstraints('');
    } catch (err: any) {
      setError(err.message || 'Failed to compute condition-aware frontier benchmark.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReevaluate = async (id: string) => {
    setIsReevaluating(true);
    setError(null);
    try {
      await onReevaluateFrontier(id);
      setSavedNotice('Frontier re-evaluated against latest technical and research evidence.');
      setTimeout(() => setSavedNotice(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to re-evaluate frontier.');
    } finally {
      setIsReevaluating(false);
    }
  };

  const handleSaveEvidence = async (node: EvidenceNode) => {
    await onSaveEvidenceNode(node);
    setSavedNotice(`Saved "${node.title}" to the Structured Evidence Graph.`);
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div className="max-w-[1500px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <section className="bg-white border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xs relative overflow-hidden">
        <CarthageCornerMotif className="w-8 h-8 absolute top-2 right-2 pointer-events-none opacity-40 text-[#8C6527]" />
        <AstrolabeWatermark className="w-64 h-64 absolute -right-12 -bottom-12 pointer-events-none opacity-[0.08] text-[#8C6527]" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-bold tracking-wider text-[#8C6527] uppercase font-mono flex items-center gap-2">
              <LivePulseBeacon color="gold" />
              <span>Qartinia Frontier · Condition-Aware Intelligence Engine</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F2038] tracking-tight">
              Know where your technology stands — and when the world moves.
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed">
              Define your technology system, operating envelope, industrial constraints, and performance target. Qartinia structures empirical evidence from literature, patents, and commercial datasheets into verified frontier comparisons.
            </p>
          </div>

          {onOpenExecutiveDossier && (
            <button
              type="button"
              onClick={onOpenExecutiveDossier}
              className="px-4 py-2.5 bg-[#0F2038] text-white hover:bg-[#1A365D] text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-xs shrink-0 self-start md:self-end"
            >
              <FileText className="w-4 h-4 text-[#C5A880]" />
              <span>Executive Briefing Dossier</span>
            </button>
          )}
        </div>
      </section>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs sm:text-sm text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{savedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSavedNotice(null)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-900 shadow-2xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Engineering Specification & Monitored Frontiers */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs"
          >
            <div className="pb-3 border-b border-[#EBE3D7]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8C6527] uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#8C6527]" />
                <span>Engineering Specification</span>
              </div>
              <h2 className="font-serif text-lg font-bold text-[#0F2038] mt-1">
                Define Technology & Operating Envelope
              </h2>
              <p className="text-xs text-[#5A6E85] mt-0.5">
                All frontier comparisons are strictly normalized against your stated physical operating conditions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Engineering Domain
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. Power Electronics"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Benchmark Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. GaN Inverter Analysis"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                Current Technology / System Architecture *
              </label>
              <input
                type="text"
                required
                value={technologySystem}
                onChange={(e) => setTechnologySystem(e.target.value)}
                placeholder="Describe your device, material, circuit, or process architecture"
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Primary Metric Name *
                </label>
                <input
                  type="text"
                  required
                  value={metricName}
                  onChange={(e) => setMetricName(e.target.value)}
                  placeholder="e.g. Power Density"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Metric Unit
                </label>
                <input
                  type="text"
                  value={metricUnit}
                  onChange={(e) => setMetricUnit(e.target.value)}
                  placeholder="e.g. kW/L"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Customer Baseline Today *
                </label>
                <input
                  type="text"
                  required
                  value={customerValue}
                  onChange={(e) => setCustomerValue(e.target.value)}
                  placeholder="Current value"
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Target Ambition *
                </label>
                <input
                  type="text"
                  required
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="Target spec"
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                Operating Envelope (Temperature, Voltage, Frequency, Medium) *
              </label>
              <textarea
                rows={2}
                required
                value={operatingEnvelope}
                onChange={(e) => setOperatingEnvelope(e.target.value)}
                placeholder="Specify the physical and environmental operating conditions required"
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                Industrial Constraints (Reliability, Cost, Packaging, Standards) *
              </label>
              <textarea
                rows={2}
                required
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="Specify qualification standards, packaging limits, or cost boundaries"
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              <Compass className={`w-4 h-4 text-[#C5A880] ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>
                {isAnalyzing
                  ? 'Structuring External Evidence & Computing Frontiers...'
                  : 'Compute Condition-Aware Frontier Benchmark'}
              </span>
            </button>
          </form>

          {/* Monitored Frontiers List */}
          <div className="bg-white border border-[#E5DDD0] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D7]">
              <h3 className="text-xs font-bold text-[#8C6527] uppercase tracking-wider font-mono">
                Live Monitored Frontiers ({frontiers.length})
              </h3>
            </div>
            {frontiers.length === 0 ? (
              <p className="text-xs text-[#5A6E85] leading-relaxed py-3 text-center">
                No frontier benchmarks recorded yet. Submit an engineering specification above to establish your first monitored frontier.
              </p>
            ) : (
              <div className="space-y-2.5">
                {frontiers.map((item) => {
                  const isSelected = selectedFrontier?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectFrontier(item.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') onSelectFrontier(item.id);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FAF4EB] border-[#8C6527] text-[#0F2038] shadow-2xs ring-1 ring-[#8C6527]/30'
                          : 'bg-[#FAF8F5] border-[#E5DDD0] text-[#0F2038] hover:border-[#D5C8B5] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#5A6E85] mb-1">
                        <span className="font-medium text-[#8C6527]">{item.domain}</span>
                        <span className="font-mono tabular-nums">{item.lastEvaluatedAt}</span>
                      </div>
                      <div className="text-sm font-serif font-bold text-[#0F2038]">{item.title}</div>
                      <div className="text-xs text-[#5A6E85] mt-1 truncate">
                        {item.technologySystem} · {item.metricName}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Condition-Aware Frontier Output & Evidence Records */}
        <div className="lg:col-span-7">
          {isAnalyzing ? (
            <div className="bg-white border border-[#E5DDD0] rounded-2xl p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono text-[#8C6527]">
                <RefreshCw className="w-4 h-4 animate-spin text-[#8C6527]" />
                <span>Qartinia Frontier Engine · Evaluating comparable operating envelopes across scientific publications, patents & commercial datasheets...</span>
              </div>
              <div className="h-6 w-2/3 bg-[#F5EFEB] rounded-lg animate-pulse" />
              <div className="h-36 w-full bg-[#FAF8F5] rounded-xl animate-pulse" />
              <div className="h-28 w-full bg-[#FAF8F5] rounded-xl animate-pulse" />
            </div>
          ) : selectedFrontier ? (
            <div className="space-y-6">
              {/* Frontier Header Card */}
              <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 space-y-5 shadow-xs">
                {/* Analysis Mode & Verification Boundary Banner */}
                {selectedFrontier.analysisMode === 'grounded_retrieval' ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-900">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-800 flex items-center gap-2">
                        <span>GROUNDED CATALOG &amp; LITERATURE EVIDENCE ANALYSIS</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300">
                          Source-Backed
                        </span>
                      </div>
                      <p className="text-emerald-700 mt-0.5 leading-relaxed">
                        This benchmark is directly backed by verified empirical catalog records, peer-reviewed literature, and validated supplier datasheets under comparable operating conditions.
                      </p>
                    </div>
                  </div>
                ) : selectedFrontier.analysisMode === 'ai_synthesis' ? (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-800 flex items-center gap-2">
                        <span>AI ENGINEERING SYNTHESIS &amp; MODEL ESTIMATE</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-mono font-bold border border-amber-300">
                          AI Synthesis
                        </span>
                      </div>
                      <p className="text-amber-700 mt-0.5 leading-relaxed">
                        This benchmark combines retrieved empirical references with AI synthesis and model estimates. Unverified estimates are explicitly marked and must be validated before industrial commitment.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3 text-xs text-orange-900">
                    <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-orange-800 flex items-center gap-2">
                        <span>UNVERIFIED PRELIMINARY ANALYSIS (RETRIEVAL OFFLINE)</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-orange-100 text-orange-800 font-mono font-bold border border-orange-300">
                          Unverified Estimate
                        </span>
                      </div>
                      <p className="text-orange-700 mt-0.5 leading-relaxed">
                        External literature retrieval service was unavailable. Commercial and research values are analytical model estimates, not certified empirical specifications.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EBE3D7]">
                  <div>
                    <div className="text-xs text-[#5A6E85] mb-1 flex items-center gap-2">
                      <span className="font-semibold text-[#8C6527]">{selectedFrontier.domain}</span>
                      <span>· Monitored Frontier · Last Evaluated: </span>
                      <span className="font-mono tabular-nums text-[#0F2038]">{selectedFrontier.lastEvaluatedAt}</span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-[#0F2038]">{selectedFrontier.title}</h2>
                    <p className="text-xs text-[#5A6E85] mt-1">
                      System: <strong className="text-[#0F2038]">{selectedFrontier.technologySystem}</strong> · Operating Envelope: {selectedFrontier.operatingEnvelope}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      type="button"
                      disabled={isReevaluating}
                      onClick={() => handleReevaluate(selectedFrontier.id)}
                      className="px-3 py-2 text-xs font-semibold text-[#0F2038] bg-white hover:bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-2xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#8C6527] ${isReevaluating ? 'animate-spin' : ''}`} />
                      <span>Re-Evaluate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onLaunchProjectFromFrontier(selectedFrontier)}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Open Protected Project</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3 py-2 text-xs font-semibold text-[#0F2038] bg-white hover:bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
                      title="Export or print executive benchmark report"
                    >
                      <Download className="w-3.5 h-3.5 text-[#5A6E85]" />
                      <span>Export</span>
                    </button>

                    {/* Edit Frontier Benchmark button */}
                    {permissions.canEditFrontier && onUpdateFrontier && (
                      <button
                        type="button"
                        onClick={handleOpenEditModal}
                        aria-label="Edit Frontier Benchmark"
                        title="Edit Frontier Benchmark (Admin Only)"
                        className="px-3 py-2 text-xs font-semibold text-[#8C6527] bg-[#FAF4EB] hover:bg-[#F5EFEB] border border-[#D5C8B5] rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#8C6527]" />
                        <span>Edit</span>
                      </button>
                    )}

                    {/* Delete Frontier Benchmark button */}
                    {permissions.canDeleteFrontier && (
                      <button
                        type="button"
                        onClick={() => onDeleteFrontier(selectedFrontier.id)}
                        aria-label="Delete Frontier Benchmark"
                        title="Delete Frontier Benchmark (Admin Only)"
                        className="p-2 text-[#5A6E85] hover:text-rose-600 rounded-xl border border-[#E5DDD0] hover:bg-rose-50 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive TRL 1-9 Stepper & Target Envelope */}
                <TrlMaturityStepper
                  currentTrl={selectedFrontier.maturityTrl || 'TRL 6'}
                  baselineValue={selectedFrontier.customerBaselineValue || '12.4 kW/L'}
                  targetValue={selectedFrontier.targetValue || '25.0 kW/L'}
                  frontierValue={selectedFrontier.worldFrontierValue || '32.1 kW/L'}
                  metricName={selectedFrontier.metricName || 'Power Density'}
                  metricUnit={selectedFrontier.metricUnit || 'kW/L'}
                />

                {/* Condition-Aware Frontier Comparison Table */}
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-[#8C6527] uppercase font-mono mb-2.5">
                    CONDITION-AWARE FRONTIER POSITIONING ({selectedFrontier.metricName})
                  </h3>
                  <div className="overflow-x-auto border border-[#E5DDD0] rounded-xl bg-white shadow-2xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F5EFEB] border-b border-[#E5DDD0] text-[#0F2038]">
                          <th className="py-2.5 px-3 font-serif font-bold border-r border-[#E5DDD0]">Position</th>
                          <th className="py-2.5 px-3 font-serif font-bold border-r border-[#E5DDD0]">
                            {selectedFrontier.metricName}
                          </th>
                          <th className="py-2.5 px-3 font-serif font-bold border-r border-[#E5DDD0]">Meaning &amp; Context</th>
                          <th className="py-2.5 px-3 font-serif font-bold border-r border-[#E5DDD0]">Provenance</th>
                          <th className="py-2.5 px-3 font-serif font-bold border-r border-[#E5DDD0]">Evidence / Source</th>
                          <th className="py-2.5 px-3 font-serif font-bold">Envelope &amp; Disclosures</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5DDD0]">
                        {selectedFrontier.positions.map((row) => {
                          const isVerified = row.verificationStatus === 'verified' || row.provenanceType === 'source_backed';
                          const isEstimate = row.verificationStatus === 'unverified_estimate' || row.provenanceType === 'model_estimate';

                          return (
                            <tr key={row.position} className="hover:bg-[#FAF8F5] align-top transition-colors">
                              <td className="py-3 px-3 font-semibold text-[#0F2038] border-r border-[#E5DDD0] whitespace-nowrap">
                                <div>{row.position}</div>
                              </td>
                              <td className="py-3 px-3 font-mono tabular-nums font-bold text-[#0F2038] border-r border-[#E5DDD0] whitespace-nowrap">
                                {row.valueDisplay}
                              </td>
                              <td className="py-3 px-3 text-[#5A6E85] border-r border-[#E5DDD0]">
                                {row.meaning}
                              </td>
                              <td className="py-3 px-3 border-r border-[#E5DDD0] whitespace-nowrap space-y-1">
                                <div>
                                  {row.provenanceType === 'source_backed' ? (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                      Source-Backed
                                    </span>
                                  ) : row.provenanceType === 'ai_synthesis' ? (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                      AI Synthesis
                                    </span>
                                  ) : row.provenanceType === 'model_estimate' ? (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-300">
                                      Model Estimate
                                    </span>
                                  ) : row.provenanceType === 'customer_baseline' ? (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-300">
                                      Customer Baseline
                                    </span>
                                  ) : (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-300">
                                      Customer Target
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px]">
                                  {isVerified ? (
                                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                      <Check className="w-3 h-3 text-emerald-600" /> Empirical Verified
                                    </span>
                                  ) : isEstimate ? (
                                    <span className="text-orange-700 font-medium flex items-center gap-1">
                                      <ShieldAlert className="w-3 h-3 text-orange-600" /> Unverified
                                    </span>
                                  ) : (
                                    <span className="text-[#5A6E85]">Customer Defined</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-xs text-[#0F2038] font-mono border-r border-[#E5DDD0] space-y-1">
                                <div className="font-semibold text-[#0F2038]">{row.referenceSource}</div>
                                {row.sourceIdentifier && (
                                  <div className="text-[10px] text-[#5A6E85]">Ref: {row.sourceIdentifier}</div>
                                )}
                                {row.sourceUrl && (
                                  <a
                                    href={row.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-[#8C6527] hover:underline flex items-center gap-0.5 mt-0.5 font-sans font-semibold"
                                  >
                                    <ExternalLink className="w-3 h-3" /> View Source
                                  </a>
                                )}
                              </td>
                              <td className="py-3 px-3 text-xs text-[#5A6E85] space-y-1">
                                {row.operatingConditions && (
                                  <div className="font-medium text-[#0F2038]">
                                    Conditions: {row.operatingConditions}
                                  </div>
                                )}
                                {row.comparabilityNotice && (
                                  <div className="text-[11px] text-[#5A6E85] bg-[#FAF8F5] p-1.5 rounded-lg border border-[#E5DDD0]">
                                    <strong className="text-[#0F2038]">Disclosures: </strong>
                                    {row.comparabilityNotice}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Comparability Assessment & Verification Boundary Callouts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] text-xs space-y-1">
                    <div className="font-bold text-[#0F2038] mb-1 flex items-center gap-1.5 font-serif">
                      <Info className="w-4 h-4 text-[#8C6527] shrink-0" />
                      <span>Condition &amp; Measurement Comparability Assessment</span>
                    </div>
                    <p className="text-[#5A6E85] leading-relaxed">
                      {selectedFrontier.comparabilityAssessment ||
                        'Evaluated across stated operating envelope. Operating condition boundaries, thermal limits, and measurement differences disclosed.'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-1">
                    <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5 font-serif">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Scientific Integrity &amp; Verification Boundary</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed">
                      {selectedFrontier.disclaimer ||
                        'Contains empirical literature references alongside AI synthesis. Model estimates are never presented as certified empirical commercial performance.'}
                    </p>
                  </div>
                </div>

                {/* Root-Cause Gap Explanation & Recent Frontier Movement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0]">
                    <div className="text-xs font-serif font-bold text-[#0F2038] mb-1">
                      What Causes the Gap (Physics &amp; Engineering Bottleneck)
                    </div>
                    <p className="text-xs text-[#5A6E85] leading-relaxed">
                      {selectedFrontier.gapRootCauseAnalysis}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0]">
                    <div className="text-xs font-serif font-bold text-[#0F2038] mb-1">
                      What Changed Recently on This Frontier
                    </div>
                    <p className="text-xs text-[#5A6E85] leading-relaxed">
                      {selectedFrontier.whatChangedRecently}
                    </p>
                  </div>
                </div>

                {/* Recommended Engineering Decisions */}
                {selectedFrontier.recommendedNextActions.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs font-bold text-[#8C6527] uppercase font-mono mb-2">
                      WHAT SHOULD WE DO NEXT? (RECOMMENDED EXECUTION PATH)
                    </div>
                    <ul className="space-y-1.5 text-xs text-[#5A6E85] list-disc pl-5">
                      {selectedFrontier.recommendedNextActions.map((act, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span className="text-[#0F2038]">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Comparable Evidence Records Behind Each Conclusion */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#0F2038]">
                    Technologies, Labs, Patents &amp; Researchers Closest to Closing the Gap ({selectedFrontier.evidenceRecords.length})
                  </h3>
                </div>

                {selectedFrontier.evidenceRecords.map((ev) => {
                  const isVerifiedEv = ev.verificationStatus === 'verified' || ev.provenanceType === 'verified_empirical' || ev.provenanceType === 'peer_reviewed_literature';
                  const isEstimateEv = ev.verificationStatus === 'unverified_estimate' || ev.provenanceType === 'model_estimate';

                  return (
                    <article
                      key={ev.id}
                      className="bg-white border border-[#E5DDD0] rounded-2xl p-5 hover:border-[#D5C8B5] hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A6E85]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-[#8C6527] font-semibold">{ev.category}</strong>
                          <span>· {ev.institutionOrCompany} · </span>
                          <span className="font-mono text-[#0F2038]">{ev.sourceIdentifier}</span>

                          {/* Provenance Badge */}
                          {ev.provenanceType === 'verified_empirical' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                              Verified Empirical
                            </span>
                          ) : ev.provenanceType === 'peer_reviewed_literature' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                              Peer-Reviewed Lit
                            </span>
                          ) : ev.provenanceType === 'patent_specification' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-300">
                              Patent Spec
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-300">
                              Model Estimate
                            </span>
                          )}

                          {/* Verification Badge */}
                          {isVerifiedEv ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" /> Verified Record
                            </span>
                          ) : isEstimateEv ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-orange-600" /> Unverified Estimate
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-3 font-mono text-xs">
                          {ev.retrievalDate && (
                            <span className="text-[#718096] text-[11px]">Date: {ev.retrievalDate}</span>
                          )}
                          <span className="tabular-nums font-semibold text-[#0F2038]">
                            {ev.maturityTrl} · {ev.demonstratedPerformance}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-base font-bold text-[#0F2038]">{ev.title}</h4>
                        {ev.sourceUrl && (
                          <a
                            href={ev.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-xs font-semibold text-[#8C6527] bg-[#FAF8F5] hover:bg-white border border-[#E5DDD0] rounded-lg flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Source Doc</span>
                          </a>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EBE3D7]">
                        <div>
                          <span className="text-[#5A6E85] block">Comparable Operating Conditions:</span>
                          <span className="font-medium text-[#0F2038]">{ev.operatingConditions}</span>
                        </div>
                        <div>
                          <span className="text-[#5A6E85] block">Manufacturability &amp; Reliability:</span>
                          <span className="font-medium text-[#0F2038]">
                            {ev.manufacturabilityAndReliability}
                          </span>
                        </div>
                      </div>

                      {ev.comparabilityNotice && (
                        <div className="text-xs text-[#5A6E85] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E5DDD0]">
                          <strong className="text-[#0F2038]">Envelope Comparability Disclosure: </strong>
                          {ev.comparabilityNotice}
                        </div>
                      )}

                      <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed">
                        <strong className="text-[#0F2038]">Relevance to Gap: </strong>
                        {ev.relevanceToGap}
                      </p>

                      {isEstimateEv && (
                        <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-orange-600 shrink-0" />
                          <span>
                            <strong>Unverified Estimate Notice:</strong> This evidence record is an analytical estimate. Physical test bench validation is required before committing to production targets.
                          </span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-[#EBE3D7] flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-[#5A6E85]">
                          Lead Researcher / Contact: <strong className="text-[#0F2038]">{ev.leadContributor}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveEvidence(ev)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#0F2038] hover:text-[#8C6527] border border-[#E5DDD0] bg-white rounded-xl hover:bg-[#FAF8F5] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5 text-[#8C6527]" />
                            <span>Save to Evidence Graph</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onLaunchProjectFromFrontier(selectedFrontier, ev)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>Start Protected Project</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E5DDD0] rounded-2xl p-10 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5DDD0] flex items-center justify-center mx-auto text-[#8C6527]">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#0F2038]">
                No Frontier Benchmark Selected
              </h2>
              <p className="text-sm text-[#5A6E85] max-w-lg mx-auto leading-relaxed">
                Enter your current technology, operating envelope, constraints, and target ambition in the specification panel on the left. Qartinia Frontier will compute the commercial frontier, the research frontier, what causes the gap, and the verified evidence to close it.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Window / Edit Frontier Benchmark Modal (Admin Only) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2038]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E5DDD0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#E5DDD0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FAF4EB] border border-[#D5C8B5] text-[#8C6527]">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0F2038]">
                    Edit Frontier Benchmark Standard
                  </h3>
                  <p className="text-[11px] text-[#5A6E85] font-mono">
                    Admin Privilege · Standard Ref: {selectedFrontier?.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFrontierEdit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block font-semibold text-[#0F2038] mb-1">Benchmark Standard Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] font-medium focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">Technology Domain</label>
                  <input
                    type="text"
                    required
                    value={editDomain}
                    onChange={(e) => setEditDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">Technology System</label>
                  <input
                    type="text"
                    required
                    value={editTechnologySystem}
                    onChange={(e) => setEditTechnologySystem(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">Primary Metric Name</label>
                  <input
                    type="text"
                    required
                    value={editMetricName}
                    onChange={(e) => setEditMetricName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] font-mono focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">Metric Unit</label>
                  <input
                    type="text"
                    value={editMetricUnit}
                    onChange={(e) => setEditMetricUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] font-mono focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">Maturity Stage</label>
                  <select
                    value={editMaturityTrl}
                    onChange={(e) => setEditMaturityTrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] font-medium focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  >
                    <option value="TRL 4">TRL 4 — Lab Validation</option>
                    <option value="TRL 5">TRL 5 — Relevant Environment</option>
                    <option value="TRL 6">TRL 6 — Prototype Verification</option>
                    <option value="TRL 7">TRL 7 — System Demonstration</option>
                    <option value="TRL 8">TRL 8 — Qualified Commercial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F2038] mb-1">Operating Envelope &amp; Conditions</label>
                <input
                  type="text"
                  value={editOperatingEnvelope}
                  onChange={(e) => setEditOperatingEnvelope(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  placeholder="e.g. 800V DC bus, 175°C junction temp, liquid cooling"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F2038] mb-1">
                  Gap Root Cause Analysis (Engineering Breakdown)
                </label>
                <textarea
                  rows={4}
                  value={editGapAnalysis}
                  onChange={(e) => setEditGapAnalysis(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] leading-relaxed focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  placeholder="Explain physical, materials, or topological bottleneck limiting current systems..."
                />
              </div>

              <div className="pt-4 border-t border-[#E5DDD0] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E5DDD0] text-[#5A6E85] font-semibold rounded-xl hover:bg-[#FAF8F5] hover:text-[#0F2038] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 bg-[#0F2038] text-white font-bold rounded-xl hover:bg-[#1A365D] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isSavingEdit ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Benchmark Standard</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
