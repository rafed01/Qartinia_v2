import React, { useState } from 'react';
import { SimulationJob, SimulationToolType } from '../types/qartinia';
import {
  Activity,
  Play,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  RotateCcw,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';

interface SimulationHubViewProps {
  simulations: SimulationJob[];
  onRunSimulation: (payload: {
    title: string;
    tool: SimulationToolType;
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
      title: '800V SiC Half-Bridge Double-Pulse & Active Gate Trajectory Transient',
      tool: 'SPICE',
      domain: 'Power Electronics',
      status: 'Completed',
      parameters: {
        'Bus Voltage (Vdc)': '800 V',
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

  const handleExecuteRun = async () => {
    setRunning(true);
    try {
      await onRunSimulation({
        title: `${selectedSim.tool} Transient Run (${vdc}V / ${ipk}A, Lloop=${lloop}nH)`,
        tool: selectedSim.tool,
        domain: selectedSim.domain,
        parameters: {
          'Bus Voltage (Vdc)': vdc,
          'Peak Current (Ipk)': ipk,
          'Stray Inductance (Lloop)': lloop,
          'Junction Temp (Tj)': tj,
          'Gate Resistor (Rg_on)': rgon,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  // Waveform SVG Drawing Math
  const waveform = selectedSim.outputWaveformData || [
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
  ];

  const maxVal = Math.max(...waveform.map((w) => w.value), 500);
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 30;

  const points = waveform
    .map((pt, i) => {
      const x = padding + (i / (waveform.length - 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - (pt.value / maxVal) * (svgHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#108548] uppercase tracking-wider">
              Computational Physics &amp; Circuit Modeling
            </div>
            <h1 className="font-brand text-2xl sm:text-3xl font-bold text-[#0F2537] mt-1">
              Simulation Studio
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Execute SPICE transient double-pulse gate trajectory sweeps, TCAD semiconductor electric field breakdowns, and DFT ceramic bonding models before hardware prototyping.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-600 bg-[#FAF9F6] border border-slate-200 p-3 rounded-lg self-start md:self-center">
            <div>
              <span className="text-slate-400 block">Simulation Engines:</span>
              <strong className="text-sm text-[#0F2537]">SPICE · TCAD · DFT</strong>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block">Runs Logged:</span>
              <strong className="text-sm text-[#0F2537]">{simulations.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Jobs Drawer (Left) & Active Simulation Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Simulation Jobs Selector */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider">
              Simulation Runs ({simulations.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-400">History</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {simulations.map((sim) => {
              const isSelected = selectedSim.id === sim.id;
              return (
                <button
                  key={sim.id}
                  type="button"
                  onClick={() => setSelectedSim(sim)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF9F6] border-[#0F2537] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#108548] px-1.5 py-0.5 rounded bg-slate-100">
                      {sim.tool}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {sim.submittedAt.slice(5, 16)}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#0F2537] mt-1.5 line-clamp-2">
                    {sim.title}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>{sim.domain}</span>
                    <span className="font-mono text-slate-700">{sim.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Active Simulation Run Dashboard & Waveform Visualizer */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-8">
          {/* Header of Active Simulation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0F2537] text-white">
                  {selectedSim.tool}
                </span>
                <span className="text-xs font-mono text-[#108548] font-semibold">
                  Status: {selectedSim.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#0F2537] mt-1">{selectedSim.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
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
              className="px-4 py-2 bg-[#0F2537] text-white text-xs font-semibold rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-center shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-[#C59B47]" />
              <span>{running ? 'Computing Physics Grid...' : 'Re-Run Simulation'}</span>
            </button>
          </div>

          {/* Interactive Waveform Visualizer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#108548]" />
                <span>Transient Switching Waveform [Current I_ds (A) vs Time (ns)]</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Peak: {Math.max(...waveform.map((w) => w.value))} A
              </span>
            </div>

            <div className="bg-[#0F2537] rounded-xl p-4 text-white overflow-hidden shadow-inner">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48">
                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#1E3A54" strokeDasharray="3 3" />
                <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#1E3A54" strokeDasharray="3 3" />
                <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#334E68" />
                <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#334E68" />

                {/* Y-Axis Labels */}
                <text x={padding - 6} y={padding + 4} textAnchor="end" fill="#9FB3C8" fontSize="10" fontFamily="monospace">
                  {maxVal}A
                </text>
                <text x={padding - 6} y={svgHeight / 2 + 3} textAnchor="end" fill="#9FB3C8" fontSize="10" fontFamily="monospace">
                  {Math.round(maxVal / 2)}A
                </text>
                <text x={padding - 6} y={svgHeight - padding} textAnchor="end" fill="#9FB3C8" fontSize="10" fontFamily="monospace">
                  0A
                </text>

                {/* X-Axis Labels */}
                <text x={padding} y={svgHeight - 12} textAnchor="middle" fill="#9FB3C8" fontSize="10" fontFamily="monospace">
                  0ns
                </text>
                <text x={svgWidth / 2} y={svgHeight - 12} textAnchor="middle" fill="#9FB3C8" fontSize="10" fontFamily="monospace">
                  25ns
                </text>
                <text x={svgWidth - padding} y={svgHeight - 12} textAnchor="middle" fill="#9FB3C8" fontSize="10" fontFamily="monospace">
                  50ns
                </text>

                {/* Transient Curve Path */}
                <polyline fill="none" stroke="#C59B47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />

                {/* Data Points */}
                {waveform.map((pt, i) => {
                  const x = padding + (i / (waveform.length - 1)) * (svgWidth - padding * 2);
                  const y = svgHeight - padding - (pt.value / maxVal) * (svgHeight - padding * 2);
                  return (
                    <circle key={i} cx={x} cy={y} r="3.5" fill="#108548" stroke="#FAF9F6" strokeWidth="1.5" />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Computed Output Metrics */}
          {selectedSim.summaryMetrics && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider block">
                Calculated Physical Metrics &amp; Efficiencies
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(selectedSim.summaryMetrics).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-lg bg-[#FAF9F6] border border-slate-200">
                    <span className="text-[10px] text-slate-500 block truncate font-mono">{k}</span>
                    <strong className="text-sm font-mono text-[#0F2537] block mt-0.5">{v}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Parameter Controls Panel */}
          <div className="p-5 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#108548]" />
                <span>Adjust Parameters &amp; Re-Synthesize</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Live Boundary Envelope</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  DC Bus Voltage (Vdc): <strong className="text-[#0F2537]">{vdc} V</strong>
                </label>
                <input
                  type="range"
                  min="400"
                  max="1000"
                  step="50"
                  value={vdc}
                  onChange={(e) => setVdc(Number(e.target.value))}
                  className="w-full accent-[#0F2537]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Peak Pulse Current (Ipk): <strong className="text-[#0F2537]">{ipk} A</strong>
                </label>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="25"
                  value={ipk}
                  onChange={(e) => setIpk(Number(e.target.value))}
                  className="w-full accent-[#0F2537]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Stray Loop Inductance (Lloop): <strong className="text-[#0F2537]">{lloop} nH</strong>
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="5.0"
                  step="0.2"
                  value={lloop}
                  onChange={(e) => setLloop(Number(e.target.value))}
                  className="w-full accent-[#0F2537]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Junction Temp (Tj): <strong className="text-[#0F2537]">{tj} °C</strong>
                </label>
                <input
                  type="range"
                  min="25"
                  max="175"
                  step="5"
                  value={tj}
                  onChange={(e) => setTj(Number(e.target.value))}
                  className="w-full accent-[#0F2537]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Gate Resistor Rg_on: <strong className="text-[#0F2537]">{rgon} Ω</strong>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.2"
                  value={rgon}
                  onChange={(e) => setRgon(Number(e.target.value))}
                  className="w-full accent-[#0F2537]"
                />
              </div>
            </div>
          </div>

          {/* Result Text Report */}
          {selectedSim.resultReport && (
            <div className="p-4 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-[#0F2537] block mb-1">Physics Solver Report:</strong>
              {selectedSim.resultReport}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
