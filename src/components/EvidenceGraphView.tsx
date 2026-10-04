import React, { useState, useMemo } from 'react';
import {
  EvidenceNode,
  EvidenceCategory,
  CatalogRelationshipEdge,
  CatalogBookmark,
  FrontierBenchmark,
  ProtectedProjectRoom,
  UserAccount,
} from '../types/qartinia';
import { getUserPermissions } from '../utils/permissions';
import {
  Search,
  Plus,
  Lock,
  X,
  Layers,
  Trash2,
  Bookmark,
  GitBranch,
  ArrowRight,
} from 'lucide-react';

interface EvidenceGraphViewProps {
  evidenceNodes: EvidenceNode[];
  frontiers: FrontierBenchmark[];
  projects: ProtectedProjectRoom[];
  catalogRelationships: CatalogRelationshipEdge[];
  bookmarks: CatalogBookmark[];
  currentUser?: UserAccount | null;
  autoOpenCreateModal?: boolean;
  onResetAutoOpen?: () => void;
  onCreateEvidenceNode: (node: Omit<EvidenceNode, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteEvidenceNode: (id: string) => Promise<void>;
  onToggleBookmark: (catalogId: string, notes?: string) => Promise<void>;
  onCreateRelationship: (payload: {
    sourceId: string;
    targetId: string;
    relationshipType: string;
    description: string;
  }) => Promise<void>;
  onDeleteRelationship: (id: string) => Promise<void>;
  onLaunchProjectFromEvidence: (node: EvidenceNode) => void;
}

const CATEGORIES: ('All' | EvidenceCategory | 'Bookmarked')[] = [
  'All',
  'Bookmarked',
  'Publication',
  'Patent',
  'Product Datasheet',
  'Standard',
  'Research Laboratory',
  'Domain Expert',
];

export const EvidenceGraphView: React.FC<EvidenceGraphViewProps> = ({
  evidenceNodes,
  frontiers,
  projects,
  catalogRelationships,
  bookmarks,
  currentUser,
  autoOpenCreateModal,
  onResetAutoOpen,
  onCreateEvidenceNode,
  onDeleteEvidenceNode,
  onToggleBookmark,
  onCreateRelationship,
  onDeleteRelationship,
  onLaunchProjectFromEvidence,
}) => {
  const permissions = getUserPermissions(currentUser || null);
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | EvidenceCategory | 'Bookmarked'
  >('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  React.useEffect(() => {
    if (autoOpenCreateModal) {
      setShowAddModal(true);
      if (onResetAutoOpen) onResetAutoOpen();
    }
  }, [autoOpenCreateModal, onResetAutoOpen]);

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

