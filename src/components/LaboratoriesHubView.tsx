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
} from 'lucide-react';

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
}

export const LaboratoriesHubView: React.FC<LaboratoriesHubViewProps> = ({
  labs,
  onBookLab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [bookingModalEquipment, setBookingModalEquipment] = useState<{
    lab: LabItem;
    equipment: LabEquipment;
  } | null>(null);

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
              Testing &amp; Verification Infrastructure
            </div>
            <h1 className="font-brand text-2xl sm:text-3xl font-bold text-[#0F2537] mt-1">
              Accredited Laboratories &amp; Test Benches
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Book dedicated test slots on high-bandwidth dynamometer benches, acoustic microscopes, and semi-anechoic EMI chambers at premier academic and industrial institutions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-600 bg-[#FAF9F6] border border-slate-200 p-3 rounded-lg self-start md:self-center">
            <div>
              <span className="text-slate-400 block">Accredited Labs:</span>
              <strong className="text-sm text-[#0F2537]">{labs.length}</strong>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block">Test Rigs Indexed:</span>
              <strong className="text-sm text-[#0F2537]">
                {labs.reduce((acc, l) => acc + l.equipmentList.length, 0)}
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
              placeholder="Search by institution, dynamometer, acoustic microscope, or test standard..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF9F6] border border-slate-200 rounded-lg focus:outline-none focus:border-[#0F2537] text-[#0F2537]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
            {allDomains.slice(0, 4).map((d) => (
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

      {/* Laboratories Directory Cards */}
      <div className="space-y-8">
        {filteredLabs.map((lab) => (
          <div
            key={lab.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
          >
            {/* Header Strip */}
            <div className="p-6 bg-[#FAF9F6] border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-[#0F2537]">{lab.name}</h2>
                  {lab.verified && (
                    <span className="text-[11px] font-semibold text-[#108548] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Certified Test Lab</span>
                    </span>
                  )}
                  {lab.isDemo && (
                    <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      Demo Record
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lab.institution}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{lab.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>Lead: {lab.leadScientist}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
                  Status: {lab.availabilityStatus}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
                {lab.description}
              </p>

              {/* Accreditations & Domains */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-1.5">
                  <span className="font-semibold text-[#0F2537] block">
                    Accreditations &amp; Partnerships:
                  </span>
                  <div className="flex flex-wrap gap-2 text-slate-600">
                    {lab.accreditations.map((acc, i) => (
                      <span key={i} className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono text-[11px]">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-1.5">
                  <span className="font-semibold text-[#0F2537] block">
                    Core Testing Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-2 text-slate-600">
                    {lab.testingDomains.map((dom, i) => (
                      <span key={i} className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono text-[11px]">
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Indexed Equipment Benches */}
              <div>
                <div className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider mb-3">
                  Indexed Test Benches &amp; Facilities ({lab.equipmentList.length})
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lab.equipmentList.map((eq) => (
                    <div
                      key={eq.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-sm font-bold text-[#0F2537]">{eq.name}</h3>
                          <div className="text-xs font-mono text-[#108548] font-semibold mt-0.5">
                            {eq.model} · {eq.manufacturer}
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1 pt-1">
                          <div>
                            <span className="text-slate-400">Operating Range: </span>
                            <span className="font-mono text-[11px] text-slate-800">{eq.operatingRange}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Throughput: </span>
                            <span>{eq.sampleThroughput}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {eq.standardsCompliant.map((std) => (
                            <span key={std} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-slate-200 text-slate-600">
                              {std}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-mono text-[#0F2537] font-semibold">
                          {eq.hourlyRateEst}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setBookingModalEquipment({ lab, equipment: eq });
                          }}
                          className="px-3 py-1.5 font-semibold text-xs text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Calendar className="w-3 h-3 text-[#C59B47]" />
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

      {/* Test Slot Booking Modal */}
      {bookingModalEquipment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-[#108548] uppercase tracking-wider">
                  Test Facility Booking
                </div>
                <h3 className="text-lg font-bold text-[#0F2537]">
                  Reserve Test Bench Slot
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalEquipment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#108548] mx-auto" />
                <h4 className="text-base font-bold text-[#0F2537]">
                  Test Slot Request Registered
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your reservation request has been registered in the Requests Pipeline (logged in Supabase `public.requests`) and queued for confirmation by {bookingModalEquipment.lab.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
                <div className="p-3 bg-[#FAF9F6] border border-slate-200 rounded-lg space-y-1">
                  <div className="font-bold text-[#0F2537]">
                    {bookingModalEquipment.equipment.name}
                  </div>
                  <div className="text-slate-500 font-mono">
                    {bookingModalEquipment.equipment.model} · {bookingModalEquipment.lab.name}
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono">
                    Estimated Rate: {bookingModalEquipment.equipment.hourlyRateEst}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Testing Domain / Standard Protocol
                  </label>
                  <input
                    type="text"
                    value={testDomain}
                    onChange={(e) => setTestDomain(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Desired Time Window
                  </label>
                  <input
                    type="text"
                    value={requestedDates}
                    onChange={(e) => setRequestedDates(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Testing Protocol Requirements &amp; Sample Influx
                  </label>
                  <textarea
                    value={testRequirements}
                    onChange={(e) => setTestRequirements(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setBookingModalEquipment(null)}
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
                    <span>{submitting ? 'Submitting...' : 'Confirm Test Reservation'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
