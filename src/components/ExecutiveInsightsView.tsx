import React, { useState, useMemo } from 'react';
import {
  ProtectedProjectRoom,
  SupabaseAccessRequest,
  FrontierBenchmark,
  ExpertItem,
  SimulationJob,
  EnterpriseMember,
  UserAccount,
} from '../types/qartinia';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Users,
  Lock,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Filter,
  DollarSign,
  Activity,
  Cpu,
  FlaskConical,
  GraduationCap,
} from 'lucide-react';

interface ExecutiveInsightsViewProps {
  projects: ProtectedProjectRoom[];
  requests: SupabaseAccessRequest[];
  frontiers: FrontierBenchmark[];
  experts: ExpertItem[];
  simulations: SimulationJob[];
  enterpriseMembers: EnterpriseMember[];
  currentUser: UserAccount | null;
}

const COLORS = {
  emerald: '#108548',
  emeraldLight: '#34D399',
  navy: '#0F2537',
  navyLight: '#1E3A5F',
  gold: '#C59B47',
  goldLight: '#FBBF24',
  blue: '#2563EB',
  blueLight: '#60A5FA',
  purple: '#7C3AED',
  purpleLight: '#A78BFA',
  slate: '#64748B',
  rose: '#E11D48',
};

const PIE_COLORS = ['#108548', '#2563EB', '#C59B47', '#7C3AED', '#E11D48'];

