import React, { useState, useMemo } from 'react';
import { ExpertItem } from '../types/qartinia';
import {
  Search,
  GraduationCap,
  Star,
  Award,
  BookOpen,
  FileCheck,
  Send,
  X,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

interface ExpertsHubViewProps {
  experts: ExpertItem[];
  onBookExpert: (payload: {
    expertId: string;
    expertName: string;
    topic: string;
    projectContext: string;
    preferredFormat: string;
    hours: number;
  }) => Promise<void>;
  onUpdateExpert?: (id: string, updates: Partial<ExpertItem>) => Promise<void>;
  currentUser?: any;
}

export const ExpertsHubView: React.FC<ExpertsHubViewProps> = ({
  experts,
  onBookExpert,
  onUpdateExpert,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<ExpertItem | null>(null);

  // Edit Expert State
  const [editingExpert, setEditingExpert] = useState<ExpertItem | null>(null);
  const [editBio, setEditBio] = useState('');
  const [editFee, setEditFee] = useState('');
  const [editAvailability, setEditAvailability] = useState<ExpertItem['availability']>('Open for Consultations');
  const [editLocation, setEditLocation] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Booking Modal State
  const [topic, setTopic] = useState('Active Gate Driver Trajectory & ZVS Pareto Optimization');
  const [projectContext, setProjectContext] = useState(
    '800V SiC Traction Inverter program aiming for 98.7% WLTP efficiency under CISPR 25 Class 5 EMI limits.'
  );
  const [format, setFormat] = useState('1-Hour Deep-Dive Consultation');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredExperts = useMemo(() => {
    return experts.filter((exp) => {
      const q = searchQuery.toLowerCase();
      return (
        exp.name.toLowerCase().includes(q) ||
        exp.affiliation.toLowerCase().includes(q) ||
        exp.title.toLowerCase().includes(q) ||
        exp.domainExpertise.some((d) => d.toLowerCase().includes(q))
      );
    });
  }, [experts, searchQuery]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpert) return;
    setSubmitting(true);
    try {
      await onBookExpert({
        expertId: selectedExpert.id,
        expertName: selectedExpert.name,
        topic,
        projectContext,
        preferredFormat: format,
        hours: 1,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedExpert(null);
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
              Scientific Advisory &amp; Technical Council
            </div>
            <h1 className="font-brand text-2xl sm:text-3xl font-bold text-[#0F2537] mt-1">
              Domain Experts &amp; Principal Investigators
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Engage directly with world-renowned academic leaders, IEEE Fellows, packaging directors, and European patent attorneys for high-stakes technical reviews and IP strategy.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-600 bg-[#FAF9F6] border border-slate-200 p-3 rounded-lg self-start md:self-center">
            <div>
              <span className="text-slate-400 block">Verified Experts:</span>
              <strong className="text-sm text-[#0F2537]">{experts.length}</strong>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block">Indexed Publications:</span>
              <strong className="text-sm text-[#0F2537]">
                {experts.reduce((acc, e) => acc + e.publicationsCount, 0)}+
              </strong>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="pt-2 relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experts by name, institution, or domain (e.g. SiC, AQG-324, Patent)..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF9F6] border border-slate-200 rounded-lg focus:outline-none focus:border-[#0F2537] text-[#0F2537]"
          />
        </div>
      </div>

      {/* Expert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperts.map((exp) => (
          <div
            key={exp.id}
            className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#0F2537] flex items-center gap-1.5">
                    <span>{exp.name}</span>
                    {exp.verified && <ShieldCheck className="w-4 h-4 text-[#108548]" />}
                    {exp.isDemo && (
                      <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                        Demo Record
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{exp.title}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{exp.location}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#0F2537] block">
                    {exp.advisoryFee}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Rate</span>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#FAF9F6] border border-slate-200 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Papers</span>
                  <strong className="font-mono text-[#0F2537]">{exp.publicationsCount}</strong>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-mono">Patents</span>
                  <strong className="font-mono text-[#0F2537]">{exp.patentsCount}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Experience</span>
                  <strong className="font-mono text-[#0F2537]">{exp.yearsExperience} yrs</strong>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 leading-relaxed">{exp.bio}</p>

              {/* Domains */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {exp.domainExpertise.map((dom) => (
                  <span
                    key={dom}
                    className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium"
                  >
                    {dom}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">{exp.availability}</span>

              <div className="flex items-center gap-2">
                {onUpdateExpert && (currentUser?.role === 'admin' || currentUser?.role === 'platform_admin' || (exp.profileId && currentUser?.id && exp.profileId === currentUser.id) || (exp.organizationId && currentUser?.organizationId && exp.organizationId === currentUser.organizationId)) && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingExpert(exp);
                      setEditBio(exp.bio);
                      setEditFee(exp.advisoryFee);
                      setEditAvailability(exp.availability);
                      setEditLocation(exp.location);
                    }}
                    className="px-2.5 py-1.5 font-semibold text-xs text-[#0F2537] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Edit Profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedExpert(exp)}
                  className="px-3.5 py-1.5 font-semibold text-xs text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#C59B47]" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Booking Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-[#108548] uppercase tracking-wider">
                  Advisory Session Reservation
                </div>
                <h3 className="text-lg font-bold text-[#0F2537]">
                  Consult with {selectedExpert.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExpert(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#108548] mx-auto" />
                <h4 className="text-base font-bold text-[#0F2537]">
                  Consultation Request Dispatched
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your advisory request has been registered in the Requests Pipeline (logged in Supabase `public.requests`) with `request_type: expert_consultation`. {selectedExpert.name} has been notified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
                <div className="p-3 bg-[#FAF9F6] border border-slate-200 rounded-lg space-y-1">
                  <div className="font-bold text-[#0F2537]">{selectedExpert.name}</div>
                  <div className="text-slate-500">{selectedExpert.title} · {selectedExpert.affiliation}</div>
                  <div className="text-[11px] text-slate-600 font-mono">
                    Advisory Fee: {selectedExpert.advisoryFee}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Engagement Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="1-Hour Deep-Dive Consultation">1-Hour Deep-Dive Consultation</option>
                    <option value="Freedom-to-Operate &amp; Patent Landscape Review">
                      Freedom-to-Operate &amp; Patent Landscape Review
                    </option>
                    <option value="Experimental Test Protocol Review">
                      Experimental Test Protocol Review
                    </option>
                    <option value="Ongoing Project Room Advisory (Monthly)">
                      Ongoing Project Room Advisory (Monthly)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Consultation Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Project Context &amp; Key Questions
                  </label>
                  <textarea
                    value={projectContext}
                    onChange={(e) => setProjectContext(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedExpert(null)}
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
                    <span>{submitting ? 'Submitting...' : 'Dispatch Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Edit Expert Modal */}
      {editingExpert && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-[#108548] uppercase tracking-wider">
                  Expert Profile Configuration
                </div>
                <h3 className="text-lg font-bold text-[#0F2537]">
                  Edit Technical Advisory Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingExpert(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingExpert || !onUpdateExpert) return;
                setSavingEdit(true);
                try {
                  await onUpdateExpert(editingExpert.id, {
                    bio: editBio,
                    advisoryFee: editFee,
                    availability: editAvailability,
                    location: editLocation,
                  });
                  setEditingExpert(null);
                } finally {
                  setSavingEdit(false);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#0F2537] mb-1">
                  Professional Bio &amp; Research Track Record
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Advisory Rate
                  </label>
                  <input
                    type="text"
                    value={editFee}
                    onChange={(e) => setEditFee(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Availability
                  </label>
                  <select
                    value={editAvailability}
                    onChange={(e) => setEditAvailability(e.target.value as ExpertItem['availability'])}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="Open for Consultations">Open for Consultations</option>
                    <option value="Project Advisory Only">Project Advisory Only</option>
                    <option value="Waitlist">Waitlist</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingExpert(null)}
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
