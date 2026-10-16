import React, { useRef, useEffect } from 'react';
import { Activity, Flame, ShieldAlert, Cpu } from 'lucide-react';

interface ThermalHeatmapCanvasProps {
  vdc: number;
  ipk: number;
  tj: number;
}

export const ThermalHeatmapCanvas: React.FC<ThermalHeatmapCanvasProps> = ({ vdc, ipk, tj }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particleOffset = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Heatsink & Substrate Base Layer
      ctx.fillStyle = '#0F2038';
      ctx.fillRect(0, 0, w, h);

      // Calculate calculated peak junction temp based on sliders
      const computedJunctionTemp = Math.round(tj + (vdc / 1000) * (ipk / 100) * 18);
      const isOverheated = computedJunctionTemp > 175;

      // 2. Semiconductor Die Cross-Section Regions
      const dieWidth = w * 0.75;
      const dieHeight = h * 0.65;
      const dieX = (w - dieWidth) / 2;
      const dieY = (h - dieHeight) / 2;

      // Copper Baseplate
      ctx.fillStyle = '#331B10';
      ctx.fillRect(dieX, dieY + dieHeight * 0.75, dieWidth, dieHeight * 0.25);

      // SiC / GaN Epitaxial Drift Layer
      ctx.fillStyle = '#112940';
      ctx.fillRect(dieX, dieY + dieHeight * 0.35, dieWidth, dieHeight * 0.4);

      // Gate Channel Region (Heat Source)
      const heatIntensity = Math.min(1, (computedJunctionTemp - 25) / 200);

      const heatGrad = ctx.createRadialGradient(
        w / 2,
        dieY + dieHeight * 0.2,
        10,
        w / 2,
        dieY + dieHeight * 0.5,
        dieWidth * 0.5
      );

      heatGrad.addColorStop(0, `rgba(239, 68, 68, ${0.4 + heatIntensity * 0.6})`);
      heatGrad.addColorStop(0.3, `rgba(245, 158, 11, ${0.3 + heatIntensity * 0.5})`);
      heatGrad.addColorStop(0.7, `rgba(59, 130, 246, 0.2)`);
      heatGrad.addColorStop(1, 'rgba(15, 32, 56, 0)');

      ctx.fillStyle = heatGrad;
      ctx.fillRect(dieX, dieY, dieWidth, dieHeight);

      // 3. Structural Wirebond & Gate Metal Outlines
      ctx.strokeStyle = '#C5A880';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(dieX, dieY, dieWidth, dieHeight);

      // Wirebonds
      ctx.beginPath();
      ctx.moveTo(dieX + 20, dieY - 15);
      ctx.lineTo(dieX + dieWidth * 0.3, dieY + 10);
      ctx.moveTo(dieX + dieWidth - 20, dieY - 15);
      ctx.lineTo(dieX + dieWidth * 0.7, dieY + 10);
      ctx.strokeStyle = '#E5DDD0';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 4. Electron Current Particle Stream
      particleOffset += 1.5 + (ipk / 100);
      if (particleOffset > 20) particleOffset = 0;

      ctx.fillStyle = '#60A5FA';
      for (let x = dieX + 15; x < dieX + dieWidth - 15; x += 20) {
        const y = dieY + dieHeight * 0.2 + Math.sin((x + particleOffset) * 0.05) * 6;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Thermal Isotherm Contour Lines
      ctx.strokeStyle = `rgba(251, 146, 60, ${0.4 + heatIntensity * 0.4})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      for (let r = 30; r < dieWidth * 0.45; r += 25) {
        ctx.beginPath();
        ctx.ellipse(w / 2, dieY + dieHeight * 0.2, r * 1.2, r * 0.7, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 6. Die Layer Annotations
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px monospace';
      ctx.fillText('ACTIVE GATE CHANNEL', dieX + 10, dieY + 20);
      ctx.fillText('SiC EPI DRIFT LAYER (1200V)', dieX + 10, dieY + dieHeight * 0.55);
      ctx.fillText('COPPER BASEPLATE & HEATSINK', dieX + 10, dieY + dieHeight * 0.9);

      // Temperature Probe Tag
      ctx.fillStyle = isOverheated ? '#EF4444' : '#F59E0B';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Pkt Tj: ${computedJunctionTemp} °C`, w / 2 - 45, dieY + dieHeight * 0.2);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [vdc, ipk, tj]);

  return (
    <div className="bg-[#0F2038] border border-[#C5A880]/30 rounded-2xl p-4 shadow-xl space-y-2 relative overflow-hidden">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[#C5A880] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#C5A880] animate-bounce" />
          <span>2D TCAD Junction Thermal Heatmap Solver</span>
        </span>
        <span className="text-slate-300">
          Peak Tj: <strong className="text-[#C5A880]">{Math.round(tj + (vdc / 1000) * (ipk / 100) * 18)} °C</strong>
        </span>
      </div>

      <canvas ref={canvasRef} width={600} height={220} className="w-full h-48 rounded-xl block" />
    </div>
  );
};
