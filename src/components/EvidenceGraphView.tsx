import React, { useState, useMemo } from 'react';
import { EvidenceNode, EvidenceCategory } from '../types/qartinia';
import { Search, Plus, Lock, X, Layers, Trash2 } from 'lucide-react';

interface EvidenceGraphViewProps {
  evidenceNodes: EvidenceNode[];
  onCreateEvidenceNode: (node: Omit<EvidenceNode, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteEvidenceNode: (id: string) => Promise<void>;
  onLaunchProjectFromEvidence: (node: EvidenceNode) => void;
}

const CATEGORIES: ('All' | EvidenceCategory)[] = [
  'All',
  'Publication',
  'Patent',
  'Product Datasheet',
  'Standard',
  'Research Laboratory',
  'Domain Expert',
];

export const EvidenceGraphView: React.FC<EvidenceGraphViewProps> = ({
  evidenceNodes,
  onCreateEvidenceNode,
  onDeleteEvidenceNode,
  onLaunchProjectFromEvidence,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | EvidenceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EvidenceCategory>('Publication');
  const [sourceIdentifier, setSourceIdentifier] = useState('');
  const [institutionOrCompany, setInstitutionOrCompany] = useState('');
  const [leadContributor, setLeadContributor] = useState('');
  const [operatingConditions, setOperatingConditions] = useState('');
  const [demonstratedPerformance, setDemonstratedPerformance] = useState('');
  const [maturityTrl, setMaturityTrl] = useState('');
  const [manufacturabilityAndReliability, setManufacturabilityAndReliability] = useState('');
  const [relevanceToGap, setRelevanceToGap] = useState('');

  const filteredNodes = useMemo(() => {
    return evidenceNodes.filter((n) => {
      const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
      const matchesQuery =
        !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.institutionOrCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.operatingConditions.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.leadContributor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.sourceIdentifier.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [evidenceNodes, selectedCategory, searchQuery]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !institutionOrCompany.trim()) return;
    await onCreateEvidenceNode({
      title: title.trim(),
      category,
      sourceIdentifier: sourceIdentifier.trim() || 'Verified Record',
      institutionOrCompany: institutionOrCompany.trim(),
      leadContributor: leadContributor.trim() || 'Principal Investigator',
      operatingConditions: operatingConditions.trim() || 'Standard laboratory envelope',
      demonstratedPerformance: demonstratedPerformance.trim() || 'Verified performance point',
      maturityTrl: maturityTrl.trim() || 'TRL 5',
      manufacturabilityAndReliability:
        manufacturabilityAndReliability.trim() || 'Evaluated for industrial compatibility',
      relevanceToGap: relevanceToGap.trim() || 'Direct technical evidence node',
    });
    setShowAddModal(false);
    setTitle('');
    setSourceIdentifier('');
    setInstitutionOrCompany('');
    setLeadContributor('');
    setOperatingConditions('');
    setDemonstratedPerformance('');
    setMaturityTrl('');
    setManufacturabilityAndReliability('');
    setRelevanceToGap('');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="pb-8 border-b border-slate-200 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="text-xs font-bold tracking-wider text-[#108548] mb-1.5">
            QARTINIA KNOWLEDGE GRAPH · CONDITION-AWARE PROVENANCE LAYER
          </div>
          <h1 className="text-3xl font-bold text-[#0F2537] tracking-tight">
            Structured Engineering Evidence & Comparability Dataset
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Scientific publications, patents, product datasheets, standards, laboratories and experts packaged by comparable operating conditions, maturity, manufacturability and reliability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-2 self-start cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-[#C59B47]" />
          <span>Register Evidence Record</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="py-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-[#0F2537] shadow-xs'
                  : 'text-slate-600 hover:text-[#0F2537]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by operating conditions, institution, DOI/patent..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg text-[#0F2537] focus:outline-none focus:ring-2 focus:ring-[#0F2537]"
          />
        </div>
      </div>

      {/* Evidence Records Grid */}
      <div className="pt-8">
        {filteredNodes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FBF5EC] border border-[#E8D8C3] flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6 text-[#0F2537]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F2537]">
              Structured Evidence Graph Is Ready
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Every technical record saved from a Qartinia Frontier analysis or contributed directly by researchers and engineers strengthens your historical frontier dataset and provenance layer.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] cursor-pointer"
            >
              Register First Evidence Record
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNodes.map((node) => (
              <article
                key={node.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-400 transition-colors space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <div>
                      <strong className="text-[#108548]">{node.category}</strong>
                      <span> · {node.institutionOrCompany} · </span>
                      <span className="font-mono">{node.sourceIdentifier}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-[#0F2537]">{node.maturityTrl}</span>
                      <button
                        type="button"
                        onClick={() => onDeleteEvidenceNode(node.id)}
                        aria-label="Remove Evidence Node"
                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F2537]">{node.title}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block">Comparable Operating Envelope</span>
                      <strong className="text-[#0F2537]">{node.operatingConditions}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Demonstrated Performance</span>
                      <strong className="text-[#0F2537] font-mono tabular-nums">
                        {node.demonstratedPerformance}
                      </strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 block">Manufacturability, Reliability & Cost</span>
                      <strong className="text-[#0F2537]">{node.manufacturabilityAndReliability}</strong>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {node.relevanceToGap}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="text-slate-600">
                    Lead Contributor: <strong className="text-[#0F2537]">{node.leadContributor}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLaunchProjectFromEvidence(node)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2537] rounded-md hover:bg-[#16344D] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#C59B47]" />
                    <span>Open Protected Project</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Register Evidence Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#0F2537]">
                Register Condition-Aware Evidence Record
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Evidence Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EvidenceCategory)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="Publication">Scientific Publication</option>
                    <option value="Patent">Patent Filing / Grant</option>
                    <option value="Product Datasheet">Product Datasheet</option>
                    <option value="Standard">Industrial Standard</option>
                    <option value="Research Laboratory">Research Laboratory</option>
                    <option value="Domain Expert">Domain Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Identifier (DOI / Patent / Code)
                  </label>
                  <input
                    type="text"
                    value={sourceIdentifier}
                    onChange={(e) => setSourceIdentifier(e.target.value)}
                    placeholder="Reference ID"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title of publication, patent, datasheet, or lab capability"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Institution / Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionOrCompany}
                    onChange={(e) => setInstitutionOrCompany(e.target.value)}
                    placeholder="University, lab, or vendor"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Lead Author / Inventor / PI
                  </label>
                  <input
                    type="text"
                    value={leadContributor}
                    onChange={(e) => setLeadContributor(e.target.value)}
                    placeholder="Researcher name"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Demonstrated Performance
                  </label>
                  <input
                    type="text"
                    value={demonstratedPerformance}
                    onChange={(e) => setDemonstratedPerformance(e.target.value)}
                    placeholder="Measured performance value"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Maturity (TRL / Readiness)
                  </label>
                  <input
                    type="text"
                    value={maturityTrl}
                    onChange={(e) => setMaturityTrl(e.target.value)}
                    placeholder="Maturity level"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Comparable Operating Conditions
                </label>
                <input
                  type="text"
                  value={operatingConditions}
                  onChange={(e) => setOperatingConditions(e.target.value)}
                  placeholder="Temperature, frequency, substrate, pressure, medium"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Manufacturability, Reliability & Cost Notes
                </label>
                <input
                  type="text"
                  value={manufacturabilityAndReliability}
                  onChange={(e) => setManufacturabilityAndReliability(e.target.value)}
                  placeholder="Process compatibility, lifetime, and cost constraints"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Relevance to Industrial Gap
                </label>
                <textarea
                  rows={2}
                  value={relevanceToGap}
                  onChange={(e) => setRelevanceToGap(e.target.value)}
                  placeholder="How this evidence closes an engineering gap"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] cursor-pointer"
              >
                Save to Evidence Graph
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
