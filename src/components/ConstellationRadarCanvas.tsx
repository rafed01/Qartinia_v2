import React, { useRef, useEffect, useState } from 'react';
import { EvidenceNode, CatalogRelationshipEdge } from '../types/qartinia';
import { Sparkles, Eye, ShieldCheck, ExternalLink, Zap } from 'lucide-react';

interface ConstellationRadarCanvasProps {
  nodes: EvidenceNode[];
  edges: CatalogRelationshipEdge[];
  onSelectNode?: (node: EvidenceNode) => void;
}

export const ConstellationRadarCanvas: React.FC<ConstellationRadarCanvasProps> = ({
  nodes,
  edges,
  onSelectNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<EvidenceNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);

  // Compute positions around central astrolabe
  const nodePositionsRef = useRef<Map<string, { x: number; y: number; r: number; color: string }>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleOffset = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.85;

      ctx.clearRect(0, 0, w, h);

      // 1. Background Grid & Deep Celestial Canvas
      ctx.fillStyle = '#0F2038';
      ctx.fillRect(0, 0, w, h);

      // Subtle Radial Glow
      const bgGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, maxRadius);
      bgGlow.addColorStop(0, 'rgba(140, 101, 39, 0.15)');
      bgGlow.addColorStop(0.5, 'rgba(15, 32, 56, 0.8)');
      bgGlow.addColorStop(1, '#0F2038');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, w, h);

      // 2. Concentric Celestial Astrolabe Orbit Rings
      angleOffset += 0.0015;

      const ringRadii = [maxRadius * 0.3, maxRadius * 0.55, maxRadius * 0.8];
      
      ringRadii.forEach((r, idx) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(idx % 2 === 0 ? angleOffset : -angleOffset * 0.7);

        // Dashed Golden Ring
        ctx.strokeStyle = idx === 1 ? 'rgba(197, 168, 128, 0.4)' : 'rgba(140, 101, 39, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();

        // Degree Tick Marks
        const ticks = 12 + idx * 8;
        for (let i = 0; i < ticks; i++) {
          const a = (i / ticks) * Math.PI * 2;
          const x1 = Math.cos(a) * (r - 4);
          const y1 = Math.sin(a) * (r - 4);
          const x2 = Math.cos(a) * (r + 4);
          const y2 = Math.sin(a) * (r + 4);

          ctx.strokeStyle = 'rgba(197, 168, 128, 0.35)';
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        ctx.restore();
      });

      // 3. Center Astrolabe Core Emblem
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angleOffset * 0.5);
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();

      // Four Cardinal Rays
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 12, Math.sin(a) * 12);
        ctx.lineTo(Math.cos(a) * maxRadius * 0.85, Math.sin(a) * maxRadius * 0.85);
        ctx.strokeStyle = 'rgba(140, 101, 39, 0.15)';
        ctx.stroke();
      }
      ctx.restore();

      // 4. Calculate Node Positions
      const posMap = new Map<string, { x: number; y: number; r: number; color: string }>();

      nodes.forEach((node, index) => {
        const ringIdx = index % 3;
        const radius = ringRadii[ringIdx];
        const baseAngle = (index / Math.max(nodes.length, 1)) * Math.PI * 2;
        const currentAngle = baseAngle + (ringIdx % 2 === 0 ? angleOffset : -angleOffset * 0.7);

        const x = centerX + Math.cos(currentAngle) * radius;
        const y = centerY + Math.sin(currentAngle) * radius;

        let nodeColor = '#C5A880';
        if (node.category === 'Patent') nodeColor = '#38BDF8';
        if (node.category === 'Publication') nodeColor = '#34D399';
        if (node.category === 'Product Datasheet') nodeColor = '#F43F5E';
        if (node.category === 'Standard') nodeColor = '#F59E0B';

        posMap.set(node.id, { x, y, r: 8, color: nodeColor });
      });

      nodePositionsRef.current = posMap;

      // 5. Draw Edges
      edges.forEach((edge) => {
        const src = posMap.get(edge.sourceId);
        const tgt = posMap.get(edge.targetId);

        if (src && tgt) {
          ctx.beginPath();
          ctx.moveTo(src.x, src.y);
          ctx.lineTo(tgt.x, tgt.y);
          ctx.strokeStyle = 'rgba(197, 168, 128, 0.3)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // 6. Draw Constellation Nodes
      nodes.forEach((node) => {
        const pos = posMap.get(node.id);
        if (!pos) return;

        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNode?.id === node.id;

        // Outer Pulsing Glow
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pos.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(197, 168, 128, 0.3)' : 'rgba(56, 189, 248, 0.25)';
          ctx.fill();
        }

        // Inner Core Point
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isSelected ? pos.r * 1.3 : pos.r, 0, Math.PI * 2);
        ctx.fillStyle = pos.color;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Node Short Label
        ctx.fillStyle = isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)';
        ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.fillText(node.title.slice(0, 18) + '...', pos.x + 12, pos.y + 4);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [nodes, edges, hoveredNode, selectedNodeId]);

  // Handle Mouse Hover & Click over Canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = clientX * scaleX;
    const canvasY = clientY * scaleY;

    let found: EvidenceNode | null = null;

    nodes.forEach((node) => {
      const pos = nodePositionsRef.current.get(node.id);
      if (pos) {
        const dx = canvasX - pos.x;
        const dy = canvasY - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= pos.r * 2.5) {
          found = node;
        }
      }
    });

    setHoveredNode(found);
    setTooltipPos({ x: clientX, y: clientY });
  };

  const handleCanvasClick = () => {
    if (hoveredNode) {
      setSelectedNodeId(hoveredNode.id);
      if (onSelectNode) onSelectNode(hoveredNode);
    }
  };

  return (
    <div className="relative w-full bg-[#0F2038] rounded-2xl border border-[#C5A880]/30 shadow-2xl overflow-hidden group">
      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
        className="w-full h-[420px] sm:h-[480px] cursor-crosshair block"
      />

      {/* Floating Canvas Top Overlay Title */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880]">
          <Zap className="w-4 h-4 animate-pulse" />
        </span>
        <div>
          <span className="font-serif font-bold text-white text-sm tracking-wide block">
            Celestial Astrolabe Topology Radar
          </span>
          <span className="font-mono text-[10px] text-[#C5A880] uppercase tracking-wider block">
            {nodes.length} Nodes · {edges.length} Active Provenance Links
          </span>
        </div>
      </div>

      {/* Interactive Tooltip Overlay */}
      {hoveredNode && (
        <div
          style={{
            left: `${Math.min(tooltipPos.x + 12, window.innerWidth - 320)}px`,
            top: `${Math.max(tooltipPos.y - 80, 10)}px`,
          }}
          className="absolute z-20 w-72 bg-[#0F2038]/95 backdrop-blur-xl border border-[#C5A880] rounded-xl p-3 shadow-2xl text-white text-xs pointer-events-none animate-in fade-in duration-100"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-[#284873] mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-[#C5A880]">
              {hoveredNode.category}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
              {hoveredNode.maturityTrl || 'TRL 6'}
            </span>
          </div>
          <h4 className="font-bold text-slate-100 text-xs leading-snug mb-1">{hoveredNode.title}</h4>
          <p className="text-[11px] text-slate-300 line-clamp-2">{hoveredNode.demonstratedPerformance}</p>
          <div className="mt-2 pt-1.5 border-t border-[#284873] flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>{hoveredNode.institutionOrCompany}</span>
            <span className="text-[#C5A880]">Click to Inspect</span>
          </div>
        </div>
      )}
    </div>
  );
};
