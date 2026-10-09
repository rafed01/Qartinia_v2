import React, { useState, useMemo } from 'react';
import { SupplierItem, SupplierComponent } from '../types/qartinia';
import {
  Search,
  Cpu,
  Package,
  ShieldCheck,
  ExternalLink,
  Send,
  X,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  Filter,
} from 'lucide-react';

interface SuppliersHubViewProps {
  suppliers: SupplierItem[];
  onRequestSample: (payload: {
    supplierId: string;
    componentId: string;
    componentName: string;
    quantity: string;
    targetApplication: string;
    notes: string;
  }) => Promise<void>;
  onUpdateSupplier?: (id: string, updates: Partial<SupplierItem>) => Promise<void>;
  currentUser?: any;
}

export const SuppliersHubView: React.FC<SuppliersHubViewProps> = ({
  suppliers,
  onRequestSample,
  onUpdateSupplier,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null);
  const [sampleModalComponent, setSampleModalComponent] = useState<{
    supplier: SupplierItem;
    component: SupplierComponent;
  } | null>(null);

  // Edit Supplier State
  const [editingSupplier, setEditingSupplier] = useState<SupplierItem | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editTier, setEditTier] = useState<SupplierItem['tier']>('Specialist Fabricator');
  const [editContactEmail, setEditContactEmail] = useState('');
  const [editMinOrder, setEditMinOrder] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Sample Request Modal State
  const [quantity, setQuantity] = useState('5 pcs (Engineering Samples)');
  const [targetApp, setTargetApp] = useState('800V Automotive Traction Inverter Dyno Bench');
  const [notes, setNotes] = useState('Requesting samples with PPAP documentation and low-inductance packaging.');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const domains = useMemo(() => {
    const set = new Set<string>();
    suppliers.forEach((s) => set.add(s.domain));
    return ['All', ...Array.from(set)];
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.components.some(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.specSummary.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchDomain = selectedDomain === 'All' || s.domain === selectedDomain;
      return matchSearch && matchDomain;
    });
  }, [suppliers, searchQuery, selectedDomain]);

  const handleSubmitSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleModalComponent) return;
    setSubmitting(true);
    try {
      await onRequestSample({
        supplierId: sampleModalComponent.supplier.id,
        componentId: sampleModalComponent.component.id,
        componentName: `${sampleModalComponent.component.name} (${sampleModalComponent.component.partNumber})`,
        quantity,
        targetApplication: targetApp,
        notes,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSampleModalComponent(null);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#108548] uppercase tracking-wider">
              Industrial Supply Chain Infrastructure
            </div>
            <h1 className="font-brand text-2xl sm:text-3xl font-bold text-[#0F2537] mt-1">
              Suppliers &amp; Component Fabricators
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Direct access to verified Tier 1/2 wide-bandgap semiconductor fabs, active metal brazed ceramic substrates, and automotive-qualified power stages.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-600 bg-[#FAF9F6] border border-slate-200 p-3 rounded-lg self-start md:self-center">
            <div>
              <span className="text-slate-400 block">Verified Fabs:</span>
              <strong className="text-sm text-[#0F2537]">{suppliers.length}</strong>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block">Indexed Parts:</span>
              <strong className="text-sm text-[#0F2537]">
                {suppliers.reduce((acc, s) => acc + s.components.length, 0)}
              </strong>
            </div>
          </div>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components by part number, material (SiC, AMB, GaN), or manufacturer..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF9F6] border border-slate-200 rounded-lg focus:outline-none focus:border-[#0F2537] text-[#0F2537]"
            />
          </div>

          {/* Domain Segmented Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
            {domains.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedDomain === d
                    ? 'bg-[#0F2537] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="space-y-8">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
          >
            {/* Supplier Header Banner */}
            <div className="p-6 bg-[#FAF9F6] border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-[#0F2537]">{supplier.name}</h2>
                  {supplier.verified && (
                    <span className="text-[11px] font-semibold text-[#108548] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Fabricator</span>
                    </span>
                  )}
                  {supplier.isDemo && (
                    <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      Demo Record
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{supplier.headquarters} ({supplier.country})</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-700 font-medium">{supplier.tier}</span>
                  <span aria-hidden="true">·</span>
                  <span>Domain: {supplier.domain}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {supplier.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded"
                  >
                    {cert}
                  </span>
                ))}
                {onUpdateSupplier && (currentUser?.role === 'admin' || currentUser?.role === 'platform_admin' || (supplier.organizationId && currentUser?.organizationId && supplier.organizationId === currentUser.organizationId)) && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSupplier(supplier);
                      setEditDescription(supplier.description);
                      setEditTier(supplier.tier);
                      setEditContactEmail(supplier.contactEmail);
                      setEditMinOrder(supplier.minOrderQuantity);
                    }}
                    className="text-[11px] font-semibold text-[#0F2537] bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    Edit Details
                  </button>
                )}
              </div>
            </div>

            {/* Supplier Body: Capabilities & Indexed Components */}
            <div className="p-6 space-y-6">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
                {supplier.description}
              </p>

              <div>
                <div className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider mb-2">
                  Fab &amp; Packaging Capabilities
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-600">
                  {supplier.capabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#FAF9F6] border border-slate-200 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#108548] shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indexed Parts Grid */}
              <div>
                <div className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider mb-3">
                  Qualified Components &amp; Bare Dies ({supplier.components.length})
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supplier.components.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold text-[#0F2537]">{comp.name}</h3>
                            <div className="text-xs font-mono text-[#108548] font-semibold mt-0.5">
                              Part #: {comp.partNumber}
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {comp.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {comp.specSummary}
                        </p>

                        {/* Metric Grid */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                          {Object.entries(comp.keyMetrics).map(([k, v]) => (
                            <div key={k} className="p-1.5 rounded bg-[#FAF9F6]">
                              <span className="text-[10px] text-slate-500 block truncate">{k}</span>
                              <strong className="text-xs font-mono text-[#0F2537]">{v}</strong>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Action Strip */}
                      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Lead Time: ~{comp.leadTimeWeeks} wks</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setSampleModalComponent({ supplier, component: comp });
                            setQuantity('5 pcs (Engineering Samples)');
                          }}
                          className="px-3 py-1.5 font-semibold text-xs text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3 h-3 text-[#C59B47]" />
                          <span>Request Samples</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Engineering Sample Request Modal */}
      {sampleModalComponent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-[#108548] uppercase tracking-wider">
                  Direct Supplier Procurement
                </div>
                <h3 className="text-lg font-bold text-[#0F2537]">
                  Request Engineering Samples
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSampleModalComponent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#108548] mx-auto" />
                <h4 className="text-base font-bold text-[#0F2537]">
                  Sample Request Dispatched
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your sample order has been registered in the Requests Pipeline (logged in Supabase `public.requests`) and transmitted to {sampleModalComponent.supplier.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitSample} className="space-y-4 text-xs">
                <div className="p-3 bg-[#FAF9F6] border border-slate-200 rounded-lg space-y-1">
                  <div className="font-bold text-[#0F2537]">
                    {sampleModalComponent.component.name}
                  </div>
                  <div className="text-slate-500 font-mono">
                    Part ID: {sampleModalComponent.component.partNumber} · Fabricator: {sampleModalComponent.supplier.name}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Sample Quantity Needed
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Target Application / Testing Envelope
                  </label>
                  <input
                    type="text"
                    value={targetApp}
                    onChange={(e) => setTargetApp(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Evaluation Notes &amp; Packaging Specs
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSampleModalComponent(null)}
                    className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#0F2537] text-white font-semibold rounded-lg hover:bg-[#16344D] cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C59B47]" />
                    <span>{submitting ? 'Submitting to Queue...' : 'Dispatch Sample Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Edit Supplier Modal */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#0F2537] text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#C59B47] uppercase tracking-wider block">
                  Update Fabricator Specification
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {editingSupplier.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSupplier(null)}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!onUpdateSupplier) return;
                setSavingEdit(true);
                try {
                  await onUpdateSupplier(editingSupplier.id, {
                    description: editDescription,
                    tier: editTier,
                    contactEmail: editContactEmail,
                    minOrderQuantity: editMinOrder,
                  });
                  setEditingSupplier(null);
                } catch (err) {
                  console.error(err);
                } finally {
                  setSavingEdit(false);
                }
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#0F2537] mb-1">
                  Description &amp; Operational Capability
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F2537] mb-1">
                  Certification Tier
                </label>
                <select
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white"
                >
                  <option value="Tier 1 Certified">Tier 1 Certified</option>
                  <option value="Tier 2 Qualified">Tier 2 Qualified</option>
                  <option value="Specialist Fabricator">Specialist Fabricator</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={editContactEmail}
                    onChange={(e) => setEditContactEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Min Order Quantity
                  </label>
                  <input
                    type="text"
                    value={editMinOrder}
                    onChange={(e) => setEditMinOrder(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingSupplier(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-[#0F2537] text-white font-semibold rounded-lg hover:bg-[#16344D] cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#C59B47]" />
                  <span>{savingEdit ? 'Saving...' : 'Save Updates to Supabase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
