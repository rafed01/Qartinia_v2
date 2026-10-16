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
  Network,
  FileText,
  Eye,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { AstrolabeWatermark, WavesWatermark, CarthageCornerMotif, ColumnsWatermark, LivePulseBeacon } from './CarthageArtwork';
import { ConstellationRadarCanvas } from './ConstellationRadarCanvas';
import { CryptographicProvenanceInspectorModal } from './CryptographicProvenanceInspectorModal';

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
  onOpenExecutiveDossier?: () => void;
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
  onOpenExecutiveDossier,
}) => {
  const permissions = getUserPermissions(currentUser || null);
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | EvidenceCategory | 'Bookmarked'
  >('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedNodeForInspect, setSelectedNodeForInspect] = useState<EvidenceNode | null>(null);
  const [viewMode, setViewMode] = useState<'radar' | 'grid'>('radar');
  const [sealModalNode, setSealModalNode] = useState<EvidenceNode | null>(null);

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
  const [relType, setRelType] = useState('cites_method');
  const [relDesc, setRelDesc] = useState('');

  const bookmarkedIds = useMemo(() => {
    return new Set(bookmarks.map((b) => b.catalogId));
  }, [bookmarks]);

  // Combined pool of entities that can be linked
  const allCatalogEntities = useMemo(() => {
    const list: { id: string; title: string; type: string }[] = [];
    evidenceNodes.forEach((n) => list.push({ id: n.id, title: n.title, type: 'Evidence' }));
    frontiers.forEach((f) => list.push({ id: f.id, title: f.title, type: 'Frontier' }));
    projects.forEach((p) => list.push({ id: p.id, title: p.title, type: 'Project' }));
    return list;
  }, [evidenceNodes, frontiers, projects]);

  const filteredNodes = useMemo(() => {
    return evidenceNodes.filter((node) => {
      if (selectedCategory === 'Bookmarked') {
        if (!bookmarkedIds.has(node.id)) return false;
      } else if (selectedCategory !== 'All') {
        if (node.category !== selectedCategory) return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        node.title.toLowerCase().includes(q) ||
        node.institutionOrCompany.toLowerCase().includes(q) ||
        node.operatingConditions.toLowerCase().includes(q) ||
        node.sourceIdentifier.toLowerCase().includes(q) ||
        node.leadContributor.toLowerCase().includes(q) ||
        node.category.toLowerCase().includes(q)
      );
    });
  }, [evidenceNodes, selectedCategory, searchQuery, bookmarkedIds]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !institutionOrCompany.trim()) return;

    await onCreateEvidenceNode({
      title: title.trim(),
      category,
      sourceIdentifier: sourceIdentifier.trim() || 'Internal Registration',
      institutionOrCompany: institutionOrCompany.trim(),
      leadContributor: leadContributor.trim() || 'Not specified',
      operatingConditions: operatingConditions.trim() || 'Unspecified envelope',
      demonstratedPerformance: demonstratedPerformance.trim() || 'See source document',
      maturityTrl: maturityTrl.trim() || 'TRL 4',
      manufacturabilityAndReliability:
        manufacturabilityAndReliability.trim() || 'Under evaluation',
      relevanceToGap: relevanceToGap.trim() || 'General R&D relevance',
    });

    setTitle('');
    setSourceIdentifier('');
    setInstitutionOrCompany('');
    setLeadContributor('');
    setOperatingConditions('');
    setDemonstratedPerformance('');
    setMaturityTrl('');
    setManufacturabilityAndReliability('');
    setRelevanceToGap('');
    setShowAddModal(false);
  };

  const handleCreateRelationship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relSourceId || !relTargetId || relSourceId === relTargetId) return;

    await onCreateRelationship({
      sourceId: relSourceId,
      targetId: relTargetId,
      relationshipType: relType,
      description: relDesc.trim(),
    });

    setRelDesc('');
    setShowLinkModal(false);
  };

  return (
    <div className="max-w-[1500px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <section className="bg-white border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xs relative overflow-hidden">
        <CarthageCornerMotif className="w-8 h-8 absolute top-2 right-2 pointer-events-none opacity-40 text-[#8C6527]" />
        <AstrolabeWatermark className="w-64 h-64 absolute -right-12 -bottom-12 pointer-events-none opacity-[0.08] text-[#8C6527]" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-bold tracking-wider text-[#8C6527] uppercase font-mono flex items-center gap-2">
              <Network className="w-4 h-4 text-[#8C6527]" />
              <span>Condition-Aware Provenance Layer</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F2038] tracking-tight">
              Structured Evidence Graph &amp; Knowledge Network
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed">
              Scientific publications, patents, product datasheets, standards, and laboratories linked by operating conditions, maturity, and reliability.
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
                className="px-4 py-2.5 text-xs font-semibold text-[#0F2038] bg-white border border-[#E5DDD0] rounded-xl hover:border-[#D5C8B5] hover:bg-[#FAF8F5] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-2xs"
              >
                <GitBranch className="w-4 h-4 text-[#8C6527]" />
                <span>Link Graph Edge ({catalogRelationships.length})</span>
              </button>
            )}

            {onOpenExecutiveDossier && (
              <button
                type="button"
                onClick={onOpenExecutiveDossier}
                className="px-4 py-2.5 text-xs font-bold text-[#0F2038] bg-white border border-[#D5C8B5] hover:bg-[#FAF8F5] rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-2xs"
              >
                <FileText className="w-4 h-4 text-[#8C6527]" />
                <span>Executive Dossier</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#C5A880]" />
              <span>Register Evidence Record</span>
            </button>
          </div>
        </div>
      </section>

      {/* View Mode Switcher Header */}
      <div className="flex items-center justify-between bg-white border border-[#E5DDD0] rounded-2xl p-2 px-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <LivePulseBeacon color="gold" />
          <span className="font-serif font-bold text-xs text-[#0F2038]">Knowledge Network Display Mode</span>
        </div>
        <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E5DDD0] p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'radar'
                ? 'bg-[#0F2038] text-white shadow-2xs font-bold'
                : 'text-[#5A6E85] hover:text-[#0F2038]'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Interactive Celestial Astrolabe</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#0F2038] text-white shadow-2xs font-bold'
                : 'text-[#5A6E85] hover:text-[#0F2038]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Evidence Record Cards</span>
          </button>
        </div>
      </div>

      {/* Interactive Canvas Constellation Radar Layer */}
      {viewMode === 'radar' && (
        <ConstellationRadarCanvas
          nodes={evidenceNodes}
          edges={catalogRelationships}
          onSelectNode={(node) => {
            setSelectedNodeForInspect(node);
            setSealModalNode(node);
          }}
        />
      )}

      {/* 2. Knowledge Graph Relational Edges */}
      {catalogRelationships.length > 0 && (
        <section className="bg-white border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBE3D7]">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#8C6527]" />
              <h2 className="font-serif text-base font-bold text-[#0F2038]">
                Verified Knowledge Graph Edges (<code className="font-mono text-xs text-[#8C6527]">catalog_relationships</code>)
              </h2>
            </div>
            <span className="text-xs font-mono text-[#5A6E85]">
              {catalogRelationships.length} Edges
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {catalogRelationships.map((rel) => (
              <div
                key={rel.id}
                className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 font-semibold text-[#0F2038]">
                    <span>{rel.sourceTitle}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8C6527] shrink-0" />
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E5DDD0] text-[#8C6527] font-mono text-[11px]">
                      {rel.relationshipType}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8C6527] shrink-0" />
                    <span>{rel.targetTitle}</span>
                  </div>
                  {rel.description && (
                    <p className="text-[#5A6E85] leading-relaxed">{rel.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteRelationship(rel.id)}
                  className="p-1 text-[#5A6E85] hover:text-rose-600 cursor-pointer shrink-0 transition-colors"
                  title="Remove Edge"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Filter & Search Bar */}
      <div className="py-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#E5DDD0] rounded-xl shadow-2xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0F2038] text-white shadow-2xs'
                  : 'text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5]'
              }`}
            >
              {cat === 'Bookmarked' ? `Bookmarked (${bookmarks.length})` : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by operating conditions, institution, DOI/patent..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527] shadow-2xs"
          />
        </div>
      </div>

      {/* 4. Evidence Records Grid */}
      <div>
        {filteredNodes.length === 0 ? (
          <div className="bg-white border border-[#E5DDD0] rounded-2xl p-10 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD0] flex items-center justify-center mx-auto text-[#8C6527]">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#0F2038]">
              Structured Evidence Graph Is Ready
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6E85] max-w-lg mx-auto leading-relaxed">
              Every technical record saved from a Qartinia Frontier analysis or contributed directly by researchers is persisted to <code className="font-mono text-xs text-[#8C6527]">public.catalog</code>.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl cursor-pointer shadow-xs"
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
                  className="bg-white border border-[#E5DDD0] rounded-2xl p-6 flex flex-col justify-between hover:border-[#D5C8B5] hover:shadow-xs transition-all space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#5A6E85]">
                      <div>
                        <strong className="text-[#8C6527] font-semibold font-mono">{node.category}</strong>
                        <span> · {node.institutionOrCompany} · </span>
                        <span className="font-mono text-[#0F2038]">{node.sourceIdentifier}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#0F2038] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E5DDD0]">
                          {node.maturityTrl}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleBookmark(node.id, node.title)}
                          title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
                          className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                            isBookmarked
                              ? 'text-[#8C6527] bg-[#FAF4EB] border border-[#D5C8B5]'
                              : 'text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>

                        {permissions.canDeleteEvidence && (
                          <button
                            type="button"
                            onClick={() => onDeleteEvidenceNode(node.id)}
                            title="Delete Evidence Record (Admin Only)"
                            className="p-1.5 text-[#5A6E85] hover:text-rose-600 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#0F2038] group-hover:text-[#8C6527] transition-colors">
                      {node.title}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE3D7] text-xs">
                      <div>
                        <span className="text-[#5A6E85] block font-medium">Operating Conditions:</span>
                        <span className="font-semibold text-[#0F2038] mt-0.5 block">{node.operatingConditions}</span>
                      </div>
                      <div>
                        <span className="text-[#5A6E85] block font-medium">Demonstrated Performance:</span>
                        <span className="font-mono font-semibold text-[#0F2038] mt-0.5 block">{node.demonstratedPerformance}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#5A6E85] leading-relaxed">
                      <strong className="text-[#0F2038]">Relevance to Gap: </strong>
                      {node.relevanceToGap}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-between text-xs flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedNodeForInspect(node)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E5DDD0] text-[#0F2038] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#8C6527]" />
                      <span>Inspect Canvas Node</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onLaunchProjectFromEvidence(node)}
                      className="px-3 py-1.5 rounded-xl bg-[#0F2038] hover:bg-[#1A365D] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <Lock className="w-3 h-3 text-[#C5A880]" />
                      <span>Start Project Room</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Window: Link Graph Edge Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <form
            onSubmit={handleCreateRelationship}
            className="bg-white border border-[#E5DDD0] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE3D7]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#8C6527]" />
                <h2 className="font-serif text-base font-bold text-[#0F2038]">
                  Link Verified Knowledge Graph Edge
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 text-[#5A6E85] hover:text-[#0F2038] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Source Entity
                </label>
                <select
                  value={relSourceId}
                  onChange={(e) => setRelSourceId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] text-[#0F2038] rounded-xl focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                >
                  {allCatalogEntities.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      [{ent.type}] {ent.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Relationship Type
                </label>
                <select
                  value={relType}
                  onChange={(e) => setRelType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] text-[#0F2038] rounded-xl focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                >
                  <option value="cites_method">cites_method</option>
                  <option value="benchmarks_against">benchmarks_against</option>
                  <option value="licensed_from">licensed_from</option>
                  <option value="fabricated_by">fabricated_by</option>
                  <option value="derived_from">derived_from</option>
                  <option value="supersedes">supersedes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Target Entity
                </label>
                <select
                  value={relTargetId}
                  onChange={(e) => setRelTargetId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] text-[#0F2038] rounded-xl focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                >
                  {allCatalogEntities.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      [{ent.type}] {ent.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Engineering Provenance Description
                </label>
                <input
                  type="text"
                  value={relDesc}
                  onChange={(e) => setRelDesc(e.target.value)}
                  placeholder="Explain how these entities connect under comparable conditions"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] text-[#0F2038] rounded-xl focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#EBE3D7]">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl cursor-pointer shadow-xs"
              >
                Insert Edge
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Window: Register Evidence Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <form
            onSubmit={handleCreate}
            className="bg-white border border-[#E5DDD0] rounded-2xl max-w-xl w-full p-6 max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE3D7]">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#0F2038]">
                  Register Condition-Aware Evidence Record
                </h2>
                <p className="text-xs text-[#5A6E85]">
                  Add verified empirical literature, patents, or lab qualifications
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#5A6E85] hover:text-[#0F2038] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-2 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Evidence Record Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter publication, patent, laboratory, or product title"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Evidence Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EvidenceCategory)}
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DDD0] text-[#0F2038] rounded-xl focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
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
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    DOI / Patent / Reference ID
                  </label>
                  <input
                    type="text"
                    value={sourceIdentifier}
                    onChange={(e) => setSourceIdentifier(e.target.value)}
                    placeholder="DOI, patent number, or datasheet ID"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] font-mono focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Institution / Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionOrCompany}
                    onChange={(e) => setInstitutionOrCompany(e.target.value)}
                    placeholder="University, research institute, or vendor"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Lead Author / Investigator
                  </label>
                  <input
                    type="text"
                    value={leadContributor}
                    onChange={(e) => setLeadContributor(e.target.value)}
                    placeholder="Principal investigator or engineering lead"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Operating Envelope / Conditions
                  </label>
                  <input
                    type="text"
                    value={operatingConditions}
                    onChange={(e) => setOperatingConditions(e.target.value)}
                    placeholder="Voltage, temperature, load, substrate, etc."
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Demonstrated Performance
                  </label>
                  <input
                    type="text"
                    value={demonstratedPerformance}
                    onChange={(e) => setDemonstratedPerformance(e.target.value)}
                    placeholder="Measured performance value and unit"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] font-mono focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Maturity (TRL)
                  </label>
                  <input
                    type="text"
                    value={maturityTrl}
                    onChange={(e) => setMaturityTrl(e.target.value)}
                    placeholder="e.g., TRL 4, TRL 6, TRL 8"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] font-mono focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Manufacturability &amp; Reliability
                  </label>
                  <input
                    type="text"
                    value={manufacturabilityAndReliability}
                    onChange={(e) => setManufacturabilityAndReliability(e.target.value)}
                    placeholder="Qualification, yield, or process notes"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Engineering Relevance
                </label>
                <textarea
                  rows={3}
                  value={relevanceToGap}
                  onChange={(e) => setRelevanceToGap(e.target.value)}
                  placeholder="Describe why this record is relevant to closing the gap"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl cursor-pointer shadow-xs"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Canvas Node Inspector Drawer */}
      {selectedNodeForInspect && (
        <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-xs flex items-center justify-end p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#D5C8B5] rounded-2xl max-w-xl w-full h-full max-h-[95vh] p-6 shadow-2xl overflow-y-auto space-y-6 relative flex flex-col justify-between">
            <CarthageCornerMotif className="w-8 h-8 absolute top-3 right-3 opacity-40 text-[#8C6527]" />
            <AstrolabeWatermark className="w-48 h-48 absolute -right-10 -bottom-10 opacity-[0.08] text-[#8C6527]" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-start justify-between pb-4 border-b border-[#EBE3D7]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <LivePulseBeacon color="gold" />
                    <span className="font-mono text-xs font-bold text-[#8C6527] uppercase">
                      Canvas Node Inspection
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-[#0F2038]">
                    {selectedNodeForInspect.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNodeForInspect(null)}
                  className="p-1.5 text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0]">
                  <span className="text-[10px] font-mono text-[#718096] uppercase block">Category</span>
                  <span className="font-serif font-bold text-[#0F2038] mt-0.5 block">{selectedNodeForInspect.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0]">
                  <span className="text-[10px] font-mono text-[#718096] uppercase block">TRL Maturity</span>
                  <span className="font-serif font-bold text-[#8C6527] mt-0.5 block">{selectedNodeForInspect.maturityTrl}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[#E5DDD0] space-y-1">
                  <span className="font-mono text-[10px] font-bold text-[#8C6527] uppercase block">Operating Conditions Envelope</span>
                  <p className="text-[#0F2038] font-medium leading-relaxed">{selectedNodeForInspect.operatingConditions}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5DDD0] space-y-1">
                  <span className="font-mono text-[10px] font-bold text-[#8C6527] uppercase block">Demonstrated Performance</span>
                  <p className="font-mono font-semibold text-[#0F2038] leading-relaxed">{selectedNodeForInspect.demonstratedPerformance}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5DDD0] space-y-1">
                  <span className="font-mono text-[10px] font-bold text-[#8C6527] uppercase block">Manufacturability &amp; Yield</span>
                  <p className="text-[#5A6E85] leading-relaxed">{selectedNodeForInspect.manufacturabilityAndReliability || 'Under qualification review'}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5DDD0] space-y-1">
                  <span className="font-mono text-[10px] font-bold text-[#8C6527] uppercase block">Engineering Relevance to Tech Gap</span>
                  <p className="text-[#5A6E85] leading-relaxed">{selectedNodeForInspect.relevanceToGap}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-between gap-3 relative z-10 text-xs">
              <span className="text-[#718096] font-mono text-[10px]">
                Source: {selectedNodeForInspect.sourceIdentifier}
              </span>
              <div className="flex items-center gap-2">
                {onOpenExecutiveDossier && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNodeForInspect(null);
                      onOpenExecutiveDossier();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#D5C8B5] hover:bg-[#FAF8F5] text-[#0F2038] font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#8C6527]" />
                    <span>Dossier</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onLaunchProjectFromEvidence(selectedNodeForInspect);
                    setSelectedNodeForInspect(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0F2038] hover:bg-[#1A365D] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Launch Project Room</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Provenance Inspector Seal Modal */}
      <CryptographicProvenanceInspectorModal
        isOpen={!!sealModalNode}
        onClose={() => setSealModalNode(null)}
        node={sealModalNode}
      />
    </div>
  );
};