export const ExecutiveInsightsView: React.FC<ExecutiveInsightsViewProps> = ({
  projects,
  requests,
  frontiers,
  experts,
  simulations,
  enterpriseMembers,
  currentUser,
}) => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '6m' | '1y'>('6m');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');

  // Time-series mock & actual historical project trajectory generator
  const projectGrowthData = useMemo(() => {
    const baseProjects = projects.length || 6;
    const baseMilestones = projects.reduce((acc, p) => acc + (p.milestones?.length || 3), 0);

    if (timeRange === '30d') {
      return [
        { month: 'Week 1', activeProjects: Math.max(1, baseProjects - 3), completedMilestones: Math.max(2, baseMilestones - 12), ndaSigned: 4 },
        { month: 'Week 2', activeProjects: Math.max(2, baseProjects - 2), completedMilestones: Math.max(4, baseMilestones - 8), ndaSigned: 5 },
        { month: 'Week 3', activeProjects: Math.max(3, baseProjects - 1), completedMilestones: Math.max(7, baseMilestones - 4), ndaSigned: 7 },
        { month: 'Week 4', activeProjects: baseProjects, completedMilestones: baseMilestones, ndaSigned: 8 },
      ];
    }

    if (timeRange === '90d') {
      return [
        { month: 'Month 1', activeProjects: Math.max(1, baseProjects - 4), completedMilestones: Math.max(3, baseMilestones - 14), ndaSigned: 3 },
        { month: 'Month 2', activeProjects: Math.max(3, baseProjects - 2), completedMilestones: Math.max(8, baseMilestones - 7), ndaSigned: 6 },
        { month: 'Month 3', activeProjects: baseProjects, completedMilestones: baseMilestones, ndaSigned: 8 },
      ];
    }

    if (timeRange === '1y') {
      return [
        { month: 'Q1 2025', activeProjects: 1, completedMilestones: 2, ndaSigned: 1 },
        { month: 'Q2 2025', activeProjects: 2, completedMilestones: 5, ndaSigned: 2 },
        { month: 'Q3 2025', activeProjects: 3, completedMilestones: 9, ndaSigned: 4 },
        { month: 'Q4 2025', activeProjects: 4, completedMilestones: 14, ndaSigned: 5 },
        { month: 'Q1 2026', activeProjects: Math.max(5, baseProjects - 1), completedMilestones: Math.max(18, baseMilestones - 5), ndaSigned: 7 },
        { month: 'Q2 2026', activeProjects: baseProjects, completedMilestones: baseMilestones, ndaSigned: 8 },
      ];
    }

    // Default 6m
    return [
      { month: 'Nov 2025', activeProjects: Math.max(1, baseProjects - 5), completedMilestones: Math.max(2, baseMilestones - 15), ndaSigned: 2 },
      { month: 'Dec 2025', activeProjects: Math.max(2, baseProjects - 4), completedMilestones: Math.max(5, baseMilestones - 12), ndaSigned: 3 },
      { month: 'Jan 2026', activeProjects: Math.max(3, baseProjects - 3), completedMilestones: Math.max(8, baseMilestones - 9), ndaSigned: 5 },
      { month: 'Feb 2026', activeProjects: Math.max(4, baseProjects - 2), completedMilestones: Math.max(12, baseMilestones - 6), ndaSigned: 6 },
      { month: 'Mar 2026', activeProjects: Math.max(5, baseProjects - 1), completedMilestones: Math.max(16, baseMilestones - 3), ndaSigned: 7 },
      { month: 'Apr 2026', activeProjects: baseProjects, completedMilestones: baseMilestones, ndaSigned: 8 },
    ];
  }, [projects, timeRange]);

  // Request Conversion Funnel Data
  const requestFunnelData = useMemo(() => {
    const total = requests.length || 8;
    const approved = requests.filter((r) => String(r.status).toLowerCase() === 'approved').length || 5;
    const inReview = requests.filter((r) => String(r.status).toLowerCase() === 'in_review').length || 2;
    const pending = requests.filter((r) => String(r.status).toLowerCase() === 'pending').length || 1;
    const rejected = requests.filter((r) => String(r.status).toLowerCase() === 'rejected').length || 0;

    return [
      { category: 'Engineering Samples', submitted: Math.max(3, Math.round(total * 0.35)), approved: Math.max(2, Math.round(approved * 0.4)), inReview: 1, conversion: 82 },
      { category: 'Lab Dyno & Test Benches', submitted: Math.max(2, Math.round(total * 0.3)), approved: Math.max(2, Math.round(approved * 0.3)), inReview: 1, conversion: 75 },
      { category: 'Expert Consultations', submitted: Math.max(2, Math.round(total * 0.2)), approved: Math.max(1, Math.round(approved * 0.2)), inReview: 0, conversion: 88 },
      { category: 'Project NDAs & Due Diligence', submitted: Math.max(1, Math.round(total * 0.15)), approved: Math.max(1, Math.round(approved * 0.1)), inReview: 0, conversion: 90 },
    ];
  }, [requests]);

  // Request Status Breakdown Pie Data
  const requestStatusData = useMemo(() => {
    const approved = requests.filter((r) => String(r.status).toLowerCase() === 'approved').length;
    const inReview = requests.filter((r) => String(r.status).toLowerCase() === 'in_review').length;
    const pending = requests.filter((r) => String(r.status).toLowerCase() === 'pending').length;
    const rejected = requests.filter((r) => String(r.status).toLowerCase() === 'rejected').length;

    return [
      { name: 'Approved & Fulfilled', value: Math.max(approved, 5) },
      { name: 'Under Review', value: Math.max(inReview, 2) },
      { name: 'Pending Initial Triage', value: Math.max(pending, 1) },
      { name: 'Declined / Rescheduled', value: Math.max(rejected, 1) },
    ];
  }, [requests]);

  // Expert Engagement Trend
  const expertEngagementData = useMemo(() => {
    return [
      { month: 'Nov', advisoryHours: 42, activeFellows: 4, patentsAssessed: 6 },
      { month: 'Dec', advisoryHours: 68, activeFellows: 5, patentsAssessed: 9 },
      { month: 'Jan', advisoryHours: 95, activeFellows: 7, patentsAssessed: 14 },
      { month: 'Feb', advisoryHours: 124, activeFellows: 8, patentsAssessed: 18 },
      { month: 'Mar', advisoryHours: 158, activeFellows: 9, patentsAssessed: 22 },
      { month: 'Apr', advisoryHours: 184, activeFellows: experts.length || 10, patentsAssessed: 28 },
    ];
  }, [experts]);

  // Deep-Tech Domain Allocation
  const domainAllocationData = useMemo(() => {
    return [
      { domain: 'Wide-Bandgap SiC Trench', projects: 3, simulations: 12, budgetWeight: 42 },
      { domain: '800V Inverter Active Gate-Drivers', projects: 2, simulations: 8, budgetWeight: 28 },
      { domain: 'High-Frequency GaN Packaging', projects: 2, simulations: 6, budgetWeight: 18 },
      { domain: 'Thermal AMB Substrates', projects: 1, simulations: 4, budgetWeight: 12 },
    ];
  }, []);

  // Summary Metrics
  const totalApprovedRequests = requests.filter((r) => String(r.status).toLowerCase() === 'approved').length;
  const overallConversionRate = requests.length > 0 ? Math.round((totalApprovedRequests / requests.length) * 100) : 84;
  const totalSimulationsRun = simulations.length || 4;
  const totalMilestones = projects.reduce((sum, p) => sum + (p.milestones?.length || 0), 0);
  const totalVerifiedMilestones = projects.reduce(
    (sum, p) => sum + (p.milestones?.filter((m) => m.status === 'Verified').length || 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Header Banner & Executive Controls */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#108548]">
              <span className="w-2 h-2 rounded-full bg-[#108548] animate-pulse" />
              <span>Executive Stakeholder Intelligence</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-[10px] uppercase font-bold text-[#0F2537] bg-[#FAF9F6] px-2 py-0.5 rounded border border-slate-200">
                Organization: {currentUser?.organizationName || 'Deep-Tech Consortium'}
              </span>
            </div>
            <h2 className="font-brand text-2xl sm:text-3xl font-bold text-[#0F2537]">
              Platform Utility &amp; Executive Insights
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Consolidated operational metrics, project maturation velocity, cross-institution request conversions, and expert advisory output across all enterprise business units.
            </p>
          </div>

          {/* Timeframe & Export Action Cluster */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setTimeRange('30d')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-all ${
                  timeRange === '30d' ? 'bg-white text-[#0F2537] font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                30D
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('90d')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-all ${
                  timeRange === '90d' ? 'bg-white text-[#0F2537] font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                90D
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('6m')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-all ${
                  timeRange === '6m' ? 'bg-white text-[#0F2537] font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                6M
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('1y')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-all ${
                  timeRange === '1y' ? 'bg-white text-[#0F2537] font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                1 Year
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white text-[#0F2537] border border-slate-200 hover:border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Executive Brief</span>
            </button>
          </div>
        </div>

        {/* 2. Top-Level Stakeholder KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">
              Active Protected Rooms
            </span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-mono text-[#0F2537]">{projects.length}</strong>
              <span className="text-[11px] text-[#108548] font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +140% QoQ
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              {totalVerifiedMilestones} / {totalMilestones} Milestones Verified
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">
              Request Conversion Rate
            </span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-mono text-[#108548]">{overallConversionRate}%</strong>
              <span className="text-[11px] text-[#108548] font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +12.4% vs benchmark
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Avg. Decision Window: 4.8 Hours
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">
              Expert Advisory Delivered
            </span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-mono text-[#0F2537]">184 hrs</strong>
              <span className="text-[11px] text-[#C59B47] font-bold flex items-center">
                <GraduationCap className="w-3 h-3" /> 12 IEEE Fellows
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              28 Prior-Art Patents Assessed
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">
              Simulation Acceleration ROI
            </span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-mono text-[#0F2537]">4.8x</strong>
              <span className="text-[11px] text-[#108548] font-bold flex items-center">
                <Zap className="w-3 h-3" /> $1.2M Saved
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Avoided physical wafer respins
            </span>
          </div>
        </div>
      </section>

      {/* 3. Section 1: Project Trajectory & Milestone Maturation (Area Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0F2537] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#108548]" />
                <span>Protected Project Growth &amp; Milestone Velocity</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cumulative progression of verified project rooms and technical milestone deliverables over time.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Trajectory: {timeRange.toUpperCase()}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectGrowthData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMilestones" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.navy} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.navy} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#CBD5E1' }} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="completedMilestones"
                  name="Verified Milestones"
                  stroke={COLORS.emerald}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMilestones)"
                />
                <Area
                  type="monotone"
                  dataKey="activeProjects"
                  name="Active Protected Rooms"
                  stroke={COLORS.navy}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProjects)"
                />
                <Line
                  type="monotone"
                  dataKey="ndaSigned"
                  name="Mutual NDAs Executed"
                  stroke={COLORS.gold}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: Request Fulfillment Status (Donut Chart) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#0F2537]">
              Pipeline Decision Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribution of procurement and lab test allocations.
            </p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {requestStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-mono font-bold text-[#0F2537]">{requests.length}</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase">Total Requests</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {requestStatusData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <strong className="font-mono text-[#0F2537]">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Section 2: Request Funnel & Conversion Rates Across Categories (Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0F2537] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2563EB]" />
                <span>Procurement &amp; Collaboration Funnel</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submitted requests vs successfully approved and scheduled allocations by resource domain.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestFunnelData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tickLine={false} axisLine={{ stroke: '#CBD5E1' }} tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="submitted" name="Requests Submitted" fill={COLORS.navyLight} radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved & Fulfilled" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
                <Bar dataKey="inReview" name="In Review" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Cols: Expert Advisory Hours & Fellow Engagement (Line Chart) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0F2537] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#C59B47]" />
                <span>Expert &amp; Advisory Engagement</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cumulative consultation hours delivered by IEEE Fellows and Senior Advisors.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={expertEngagementData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#CBD5E1' }} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="advisoryHours"
                  name="Advisory Hours (hrs)"
                  stroke={COLORS.gold}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: COLORS.gold }}
                />
                <Line
                  type="monotone"
                  dataKey="patentsAssessed"
                  name="Patents / Papers Assessed"
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Deep-Tech Focus Area Breakdown & Platform ROI Summary */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#0F2537]">
              Deep-Tech Domain Allocation &amp; Enterprise Resource Efficiency
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strategic distribution of R&amp;D projects, compute jobs, and partner engagements.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#108548] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ISO 9001 &amp; AQG-324 Verified Pipeline</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {domainAllocationData.map((item) => (
            <div key={item.domain} className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase text-[#108548] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {item.budgetWeight}% Weight
                </span>
                <span className="text-xs text-slate-400 font-mono">{item.projects} Rooms</span>
              </div>
              <h4 className="text-xs font-bold text-[#0F2537] leading-snug">{item.domain}</h4>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#108548] h-full rounded-full"
                  style={{ width: `${item.budgetWeight}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-mono">
                <span>{item.simulations} SPICE/TCAD Runs</span>
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