  // Relationship Link Modal State
  const [relSourceId, setRelSourceId] = useState('');
  const [relTargetId, setRelTargetId] = useState('');
  const [relType, setRelType] = useState('closes_frontier_gap');
  const [relDesc, setRelDesc] = useState('');

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.map((b) => b.catalogId)),
    [bookmarks]
  );

  const allCatalogEntities = useMemo(() => {
    const items: { id: string; label: string }[] = [];
    frontiers.forEach((f) => items.push({ id: f.id, label: `[Frontier] ${f.title}` }));
    projects.forEach((p) =>
      items.push({ id: p.id, label: `[Project Room ${p.code}] ${p.title}` })
    );
    evidenceNodes.forEach((e) =>
      items.push({ id: e.id, label: `[${e.category}] ${e.title}` })
    );
    return items;
  }, [frontiers, projects, evidenceNodes]);

  const filteredNodes = useMemo(() => {
    return evidenceNodes.filter((n) => {
      if (selectedCategory === 'Bookmarked' && !bookmarkedIds.has(n.id)) {
        return false;
      }
      const matchesCat =
        selectedCategory === 'All' ||
        selectedCategory === 'Bookmarked' ||
        n.category === selectedCategory;
      const matchesQuery =
        !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.institutionOrCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.operatingConditions.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.leadContributor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.sourceIdentifier.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [evidenceNodes, selectedCategory, searchQuery, bookmarkedIds]);

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

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relSourceId || !relTargetId) return;
    await onCreateRelationship({
      sourceId: relSourceId,
      targetId: relTargetId,
      relationshipType: relType,
      description:
        relDesc.trim() || 'Condition-aware provenance edge in public.catalog_relationships',
    });
    setShowLinkModal(false);
    setRelDesc('');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      <div className="pb-8 border-b border-slate-200 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="text-xs font-bold tracking-wider text-[#108548] mb-1.5">
            QARTINIA KNOWLEDGE GRAPH · CONDITION-AWARE PROVENANCE LAYER (public.catalog &amp; public.catalog_relationships)
          </div>
          <h1 className="text-3xl font-bold text-[#0F2537] tracking-tight">
            Structured Engineering Evidence &amp; Relational Knowledge Graph
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Scientific publications, patents, product datasheets, standards, laboratories, and relational edges (<code className="font-mono text-xs">public.catalog_relationships</code>) packaged by comparable operating conditions, maturity, and reliability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start">
          {allCatalogEntities.length >= 2 && (
            <button
              type="button"
              onClick={() => {
                setRelSourceId(allCatalogEntities[0]?.id || '');
                setRelTargetId(allCatalogEntities[1]?.id || '');
                setShowLinkModal(true);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-[#0F2537] bg-white border border-slate-300 rounded-lg hover:border-[#0F2537] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <GitBranch className="w-4 h-4 text-[#108548]" />
              <span>Link Knowledge Graph Edge ({catalogRelationships.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#C59B47]" />
            <span>Register Evidence Record</span>
          </button>
        </div>
      </div>

      {/* Knowledge Graph Relational Edges (`public.catalog_relationships`) */}
      {catalogRelationships.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#108548]" />
              <h2 className="text-sm font-bold text-[#0F2537]">
                Verified Knowledge Graph Provenance Edges (<code className="font-mono text-xs">public.catalog_relationships</code>)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {catalogRelationships.length} Relational Edges
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {catalogRelationships.map((rel) => (
              <div
                key={rel.id}
                className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 font-semibold text-[#0F2537]">
                    <span>{rel.sourceTitle}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C59B47] shrink-0" />
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#108548] font-mono text-[11px]">
                      {rel.relationshipType}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C59B47] shrink-0" />
                    <span>{rel.targetTitle}</span>
                  </div>
                  {rel.description && (
                    <p className="text-slate-600 leading-relaxed">{rel.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteRelationship(rel.id)}
                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer shrink-0"
                  title="Remove Knowledge Graph Edge"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="py-2 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
              {cat === 'Bookmarked' ? `Bookmarked (${bookmarks.length})` : cat}
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
      <div>
        {filteredNodes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FBF5EC] border border-[#E8D8C3] flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6 text-[#0F2537]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F2537]">
              Structured Evidence Graph Is Ready
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Every technical record saved from a Qartinia Frontier analysis or contributed directly by researchers and engineers is persisted to <code className="font-mono text-xs">public.catalog</code> and linked via <code className="font-mono text-xs">public.catalog_relationships</code>.
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
            {filteredNodes.map((node) => {
              const isBookmarked = bookmarkedIds.has(node.id);
              return (
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
                        <span className="font-mono font-semibold text-[#0F2537]">
                          {node.maturityTrl}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleBookmark(node.id, node.title)}
                          title={
                            isBookmarked
                              ? 'Remove from public.bookmarks'
                              : 'Save to public.bookmarks'
                          }
                          className={`p-1 rounded cursor-pointer ${
                            isBookmarked
                              ? 'text-[#C59B47] bg-[#FBF5EC]'
                              : 'text-slate-400 hover:text-[#0F2537]'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>

                        {/* Delete Evidence Node button: Hidden for employees; visible only for Administrators */}
                        {permissions.canDeleteEvidence && (
                          <button
                            type="button"
                            onClick={() => onDeleteEvidenceNode(node.id)}
                            aria-label="Remove Evidence Node"
                            title="Delete Evidence Record (Admin Only)"
                            className="p-1 text-slate-400 hover:text-red-600 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
                        <span className="text-slate-500 block">
                          Manufacturability, Reliability &amp; Cost
                        </span>
                        <strong className="text-[#0F2537]">
                          {node.manufacturabilityAndReliability}
                        </strong>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {node.relevanceToGap}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <div className="text-slate-600">
                      Lead Contributor:{' '}
                      <strong className="text-[#0F2537]">{node.leadContributor}</strong>
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
              );
            })}
          </div>
        )}
      </div>

      {/* Link Knowledge Graph Edge Modal (`public.catalog_relationships`) */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateLink}
            className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-[#0F2537]">
                Create Knowledge Graph Relationship (<code className="font-mono text-xs">public.catalog_relationships</code>)
              </h2>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                Source Catalog Entity (source_id) *
              </label>
              <select
                value={relSourceId}
                onChange={(e) => setRelSourceId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
              >
                {allCatalogEntities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                Relationship Type (relationship_type) *
              </label>
              <select
                value={relType}
                onChange={(e) => setRelType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
              >
                <option value="closes_research_frontier_gap">closes_research_frontier_gap</option>
                <option value="benchmarks_commercial_frontier">
                  benchmarks_commercial_frontier
                </option>
                <option value="enables_thermal_and_emi_envelope">
                  enables_thermal_and_emi_envelope
                </option>
                <option value="licenses_background_ip_in_room">
                  licenses_background_ip_in_room
                </option>
                <option value="executes_on_frontier">executes_on_frontier</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                Target Catalog Entity (target_id) *
              </label>
              <select
                value={relTargetId}
                onChange={(e) => setRelTargetId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
              >
                {allCatalogEntities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                Provenance / Engineering Description
              </label>
              <input
                type="text"
                value={relDesc}
                onChange={(e) => setRelDesc(e.target.value)}
                placeholder="Explain how these two entities connect under comparable conditions"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] cursor-pointer"
              >
                Insert Edge in public.catalog_relationships
              </button>
            </div>
          </form>
        </div>
      )}

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

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Evidence Record Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter publication, patent, laboratory, or product title"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Evidence Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EvidenceCategory)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="Publication">Publication</option>
                    <option value="Patent">Patent</option>
                    <option value="Product Datasheet">Product Datasheet</option>
                    <option value="Standard">Standard</option>
                    <option value="Research Laboratory">Research Laboratory</option>
                    <option value="Domain Expert">Domain Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    DOI / Patent / Reference ID
                  </label>
                  <input
                    type="text"
                    value={sourceIdentifier}
                    onChange={(e) => setSourceIdentifier(e.target.value)}
                    placeholder="DOI, patent number, or datasheet ID"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Institution / Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionOrCompany}
                    onChange={(e) => setInstitutionOrCompany(e.target.value)}
                    placeholder="University, research institute, or vendor"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Lead Author / Investigator
                  </label>
                  <input
                    type="text"
                    value={leadContributor}
                    onChange={(e) => setLeadContributor(e.target.value)}
                    placeholder="Principal investigator or engineering lead"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Operating Envelope / Conditions
                  </label>
                  <input
                    type="text"
                    value={operatingConditions}
                    onChange={(e) => setOperatingConditions(e.target.value)}
                    placeholder="Voltage, temperature, load, substrate, etc."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Demonstrated Performance &amp; Unit
                  </label>
                  <input
                    type="text"
                    value={demonstratedPerformance}
                    onChange={(e) => setDemonstratedPerformance(e.target.value)}
                    placeholder="Measured performance value and unit"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Maturity (TRL)
                  </label>
                  <input
                    type="text"
                    value={maturityTrl}
                    onChange={(e) => setMaturityTrl(e.target.value)}
                    placeholder="e.g., TRL 4, TRL 6, TRL 8"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Manufacturability &amp; Reliability
                  </label>
                  <input
                    type="text"
                    value={manufacturabilityAndReliability}
                    onChange={(e) => setManufacturabilityAndReliability(e.target.value)}
                    placeholder="Qualification, yield, or process notes"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Engineering Relevance &amp; Provenance Summary
                </label>
                <textarea
                  rows={3}
                  value={relevanceToGap}
                  onChange={(e) => setRelevanceToGap(e.target.value)}
                  placeholder="Describe why this evidence record is relevant to closing the frontier gap"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] cursor-pointer"
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
