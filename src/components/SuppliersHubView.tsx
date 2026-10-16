import React, { useState, useMemo } from 'react';
import { SupplierItem, SupplierComponent } from '../types/qartinia';
import {
  Search,
  Cpu,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  Send,
  Building2,
  ShieldCheck,
  Tag,
  Sliders,
  DollarSign,
  Edit3,
} from 'lucide-react';
import { ShipWatermark, CarthageCornerMotif } from './CarthageArtwork';

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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sampleModalComponent, setSampleModalComponent] = useState<{
    supplier: SupplierItem;
    component: SupplierComponent;
  } | null>(null);

  // Edit Supplier State
  const [editingSupplier, setEditingSupplier] = useState<SupplierItem | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editTier, setEditTier] = useState<SupplierItem['tier']>('Tier 1 Certified');
  const [savingEdit, setSavingEdit] = useState(false);

  // Sample Request Form State
  const [quantity, setQuantity] = useState('5 pcs (Engineering Prototype Run)');
  const [targetApp, setTargetApp] = useState('800V GaN Traction Inverter Prototype');
  const [notes, setNotes] = useState(
    'Requesting bare die / top-side cooled discrete samples for high-frequency switching evaluation.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    suppliers.forEach((s) => {
      s.components.forEach((c) => set.add(c.category));
    });
    return ['All', ...Array.from(set)];
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchSearch =
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.headquarters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.components.some(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.specSummary.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchCategory =
        selectedCategory === 'All' ||
        supplier.components.some((c) => c.category === selectedCategory);
      return matchSearch && matchCategory;
    });
  }, [suppliers, searchQuery, selectedCategory]);

  const handleSubmitSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleModalComponent) return;
    setSubmitting(true);
    try {
      await onRequestSample({
        supplierId: sampleModalComponent.supplier.id,
        componentId: sampleModalComponent.component.id,
        componentName: sampleModalComponent.component.name,
        quantity,
        targetApplication: targetApp,
        notes,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSampleModalComponent(null);
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 lg:p-8 space-y-5 shadow-xs relative overflow-hidden">
        <CarthageCornerMotif className="w-8 h-8 absolute top-2 right-2 pointer-events-none opacity-40 text-[#8C6527]" />
        <ShipWatermark className="w-64 h-64 absolute -right-12 -bottom-12 pointer-events-none opacity-[0.08] text-[#0F2038]" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="text-xs font-bold text-[#8C6527] uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#8C6527]" />
              <span>Industrial Supply Chain Infrastructure</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2038] mt-1.5">
              Suppliers &amp; Component Fabricators
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6E85] mt-1 max-w-2xl leading-relaxed">
              Direct access to verified Tier 1/2 wide-bandgap semiconductor fabs, active metal brazed ceramic substrates, and automotive-qualified power stages.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#0F2038] bg-[#FAF8F5] border border-[#E5DDD0] p-3.5 rounded-xl self-start md:self-center shadow-2xs">
            <div>
              <span className="text-[#8C6527] block text-[10px] uppercase font-bold tracking-wider">Verified Fabs</span>
              <strong className="text-sm text-[#0F2038] font-bold">{suppliers.length}</strong>
            </div>
            <div className="h-6 w-px bg-[#E5DDD0]" />
            <div>
              <span className="text-[#8C6527] block text-[10px] uppercase font-bold tracking-wider">Indexed Parts</span>
              <strong className="text-sm text-[#0F2038] font-bold">
                {suppliers.reduce((acc, s) => acc + s.components.length, 0)}
              </strong>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8C6527] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by supplier name, part number, silicon carbide MOSFET, GaN HEMT, ceramic substrate..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527] text-[#0F2038] placeholder:text-[#A0AEC0] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
            {allCategories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0F2038] text-white font-bold shadow-2xs'
                    : 'bg-[#FAF8F5] border border-[#E5DDD0] text-[#5A6E85] hover:text-[#0F2038] hover:border-[#D5C8B5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Suppliers Directory Cards */}
      <div className="space-y-8">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden hover:border-[#D5C8B5] transition-all shadow-xs"
          >
            {/* Header Strip */}
            <div className="p-6 bg-[#FAF8F5] border-b border-[#E5DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif text-lg font-bold text-[#0F2038]">{supplier.name}</h2>
                  {supplier.verified && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Fabricator</span>
                    </span>
                  )}
                  {supplier.isDemo && (
                    <span className="text-[10px] font-mono font-medium text-[#8C6527] bg-[#FAF4EB] border border-[#D5C8B5] px-2 py-0.5 rounded">
                      Demo
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6E85]">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#8C6527]" />
                    <span>HQ: {supplier.headquarters} ({supplier.country})</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Capabilities: {supplier.capabilities.slice(0, 3).join(', ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#0F2038]">
                    Min Order: {supplier.minOrderQuantity}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-white border border-[#E5DDD0] text-[#0F2038] font-medium shadow-2xs">
                  Tier: <span className="text-[#8C6527] font-bold">{supplier.tier}</span>
                </span>
                {onUpdateSupplier && (currentUser?.role === 'admin' || currentUser?.role === 'platform_admin' || (supplier.organizationId && currentUser?.organizationId && supplier.organizationId === currentUser.organizationId)) && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSupplier(supplier);
                      setEditDescription(supplier.description);
                      setEditTier(supplier.tier);
                    }}
                    className="text-[11px] font-semibold text-[#5A6E85] bg-white border border-[#E5DDD0] hover:text-[#0F2038] hover:bg-[#FAF8F5] px-3 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Edit3 className="w-3 h-3 text-[#8C6527]" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed max-w-4xl">
                {supplier.description}
              </p>

              {/* Indexed Parts Grid */}
              <div>
                <div className="text-xs font-bold text-[#8C6527] uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#8C6527]" />
                  <span>Indexed Components &amp; Packaging ({supplier.components.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {supplier.components.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-4 rounded-xl border border-[#E5DDD0] bg-[#FAF8F5] hover:border-[#D5C8B5] transition-all flex flex-col justify-between space-y-3 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div>
                          <div className="text-[10px] font-mono text-[#8C6527] uppercase tracking-wider font-semibold">
                            {comp.category}
                          </div>
                          <h3 className="text-sm font-bold text-[#0F2038] font-serif mt-0.5">
                            {comp.name}
                          </h3>
                          <div className="text-xs font-mono text-[#5A6E85] mt-0.5">
                            Part #: {comp.partNumber}
                          </div>
                        </div>

                        {/* Specs Table */}
                        <div className="p-3 bg-white rounded-lg border border-[#E5DDD0] space-y-1 text-xs">
                          {comp.specSummary && (
                            <p className="text-[11px] text-[#5A6E85] leading-tight pb-1 border-b border-[#EBE3D7]">
                              {comp.specSummary}
                            </p>
                          )}
                          {comp.keyMetrics &&
                            Object.entries(comp.keyMetrics).map(([specKey, specVal]) => (
                              <div key={specKey} className="flex justify-between items-center text-[11px]">
                                <span className="text-[#5A6E85]">{specKey}:</span>
                                <span className="font-mono text-[#0F2038] font-semibold">{String(specVal)}</span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Card Action Strip */}
                      <div className="pt-3 border-t border-[#EBE3D7] flex items-center justify-between gap-2 text-xs">
                        <span className="text-[#5A6E85] flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-[#8C6527]" />
                          <span>Lead Time: ~{comp.leadTimeWeeks} wks</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setSampleModalComponent({ supplier, component: comp });
                            setQuantity('5 pcs (Engineering Samples)');
                          }}
                          className="px-3.5 py-1.5 font-serif font-bold text-xs text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
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

      {/* Floating Window: Engineering Sample Request Modal */}
      {sampleModalComponent && (
        <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E5DDD0] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#E5DDD0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FAF4EB] border border-[#D5C8B5] text-[#8C6527]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0F2038]">
                    Request Engineering Samples
                  </h3>
                  <div className="text-[11px] text-[#5A6E85] font-mono">
                    Direct Fabricator Procurement · {sampleModalComponent.supplier.name}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSampleModalComponent(null)}
                className="p-1.5 text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#0F2038]">
                  Sample Request Dispatched
                </h4>
                <p className="text-xs text-[#5A6E85] max-w-sm mx-auto leading-relaxed">
                  Your sample order has been registered in the Requests Pipeline and transmitted to {sampleModalComponent.supplier.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitSample} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="p-4 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl space-y-1">
                  <div className="font-serif font-bold text-sm text-[#0F2038]">
                    {sampleModalComponent.component.name}
                  </div>
                  <div className="text-[#5A6E85] font-mono text-xs">
                    Part ID: {sampleModalComponent.component.partNumber} · Fabricator: {sampleModalComponent.supplier.name}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Sample Quantity Needed *
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Target Application / Testing Envelope *
                  </label>
                  <input
                    type="text"
                    value={targetApp}
                    onChange={(e) => setTargetApp(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Evaluation Notes &amp; Packaging Specs
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>

                <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSampleModalComponent(null)}
                    className="px-4 py-2 border border-[#E5DDD0] rounded-xl font-semibold text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#0F2038] text-white font-serif font-bold rounded-xl hover:bg-[#1A365D] cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Dispatch Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Window: Edit Supplier Modal */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2038]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5DDD0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#E5DDD0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FAF4EB] border border-[#D5C8B5] text-[#8C6527]">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0F2038]">
                    Update Fabricator Specification
                  </h3>
                  <div className="text-[11px] text-[#5A6E85] font-mono">
                    {editingSupplier.name}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSupplier(null)}
                className="p-1.5 rounded-lg text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingSupplier || !onUpdateSupplier) return;
                setSavingEdit(true);
                try {
                  await onUpdateSupplier(editingSupplier.id, {
                    description: editDescription,
                    tier: editTier,
                  });
                  setEditingSupplier(null);
                } finally {
                  setSavingEdit(false);
                }
              }}
              className="p-6 overflow-y-auto space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#0F2038] mb-1">
                  Fabricator Capability Description *
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F2038] mb-1">
                  Fabricator Tier
                </label>
                <select
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value as SupplierItem['tier'])}
                  className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                >
                  <option value="Tier 1 Certified">Tier 1 Certified</option>
                  <option value="Tier 2 Qualified">Tier 2 Qualified</option>
                  <option value="Specialist Fabricator">Specialist Fabricator</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingSupplier(null)}
                  className="px-4 py-2 border border-[#E5DDD0] rounded-xl font-semibold text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-[#0F2038] text-white font-serif font-bold rounded-xl hover:bg-[#1A365D] cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{savingEdit ? 'Saving...' : 'Save Updates'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
