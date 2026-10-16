import React, { useState, useMemo } from 'react';
import { LabItem, LabEquipment } from '../types/qartinia';
import {
  Search,
  FlaskConical,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  Send,
  ShieldCheck,
  Building,
  Sliders,
  DollarSign,
  Activity,
  Edit3,
} from 'lucide-react';
import { TowerWatermark, CarthageCornerMotif } from './CarthageArtwork';

interface LaboratoriesHubViewProps {
  labs: LabItem[];
  onBookLab: (payload: {
    labId: string;
    labName: string;
    equipmentId: string;
    equipmentName: string;
    testingDomain: string;
    testRequirements: string;
    requestedDates: string;
  }) => Promise<void>;
  onUpdateLab?: (id: string, updates: Partial<LabItem>) => Promise<void>;
  currentUser?: any;
}

export const LaboratoriesHubView: React.FC<LaboratoriesHubViewProps> = ({
  labs,
  onBookLab,
  onUpdateLab,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [bookingModalEquipment, setBookingModalEquipment] = useState<{
    lab: LabItem;
    equipment: LabEquipment;
  } | null>(null);

  // Edit Lab State
  const [editingLab, setEditingLab] = useState<LabItem | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAvailability, setEditAvailability] = useState<LabItem['availabilityStatus']>('Available');
  const [editLeadScientist, setEditLeadScientist] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Booking Form State
  const [testDomain, setTestDomain] = useState('Wide-Bandgap Inverter Characterization');
  const [testRequirements, setTestRequirements] = useState(
    'Full WLTP drive-cycle sweep under 800V DC link with automated calorimetric loss measurement.'
  );
  const [requestedDates, setRequestedDates] = useState('Next 2-3 Weeks (Q4 Window)');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const allDomains = useMemo(() => {
    const set = new Set<string>();
    labs.forEach((lab) => {
      lab.testingDomains.forEach((d) => set.add(d));
    });
    return ['All', ...Array.from(set)];
  }, [labs]);

  const filteredLabs = useMemo(() => {
    return labs.filter((lab) => {
      const matchSearch =
        lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.equipmentList.some(
          (eq) =>
            eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            eq.model.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchDomain =
        selectedDomain === 'All' || lab.testingDomains.includes(selectedDomain);
      return matchSearch && matchDomain;
    });
  }, [labs, searchQuery, selectedDomain]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalEquipment) return;
    setSubmitting(true);
    try {
      await onBookLab({
        labId: bookingModalEquipment.lab.id,
        labName: bookingModalEquipment.lab.name,
        equipmentId: bookingModalEquipment.equipment.id,
        equipmentName: `${bookingModalEquipment.equipment.name} (${bookingModalEquipment.equipment.model})`,
        testingDomain: testDomain,
        testRequirements,
        requestedDates,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setBookingModalEquipment(null);
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
        <TowerWatermark className="w-64 h-64 absolute -right-12 -bottom-12 pointer-events-none opacity-[0.08] text-[#0F2038]" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="text-xs font-bold text-[#8C6527] uppercase tracking-wider font-mono flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#8C6527]" />
              <span>Testing &amp; Verification Infrastructure</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2038] mt-1.5">
              Accredited Laboratories &amp; Test Benches
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6E85] mt-1 max-w-2xl leading-relaxed">
              Book dedicated test slots on high-bandwidth dynamometer benches, acoustic microscopes, and semi-anechoic EMI chambers at premier academic and industrial institutions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#0F2038] bg-[#FAF8F5] border border-[#E5DDD0] p-3.5 rounded-xl self-start md:self-center shadow-2xs">
            <div>
              <span className="text-[#8C6527] block text-[10px] uppercase font-bold tracking-wider">Accredited Labs</span>
              <strong className="text-sm text-[#0F2038] font-bold">{labs.length}</strong>
            </div>
            <div className="h-6 w-px bg-[#E5DDD0]" />
            <div>
              <span className="text-[#8C6527] block text-[10px] uppercase font-bold tracking-wider">Test Rigs Indexed</span>
              <strong className="text-sm text-[#0F2038] font-bold">
                {labs.reduce((acc, l) => acc + l.equipmentList.length, 0)}
              </strong>
            </div>
          </div>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8C6527] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by institution, dynamometer, acoustic microscope, or test standard..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527] text-[#0F2038] placeholder:text-[#A0AEC0] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
            {allDomains.slice(0, 5).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                  selectedDomain === d
                    ? 'bg-[#0F2038] text-white font-bold shadow-2xs'
                    : 'bg-[#FAF8F5] border border-[#E5DDD0] text-[#5A6E85] hover:text-[#0F2038] hover:border-[#D5C8B5]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Laboratories Directory Cards */}
      <div className="space-y-8">
        {filteredLabs.map((lab) => (
          <div
            key={lab.id}
            className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden hover:border-[#D5C8B5] transition-all shadow-xs"
          >
            {/* Header Strip */}
            <div className="p-6 bg-[#FAF8F5] border-b border-[#E5DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif text-lg font-bold text-[#0F2038]">{lab.name}</h2>
                  {lab.verified && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified Test Lab</span>
                    </span>
                  )}
                  {lab.isDemo && (
                    <span className="text-[10px] font-mono font-medium text-[#8C6527] bg-[#FAF4EB] border border-[#D5C8B5] px-2 py-0.5 rounded">
                      Demo
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6E85]">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#8C6527]" />
                    <span>{lab.institution}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{lab.location}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#0F2038]">Lead: {lab.leadScientist}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-white border border-[#E5DDD0] text-[#0F2038] font-medium shadow-2xs">
                  Status: <span className="text-[#8C6527] font-bold">{lab.availabilityStatus}</span>
                </span>
                {onUpdateLab && (currentUser?.role === 'admin' || currentUser?.role === 'platform_admin' || (lab.organizationId && currentUser?.organizationId && lab.organizationId === currentUser.organizationId)) && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLab(lab);
                      setEditDescription(lab.description);
                      setEditAvailability(lab.availabilityStatus);
                      setEditLeadScientist(lab.leadScientist);
                    }}
                    className="text-[11px] font-semibold text-[#5A6E85] bg-white border border-[#E5DDD0] hover:text-[#0F2038] hover:bg-[#FAF8F5] px-3 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Edit3 className="w-3 h-3 text-[#8C6527]" />
                    <span>Edit Details</span>
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed max-w-4xl">
                {lab.description}
              </p>

              {/* Accreditations & Domains */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] space-y-2">
                  <span className="font-serif font-bold text-[#0F2038] block text-xs">
                    Accreditations &amp; Partnerships:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {lab.accreditations.map((acc, i) => (
                      <span key={i} className="bg-white border border-[#E5DDD0] text-[#0F2038] px-2.5 py-1 rounded-lg font-mono text-[11px] shadow-2xs">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] space-y-2">
                  <span className="font-serif font-bold text-[#0F2038] block text-xs">
                    Core Testing Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {lab.testingDomains.map((dom, i) => (
                      <span key={i} className="bg-white border border-[#E5DDD0] text-[#0F2038] px-2.5 py-1 rounded-lg font-mono text-[11px] shadow-2xs">
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Indexed Equipment Benches */}
              <div>
                <div className="text-xs font-bold text-[#8C6527] uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#8C6527]" />
                  <span>Indexed Test Benches &amp; Facilities ({lab.equipmentList.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lab.equipmentList.map((eq) => (
                    <div
                      key={eq.id}
                      className="p-4 rounded-xl border border-[#E5DDD0] bg-[#FAF8F5] hover:border-[#D5C8B5] transition-all flex flex-col justify-between space-y-3 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-sm font-bold text-[#0F2038] font-serif">{eq.name}</h3>
                          <div className="text-xs font-mono text-[#8C6527] font-semibold mt-0.5">
                            {eq.model} · {eq.manufacturer}
                          </div>
                        </div>

                        <div className="text-xs text-[#5A6E85] space-y-1 pt-1">
                          <div>
                            <span className="text-[#8C6527] font-medium">Operating Range: </span>
                            <span className="font-mono text-[11px] text-[#0F2038]">{eq.operatingRange}</span>
                          </div>
                          <div>
                            <span className="text-[#8C6527] font-medium">Throughput: </span>
                            <span className="text-[#0F2038]">{eq.sampleThroughput}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {eq.standardsCompliant.map((std) => (
                            <span key={std} className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-[#E5DDD0] text-[#5A6E85]">
                              {std}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#EBE3D7] flex items-center justify-between text-xs">
                        <span className="font-mono text-[#8C6527] font-bold">
                          {eq.hourlyRateEst}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setBookingModalEquipment({ lab, equipment: eq });
                          }}
                          className="px-3.5 py-1.5 font-serif font-bold text-xs text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Slot</span>
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

      {/* Floating Window: Test Slot Booking Modal */}
      {bookingModalEquipment && (
        <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E5DDD0] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#E5DDD0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FAF4EB] border border-[#D5C8B5] text-[#8C6527]">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0F2038]">
                    Reserve Test Bench Slot
                  </h3>
                  <div className="text-[11px] text-[#5A6E85] font-mono">
                    Facility Reservation · {bookingModalEquipment.lab.name}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalEquipment(null)}
                className="p-1.5 text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#0F2038]">
                  Test Slot Request Registered
                </h4>
                <p className="text-xs text-[#5A6E85] max-w-sm mx-auto leading-relaxed">
                  Your reservation request has been registered in the Requests Pipeline and queued for confirmation by {bookingModalEquipment.lab.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="p-4 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl space-y-1">
                  <div className="font-serif font-bold text-sm text-[#0F2038]">
                    {bookingModalEquipment.equipment.name}
                  </div>
                  <div className="text-[#5A6E85] font-mono text-xs">
                    {bookingModalEquipment.equipment.model} · {bookingModalEquipment.lab.name}
                  </div>
                  <div className="text-[11px] text-[#8C6527] font-mono font-bold pt-0.5">
                    Estimated Rate: {bookingModalEquipment.equipment.hourlyRateEst}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Testing Domain / Standard Protocol *
                  </label>
                  <input
                    type="text"
                    value={testDomain}
                    onChange={(e) => setTestDomain(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Desired Time Window *
                  </label>
                  <input
                    type="text"
                    value={requestedDates}
                    onChange={(e) => setRequestedDates(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Testing Protocol Requirements &amp; Sample Influx
                  </label>
                  <textarea
                    value={testRequirements}
                    onChange={(e) => setTestRequirements(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>

                <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setBookingModalEquipment(null)}
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
                    <span>{submitting ? 'Submitting...' : 'Confirm Reservation'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Window: Edit Laboratory Modal */}
      {editingLab && (
        <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E5DDD0] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#E5DDD0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FAF4EB] border border-[#D5C8B5] text-[#8C6527]">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0F2038]">
                    Edit Laboratory Details
                  </h3>
                  <div className="text-[11px] text-[#5A6E85] font-mono">
                    Facility Configuration · Ref: {editingLab.id}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingLab(null)}
                className="p-1.5 text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingLab || !onUpdateLab) return;
                setSavingEdit(true);
                try {
                  await onUpdateLab(editingLab.id, {
                    description: editDescription,
                    availabilityStatus: editAvailability,
                    leadScientist: editLeadScientist,
                  });
                  setEditingLab(null);
                } finally {
                  setSavingEdit(false);
                }
              }}
              className="p-6 overflow-y-auto space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#0F2038] mb-1">
                  Facility Description *
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Availability Status
                  </label>
                  <select
                    value={editAvailability}
                    onChange={(e) => setEditAvailability(e.target.value as LabItem['availabilityStatus'])}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  >
                    <option value="Available">Available</option>
                    <option value="Booking 2-3 Weeks Out">Booking 2-3 Weeks Out</option>
                    <option value="Restricted Access">Restricted Access</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Lead Scientist / Director *
                  </label>
                  <input
                    type="text"
                    value={editLeadScientist}
                    onChange={(e) => setEditLeadScientist(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingLab(null)}
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
