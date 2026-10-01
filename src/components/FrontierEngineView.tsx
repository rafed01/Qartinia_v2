import React, { useState } from 'react';
import { FrontierBenchmark, EvidenceNode } from '../types/qartinia';
import { Compass, RefreshCw, Lock, BookmarkPlus, Check, Trash2 } from 'lucide-react';

interface FrontierEngineViewProps {
  frontiers: FrontierBenchmark[];
  activeFrontierId: string | null;
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
  onSaveEvidenceNode: (node: EvidenceNode) => Promise<void>;
  onLaunchProjectFromFrontier: (frontier: FrontierBenchmark, selectedEvidence?: EvidenceNode) => void;
}

export const FrontierEngineView: React.FC<FrontierEngineViewProps> = ({
  frontiers,
  activeFrontierId,
  onSelectFrontier,
  onRunFrontierAnalysis,
  onReevaluateFrontier,
  onDeleteFrontier,
  onSaveEvidenceNode,
  onLaunchProjectFromFrontier,
}) => {
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
  const [error, setError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const selectedFrontier =
    frontiers.find((f) => f.id === activeFrontierId) || frontiers[0] || null;

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
      onSelectFrontier(created.id);
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
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="pb-8 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-wider text-[#108548] mb-1.5">
            QARTINIA FRONTIER · CONDITION-AWARE INTELLIGENCE ENGINE
          </div>
          <h1 className="text-3xl font-bold text-[#0F2537] tracking-tight">
            Know where your technology stands — and when the world moves.
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Enter your current technology, operating envelope, constraints and target. Qartinia structures external evidence into comparable commercial and research frontiers.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-sm text-emerald-900">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-[#108548]" />
            <span>{savedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSavedNotice(null)}
            className="text-xs text-emerald-800 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Column: Engineering Specification & Frontier Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
          >
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F2537]">
                Define Customer Technology & Operating Envelope
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All frontier comparisons are evaluated strictly against your stated operating conditions and constraints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Engineering Domain
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter engineering domain"
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2537]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Benchmark Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter analysis reference title"
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2537]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                Current Technology / System Architecture *
              </label>
              <input
                type="text"
                required
                value={technologySystem}
                onChange={(e) => setTechnologySystem(e.target.value)}
                placeholder="Describe your device, material, circuit, or process architecture"
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2537]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Primary Performance Metric *
                </label>
                <input
                  type="text"
                  required
                  value={metricName}
                  onChange={(e) => setMetricName(e.target.value)}
                  placeholder="Metric name"
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2537]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Metric Unit
                </label>
                <input
                  type="text"
                  value={metricUnit}
                  onChange={(e) => setMetricUnit(e.target.value)}
                  placeholder="Unit symbol"
                  className="w-full px-3 py-2 text-sm font-mono bg-[#FAF9F6] border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2537]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Customer Technology Today *
                </label>
                <input
                  type="text"
                  required
                  value={customerValue}
                  onChange={(e) => setCustomerValue(e.target.value)}
                  placeholder="Current measured value"
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-[#FAF9F6] border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2537]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Target Ambition *
                </label>
                <input
                  type="text"
                  required
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="Target value"
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-[#FAF9F6] border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2537]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                Operating Envelope (Temperature, Voltage, Frequency, Medium, Substrate) *
              </label>
              <textarea
                rows={2}
                required
                value={operatingEnvelope}
                onChange={(e) => setOperatingEnvelope(e.target.value)}
                placeholder="Specify the physical and environmental operating conditions required"
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2537]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                Industrial Constraints (Manufacturability, Reliability, Cost, Packaging) *
              </label>
              <textarea
                rows={2}
                required
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="Specify qualification standards, volume manufacturing, or cost constraints"
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2537]"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Compass className="w-4 h-4 text-[#C59B47]" />
              <span>
                {isAnalyzing
                  ? 'Structuring External Evidence & Computing Frontiers...'
                  : 'Compute Condition-Aware Frontier Benchmark'}
              </span>
            </button>
          </form>

          {/* Monitored Frontiers List */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#0F2537] tracking-wide">
                LIVE MONITORED FRONTIERS ({frontiers.length})
              </h3>
            </div>
            {frontiers.length === 0 ? (
              <p className="text-xs text-slate-500 leading-relaxed">
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
                      className={`p-3.5 rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#FBF5EC] border-[#0F2537]'
                          : 'bg-[#FAF9F6] border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>{item.domain}</span>
                        <span className="font-mono tabular-nums">{item.lastEvaluatedAt}</span>
                      </div>
                      <div className="text-sm font-bold text-[#0F2537]">{item.title}</div>
                      <div className="text-xs text-slate-600 mt-1 truncate">
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
            <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
              <div className="text-xs font-mono text-[#108548]">
                Qartinia Frontier Engine · Evaluating comparable operating envelopes across scientific publications, patents & commercial datasheets...
              </div>
              <div className="h-6 w-2/3 bg-slate-200 rounded animate-pulse" />
              <div className="h-36 w-full bg-slate-100 rounded animate-pulse" />
              <div className="h-28 w-full bg-slate-100 rounded animate-pulse" />
            </div>
          ) : selectedFrontier ? (
            <div className="space-y-6">
              {/* Frontier Header Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      <span>{selectedFrontier.domain}</span>
                      <span> · Monitored Frontier · Last Evaluated: </span>
                      <span className="font-mono tabular-nums">{selectedFrontier.lastEvaluatedAt}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#0F2537]">{selectedFrontier.title}</h2>
                    <p className="text-xs text-slate-600 mt-1">
                      System: <strong className="text-[#0F2537]">{selectedFrontier.technologySystem}</strong> · Operating Envelope: {selectedFrontier.operatingEnvelope}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isReevaluating}
                      onClick={() => handleReevaluate(selectedFrontier.id)}
                      className="px-3 py-2 text-xs font-semibold text-[#0F2537] bg-[#F2F4F8] hover:bg-slate-200 border border-[#DCE2EC] rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isReevaluating ? 'animate-spin' : ''}`} />
                      <span>Re-Evaluate Frontier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onLaunchProjectFromFrontier(selectedFrontier)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2537] hover:bg-[#16344D] rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#C59B47]" />
                      <span>Open Protected Project</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteFrontier(selectedFrontier.id)}
                      aria-label="Delete Frontier Benchmark"
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Condition-Aware Frontier Comparison Table (Exact Structure from Page 2 of BP) */}
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-[#108548] mb-2.5">
                    CONDITION-AWARE FRONTIER POSITIONING ({selectedFrontier.metricName})
                  </h3>
                  <div className="overflow-x-auto border border-slate-300 rounded-lg">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#F2F4F8] border-b border-slate-300 text-[#0F2537]">
                          <th className="py-2.5 px-4 font-bold border-r border-slate-300">Position</th>
                          <th className="py-2.5 px-4 font-bold border-r border-slate-300">
                            {selectedFrontier.metricName}
                          </th>
                          <th className="py-2.5 px-4 font-bold border-r border-slate-300">Meaning & Context</th>
                          <th className="py-2.5 px-4 font-bold">Evidence / Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedFrontier.positions.map((row) => (
                          <tr key={row.position} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-semibold text-[#0F2537] border-r border-slate-200 whitespace-nowrap">
                              {row.position}
                            </td>
                            <td className="py-3 px-4 font-mono tabular-nums font-bold text-[#0F2537] border-r border-slate-200 whitespace-nowrap">
                              {row.valueDisplay}
                            </td>
                            <td className="py-3 px-4 text-slate-700 border-r border-slate-200">
                              {row.meaning}
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-600 font-mono">
                              {row.referenceSource}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Root-Cause Gap Explanation & Recent Frontier Movement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-[#FBF5EC] border border-[#E8D8C3]">
                    <div className="text-xs font-bold text-[#0F2537] mb-1">
                      What Causes the Gap (Physics & Engineering Bottleneck)
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedFrontier.gapRootCauseAnalysis}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F2F4F8] border border-[#DCE2EC]">
                    <div className="text-xs font-bold text-[#0F2537] mb-1">
                      What Changed Recently on This Frontier
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedFrontier.whatChangedRecently}
                    </p>
                  </div>
                </div>

                {/* Recommended Engineering Decisions */}
                {selectedFrontier.recommendedNextActions.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs font-bold text-[#108548] mb-2">
                      WHAT SHOULD WE DO NEXT? (RECOMMENDED EXECUTION PATH)
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-5">
                      {selectedFrontier.recommendedNextActions.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Comparable Evidence Records Behind Each Conclusion */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0F2537]">
                    Technologies, Labs, Patents & Researchers Closest to Closing the Gap ({selectedFrontier.evidenceRecords.length})
                  </h3>
                </div>

                {selectedFrontier.evidenceRecords.map((ev) => (
                  <article
                    key={ev.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-400 transition-colors space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <div>
                        <strong className="text-[#108548]">{ev.category}</strong>
                        <span> · {ev.institutionOrCompany} · </span>
                        <span className="font-mono">{ev.sourceIdentifier}</span>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-[#0F2537]">
                        {ev.maturityTrl} · {ev.demonstratedPerformance}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#0F2537]">{ev.title}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF9F6] p-3.5 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-500 block">Comparable Operating Conditions:</span>
                        <span className="font-medium text-[#0F2537]">{ev.operatingConditions}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Manufacturability & Reliability:</span>
                        <span className="font-medium text-[#0F2537]">
                          {ev.manufacturabilityAndReliability}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <strong className="text-[#0F2537]">Relevance to Gap: </strong>
                      {ev.relevanceToGap}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-600">
                        Lead Researcher / Contact: <strong className="text-[#0F2537]">{ev.leadContributor}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEvidence(ev)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#0F2537] border border-slate-200 rounded-md hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span>Save to Evidence Graph</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onLaunchProjectFromFrontier(selectedFrontier, ev)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2537] hover:bg-[#16344D] rounded-md flex items-center gap-1 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#C59B47]" />
                          <span>Start Protected Project with Partner</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FBF5EC] border border-[#E8D8C3] flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6 text-[#0F2537]" />
              </div>
              <h2 className="text-xl font-bold text-[#0F2537]">
                No Frontier Benchmark Selected
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Enter your current technology, operating envelope, constraints, and target ambition in the specification panel on the left. Qartinia Frontier will compute the commercial frontier, the research frontier, what causes the gap, and the verified evidence to close it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
