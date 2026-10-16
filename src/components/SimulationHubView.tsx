import React, { useState } from 'react';
import { SimulationJob } from '../types/qartinia';
import {
  Activity,
  Play,
  CheckCircle2,
  Sliders,
  Layers,
  Cpu,
  RefreshCw,
  BarChart3,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ThermalHeatmapCanvas } from './ThermalHeatmapCanvas';

interface SimulationHubViewProps {
  simulations: SimulationJob[];
  onRunSimulation: (payload: {
    title: string;
    tool: any;
    domain: string;
    parameters: Record<string, string | number>;
  }) => Promise<void>;
}

export const SimulationHubView: React.FC<SimulationHubViewProps> = ({
  simulations,
  onRunSimulation,
}) => {
  const [selectedSim, setSelectedSim] = useState<SimulationJob>(
    simulations[0] || {
      id: 'sim-default',
      title: 'Double-Pulse GaN Inverter Switching Transient',
      domain: 'Power Electronics',
      tool: 'SPICE',
      status: 'Completed',
      inputParameters: {
        'DC Bus Voltage (Vdc)': '800 V',
        'Peak Current (Ipk)': '450 A',
        'Stray Inductance (Lloop)': '1.8 nH',
        'Junction Temp (Tj)': '125 °C',
        'Gate Resistor (Rg_on)': '1.8 Ω',
      },
      runtimeSeconds: 14.2,
      submittedAt: '2026-10-04 09:12',
      completedAt: '2026-10-04 09:12',
      summaryMetrics: {
        'Turn-on Energy (E_on)': '4.2 mJ (-58% vs baseline)',
        'Turn-off Energy (E_off)': '2.8 mJ',
        'Peak Over-Voltage (V_ds_max)': '912 V (< 1200V rating)',
        'dV/dt Slew Rate': '44.2 V/ns',
        'Simulated WLTP Efficiency': '98.74 %',
      },
      outputWaveformData: [
        { time: 0, value: 0 },
        { time: 5, value: 12 },
        { time: 10, value: 85 },
        { time: 15, value: 450 },
        { time: 20, value: 448 },
        { time: 25, value: 442 },
        { time: 30, value: 440 },
        { time: 35, value: 380 },
        { time: 40, value: 120 },
        { time: 45, value: 8 },
        { time: 50, value: 0 },
      ],
      resultReport:
        'Simulation confirms stable switching under 800V DC link with peak overshoot restricted to 912V (24% safety margin below 1200V dielectric breakdown). Active gate current boost successfully compresses current rise time without exciting parasitic LC resonance.',
    }
  );

  // Parameter Adjustment State
  const [vdc, setVdc] = useState(800);
  const [ipk, setIpk] = useState(450);
  const [lloop, setLloop] = useState(1.8);
  const [tj, setTj] = useState(125);
  const [rgon, setRgon] = useState(1.8);
  const [running, setRunning] = useState(false);

  // Custom synthetic waveform based on parameters
  const waveform = selectedSim.outputWaveformData || [
    { time: 0, value: 0 },
    { time: 5, value: Math.round(ipk * 0.05) },
    { time: 10, value: Math.round(ipk * 0.2) },
    { time: 15, value: ipk },
    { time: 20, value: Math.round(ipk * 0.98) },
    { time: 25, value: Math.round(ipk * 0.96) },
    { time: 30, value: Math.round(ipk * 0.95) },
    { time: 35, value: Math.round(ipk * 0.8) },
    { time: 40, value: Math.round(ipk * 0.25) },
    { time: 45, value: Math.round(ipk * 0.02) },
    { time: 50, value: 0 },
  ];

  const handleExecuteRun = async () => {
    setRunning(true);
    try {
      await onRunSimulation({
        title: `${selectedSim.tool} Transient Sweep (Vdc=${vdc}V, Ipk=${ipk}A)`,
        domain: selectedSim.domain,
        tool: selectedSim.tool,
        parameters: {
          'DC Bus Voltage (Vdc)': `${vdc} V`,
          'Peak Current (Ipk)': `${ipk} A`,
          'Stray Inductance (Lloop)': `${lloop} nH`,
          'Junction Temp (Tj)': `${tj} °C`,
          'Gate Resistor (Rg_on)': `${rgon} Ω`,
        },
      });
    } finally {
      setRunning(false);
    }
  };

  const maxVal = Math.max(...waveform.map((w) => w.value), ipk);
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 35;

  const points = waveform
    .map((pt, i) => {
      const x = padding + (i / (waveform.length - 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - (pt.value / (maxVal || 1)) * (svgHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 lg:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#8C6527] uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#8C6527]" />
              <span>Computational Physics &amp; Circuit Modeling</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2038] mt-1.5">
              Simulation Studio
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6E85] mt-1 max-w-2xl leading-relaxed">
              Execute SPICE transient double-pulse gate trajectory sweeps, TCAD semiconductor electric field breakdowns, and DFT ceramic bonding models before hardware prototyping.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#0F2038] bg-[#FAF8F5] border border-[#E5DDD0] p-3.5 rounded-xl self-start md:self-center shadow-2xs">
            <div>
              <span className="text-[#8C6527] block text-[10px] uppercase font-bold tracking-wider">Engines</span>
              <strong className="text-sm text-[#0F2038] font-bold">SPICE · TCAD · DFT</strong>
            </div>
            <div className="h-6 w-px bg-[#E5DDD0]" />
            <div>
              <span className="text-[#8C6527] block text-[10px] uppercase font-bold tracking-wider">Runs Logged</span>
              <strong className="text-sm text-[#0F2038] font-bold">{simulations.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Jobs Drawer (Left) & Active Simulation Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Simulation Jobs Selector */}
        <div className="lg:col-span-4 bg-white border border-[#E5DDD0] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D7]">
            <h2 className="text-xs font-bold text-[#8C6527] uppercase tracking-wider font-mono">
              Simulation Runs ({simulations.length})
            </h2>
            <span className="text-[11px] font-mono text-[#5A6E85]">History</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {simulations.map((sim) => {
              const isSelected = selectedSim.id === sim.id;
              return (
                <button
                  key={sim.id}
                  type="button"
                  onClick={() => setSelectedSim(sim)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFDF7] border-[#8C6527] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E5DDD0] hover:bg-white hover:border-[#D5C8B5]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#8C6527] px-2 py-0.5 rounded bg-white border border-[#E5DDD0]">
                      {sim.tool}
                    </span>
                    <span className="text-[11px] font-mono text-[#5A6E85]">
                      {sim.submittedAt.slice(5, 16)}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#0F2038] font-serif mt-2 line-clamp-2">
                    {sim.title}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#EBE3D7] text-[11px] text-[#5A6E85]">
                    <span>{sim.domain}</span>
                    <span className="font-mono text-emerald-700 font-semibold">{sim.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Active Simulation Run Dashboard & Waveform Visualizer */}
        <div className="lg:col-span-8 bg-white border border-[#E5DDD0] rounded-2xl p-6 lg:p-8 space-y-8 shadow-xs">
          {/* Header of Active Simulation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBE3D7]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#0F2038] text-white">
                  {selectedSim.tool}
                </span>
                <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Status: {selectedSim.status}
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#0F2038] mt-2">{selectedSim.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6E85] mt-1">
                <span>Domain: {selectedSim.domain}</span>
                <span aria-hidden="true">·</span>
                <span>Runtime: {selectedSim.runtimeSeconds}s</span>
                <span aria-hidden="true">·</span>
                <span>Completed: {selectedSim.completedAt || selectedSim.submittedAt}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExecuteRun}
              disabled={running}
              className="px-4 py-2 bg-[#0F2038] text-white text-xs font-serif font-bold rounded-xl hover:bg-[#1A365D] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-center shadow-xs disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{running ? 'Computing Physics Grid...' : 'Re-Run Simulation'}</span>
            </button>
          </div>

          {/* Interactive Waveform Visualizer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C6527] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#8C6527]" />
                <span>Transient Switching Waveform [Current I_ds (A) vs Time (ns)]</span>
              </span>
              <span className="text-[11px] font-mono text-[#5A6E85]">
                Peak: <strong className="text-[#0F2038]">{Math.max(...waveform.map((w) => w.value))} A</strong>
              </span>
            </div>

            <div className="bg-[#FAF8F5] rounded-2xl p-4 text-[#0F2038] border border-[#E5DDD0] overflow-hidden shadow-2xs">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48">
                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#E5DDD0" strokeDasharray="3 3" />
                <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#E5DDD0" strokeDasharray="3 3" />
                <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#D5C8B5" strokeWidth="1.2" />
                <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#D5C8B5" strokeWidth="1.2" />

                {/* Y-Axis Labels */}
                <text x={padding - 8} y={padding + 4} textAnchor="end" fill="#8C6527" fontSize="10" fontFamily="monospace">
                  {maxVal}A
                </text>
                <text x={padding - 8} y={svgHeight / 2 + 3} textAnchor="end" fill="#5A6E85" fontSize="10" fontFamily="monospace">
                  {Math.round(maxVal / 2)}A
                </text>
                <text x={padding - 8} y={svgHeight - padding} textAnchor="end" fill="#5A6E85" fontSize="10" fontFamily="monospace">
                  0A
                </text>

                {/* X-Axis Labels */}
                <text x={padding} y={svgHeight - 12} textAnchor="middle" fill="#5A6E85" fontSize="10" fontFamily="monospace">
                  0ns
                </text>
                <text x={svgWidth / 2} y={svgHeight - 12} textAnchor="middle" fill="#5A6E85" fontSize="10" fontFamily="monospace">
                  25ns
                </text>
                <text x={svgWidth - padding} y={svgHeight - 12} textAnchor="middle" fill="#5A6E85" fontSize="10" fontFamily="monospace">
                  50ns
                </text>

                {/* Transient Curve Path */}
                <polyline fill="none" stroke="#0F2038" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />

                {/* Data Points */}
                {waveform.map((pt, i) => {
                  const x = padding + (i / (waveform.length - 1)) * (svgWidth - padding * 2);
                  const y = svgHeight - padding - (pt.value / (maxVal || 1)) * (svgHeight - padding * 2);
                  return (
                    <circle key={i} cx={x} cy={y} r="4" fill="#B89547" stroke="#FFFFFF" strokeWidth="1.5" />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* 2D TCAD Junction Thermal Heatmap Solver */}
          <ThermalHeatmapCanvas vdc={vdc} ipk={ipk} tj={tj} />

          {/* Computed Output Metrics */}
          {selectedSim.summaryMetrics && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#8C6527] uppercase tracking-wider block font-mono">
                Calculated Physical Metrics &amp; Efficiencies
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(selectedSim.summaryMetrics).map(([k, v]) => (
                  <div key={k} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] shadow-2xs">
                    <span className="text-[10px] text-[#5A6E85] block truncate font-mono uppercase">{k}</span>
                    <strong className="text-sm font-mono text-[#0F2038] block mt-0.5">{v}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Parameter Controls Panel */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD0] space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D7]">
              <span className="text-xs font-bold text-[#8C6527] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Sliders className="w-4 h-4 text-[#8C6527]" />
                <span>Adjust Parameters &amp; Re-Synthesize</span>
              </span>
              <span className="text-[11px] font-mono text-[#5A6E85]">Live Boundary Envelope</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#0F2038] font-medium mb-1.5">
                  DC Bus Voltage (Vdc): <strong className="text-[#8C6527] font-mono">{vdc} V</strong>
                </label>
                <input
                  type="range"
                  min="400"
                  max="1000"
                  step="50"
                  value={vdc}
                  onChange={(e) => setVdc(Number(e.target.value))}
                  className="w-full accent-[#0F2038]"
                />
              </div>

              <div>
                <label className="block text-[#0F2038] font-medium mb-1.5">
                  Peak Pulse Current (Ipk): <strong className="text-[#8C6527] font-mono">{ipk} A</strong>
                </label>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="25"
                  value={ipk}
                  onChange={(e) => setIpk(Number(e.target.value))}
                  className="w-full accent-[#0F2038]"
                />
              </div>

              <div>
                <label className="block text-[#0F2038] font-medium mb-1.5">
                  Stray Loop Inductance (Lloop): <strong className="text-[#8C6527] font-mono">{lloop} nH</strong>
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="5.0"
                  step="0.2"
                  value={lloop}
                  onChange={(e) => setLloop(Number(e.target.value))}
                  className="w-full accent-[#0F2038]"
                />
              </div>

              <div>
                <label className="block text-[#0F2038] font-medium mb-1.5">
                  Junction Temp (Tj): <strong className="text-[#8C6527] font-mono">{tj} °C</strong>
                </label>
                <input
                  type="range"
                  min="25"
                  max="175"
                  step="5"
                  value={tj}
                  onChange={(e) => setTj(Number(e.target.value))}
                  className="w-full accent-[#0F2038]"
                />
              </div>

              <div>
                <label className="block text-[#0F2038] font-medium mb-1.5">
                  Gate Resistor Rg_on: <strong className="text-[#8C6527] font-mono">{rgon} Ω</strong>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.2"
                  value={rgon}
                  onChange={(e) => setRgon(Number(e.target.value))}
                  className="w-full accent-[#0F2038]"
                />
              </div>
            </div>
          </div>

          {/* Result Text Report */}
          {selectedSim.resultReport && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] text-xs text-[#5A6E85] leading-relaxed shadow-2xs">
              <strong className="text-[#0F2038] font-serif font-bold text-sm block mb-1">
                Physics Solver Report:
              </strong>
              {selectedSim.resultReport}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
