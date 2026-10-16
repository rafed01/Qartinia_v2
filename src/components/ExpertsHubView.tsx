import React, { useState } from 'react';
import { ExpertItem } from '../types/qartinia';
import {
  Search,
  GraduationCap,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  Clock,
  X,
  Send,
  Building,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Edit3,
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

  // Booking Form State
  const [preferredFormat, setPreferredFormat] = useState('1-Hour Deep-Dive Consultation');
  const [hours, setHours] = useState(1);
  const [topic, setTopic] = useState('Review Double-Pulse Gate Driver Parasitic Oscillations');
  const [projectContext, setProjectContext] = useState(
    'Evaluating 1200V SiC MOSFET switching trajectory at 800V DC link under high-slew-rate conditions.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredExperts = experts.filter((exp) => {
    const q = searchQuery.toLowerCase();
    return (
      exp.name.toLowerCase().includes(q) ||
      exp.affiliation.toLowerCase().includes(q) ||
      exp.domainExpertise.some((d) => d.toLowerCase().includes(q)) ||
      exp.title.toLowerCase().includes(q)
    );
  });

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
        preferredFormat,
        hours,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedExpert(null);
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
      <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 lg:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#8C6527] uppercase tracking-wider font-mono flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#8C6527]" />
              <span>Scientific Advisory &amp; Technical Council</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2038] mt-1.5">
              Domain Experts &amp; Principal Investigators
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6E85] mt-1 max-w-2xl leading-relaxed">
              Engage directly with world-renowned academic leaders, IEEE Fellows, packaging directors, and European patent attorneys for high-stakes technical reviews and IP strategy.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#0F2038] bg-[#FAF8F5] border border-[#E5DDD0] p-3.5 rounded-xl self-start md:self-center shadow-2xs">
            <div>
              <span className="text-[#8C6527] block text-[10px] uppercase font-bold tracking-wider">Verified Experts</span>
              <strong className="text-sm text-[#0F2038] font-bold">{experts.length}</strong>
            </div>
            <div className="h-6 w-px bg-[#E5DDD0]" />
            <div>
              <span className="text-[#8C6527] block text-[10px] uppercase font-bold tracking-wider">Indexed Publications</span>
              <strong className="text-sm text-[#0F2038] font-bold">
                {experts.reduce((acc, e) => acc + e.publicationsCount, 0)}+
              </strong>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="pt-2 relative max-w-md">
          <Search className="w-4 h-4 text-[#8C6527] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experts by name, institution, or domain (e.g. SiC, AQG-324, Patent)..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527] text-[#0F2038] placeholder:text-[#A0AEC0] transition-colors"
          />
        </div>
      </div>

      {/* Experts Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {filteredExperts.map((expert) => (
          <div
            key={expert.id}
            className="bg-white border border-[#E5DDD0] rounded-2xl p-6 flex flex-col justify-between hover:border-[#D5C8B5] shadow-xs transition-all duration-200 space-y-6"
          >
            <div className="space-y-4">
              {/* Profile Top Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#D5C8B5] text-[#0F2038] font-serif font-bold text-xl flex items-center justify-center shadow-2xs shrink-0">
                    {expert.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-lg font-bold text-[#0F2038]">{expert.name}</h2>
                      {expert.verified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-[#5A6E85] font-medium">{expert.title}</div>
                    <div className="text-xs text-[#8C6527] font-serif font-semibold mt-0.5">
                      {expert.affiliation}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[11px] font-mono text-[#8C6527] font-bold bg-[#FAF4EB] border border-[#D5C8B5] px-2.5 py-0.5 rounded-lg">
                    {expert.availability}
                  </span>
                  {onUpdateExpert && (currentUser?.role === 'admin' || currentUser?.role === 'platform_admin' || (expert.organizationId && currentUser?.organizationId && expert.organizationId === currentUser.organizationId)) && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExpert(expert);
                        setEditBio(expert.bio);
                        setEditFee(expert.advisoryFee);
                        setEditAvailability(expert.availability);
                        setEditLocation(expert.location);
                      }}
                      className="text-[10px] text-[#5A6E85] hover:text-[#0F2038] flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <Edit3 className="w-3 h-3 text-[#8C6527]" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-[#5A6E85] leading-relaxed line-clamp-3">
                {expert.bio}
              </p>

              {/* Specialties Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {expert.domainExpertise.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E5DDD0] text-[#0F2038]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Research Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-center text-xs shadow-2xs">
                <div>
                  <span className="text-[10px] text-[#5A6E85] block uppercase font-mono">Publications</span>
                  <strong className="text-sm font-bold text-[#0F2038] font-mono">
                    {expert.publicationsCount}
                  </strong>
                </div>
                <div className="border-x border-[#E5DDD0]">
                  <span className="text-[10px] text-[#5A6E85] block uppercase font-mono">Patents</span>
                  <strong className="text-sm font-bold text-[#0F2038] font-mono">
                    {expert.patentsCount}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#5A6E85] block uppercase font-mono">Experience</span>
                  <strong className="text-sm font-bold text-[#8C6527] font-mono">
                    {expert.yearsExperience} yrs
                  </strong>
                </div>
              </div>
            </div>

            {/* Bottom Booking Strip */}
            <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-between gap-4">
              <div className="flex items-center gap-1 text-xs text-[#5A6E85]">
                <MapPin className="w-3.5 h-3.5 text-[#8C6527]" />
                <span>{expert.location}</span>
                <span aria-hidden="true" className="mx-1">·</span>
                <span className="font-mono text-[#8C6527] font-bold">{expert.advisoryFee}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExpert(expert)}
                className="px-4 py-2 font-serif font-bold text-xs text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Advisory</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Window: Advisory Booking Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E5DDD0] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#E5DDD0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FAF4EB] border border-[#D5C8B5] text-[#8C6527]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0F2038]">
                    Consult with {selectedExpert.name}
                  </h3>
                  <div className="text-[11px] text-[#5A6E85] font-mono">
                    Scientific Advisory Reservation
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExpert(null)}
                className="p-1.5 text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#0F2038]">
                  Consultation Request Dispatched
                </h4>
                <p className="text-xs text-[#5A6E85] max-w-sm mx-auto leading-relaxed">
                  Your advisory request has been registered in the Requests Pipeline. {selectedExpert.name} has been notified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="p-4 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl space-y-1">
                  <div className="font-serif font-bold text-sm text-[#0F2038]">{selectedExpert.name}</div>
                  <div className="text-[#5A6E85] text-xs">{selectedExpert.title} · {selectedExpert.affiliation}</div>
                  <div className="text-[11px] text-[#8C6527] font-mono font-bold pt-1">
                    Advisory Fee: {selectedExpert.advisoryFee}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Engagement Format
                  </label>
                  <select
                    value={preferredFormat}
                    onChange={(e) => setPreferredFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
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
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Allocated Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Consultation Topic *
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Project Context &amp; Key Questions
                  </label>
                  <textarea
                    value={projectContext}
                    onChange={(e) => setProjectContext(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>

                <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedExpert(null)}
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

      {/* Floating Window: Edit Expert Modal */}
      {editingExpert && (
        <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E5DDD0] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#E5DDD0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FAF4EB] border border-[#D5C8B5] text-[#8C6527]">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0F2038]">
                    Edit Technical Advisory Profile
                  </h3>
                  <div className="text-[11px] text-[#5A6E85] font-mono">
                    Ref: {editingExpert.id}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingExpert(null)}
                className="p-1.5 text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
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
              className="p-6 overflow-y-auto space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#0F2038] mb-1">
                  Professional Bio &amp; Research Track Record *
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Advisory Rate *
                  </label>
                  <input
                    type="text"
                    value={editFee}
                    onChange={(e) => setEditFee(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Availability
                  </label>
                  <select
                    value={editAvailability}
                    onChange={(e) => setEditAvailability(e.target.value as ExpertItem['availability'])}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  >
                    <option value="Open for Consultations">Open for Consultations</option>
                    <option value="Project Advisory Only">Project Advisory Only</option>
                    <option value="Waitlist">Waitlist</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingExpert(null)}
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
