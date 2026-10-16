import React from 'react';

/**
 * Classical Carthage Punic Ship Crest / Emblem for Qartinia
 */
export const QartiniaBrandLogo: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Qartinia Crest"
    >
      <circle cx="32" cy="32" r="30" stroke="#0F2038" strokeWidth="1.5" fill="#FAF8F5" />
      <circle cx="32" cy="32" r="27" stroke="#C5A880" strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
      <path
        d="M12 40C20 48 44 48 52 40L55 34L46 36C38 38 26 38 18 36L9 34L12 40Z"
        fill="#0F2038"
      />
      <line x1="32" y1="12" x2="32" y2="40" stroke="#0F2038" strokeWidth="2" strokeLinecap="round" />
      <polygon points="32,15 48,29 32,29" fill="#0F2038" opacity="0.9" />
      <polygon points="32,17 20,28 32,28" fill="#8C6527" opacity="0.85" />
      <line x1="8" y1="46" x2="56" y2="46" stroke="#C5A880" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="51" x2="50" y2="51" stroke="#0F2038" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <circle cx="32" cy="10" r="2.5" fill="#8C6527" />
    </svg>
  );
};

/**
 * Architectural Carthage Harbor Panoramic Engraving SVG
 */
export const CarthageHarborPanorama: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 1200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-cover pointer-events-none select-none ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="carthageSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAF6F0" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#F5EFEB" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#EAE1D2" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="harborWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EAE1D2" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#DFD3BF" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Sky & Atmospheric Base */}
      <rect width="1200" height="240" fill="url(#carthageSky)" />

      {/* Distant Hills / Byrsa Hill Outline */}
      <path
        d="M0 130Q150 95 350 115T750 100T1050 110T1200 125V240H0Z"
        fill="#E8DFD1"
        opacity="0.7"
      />
      <path
        d="M200 120Q320 80 480 110T850 90T1100 115V240H200Z"
        fill="#DFD5C3"
        opacity="0.5"
      />

      {/* The Acropolis / Temple of Eshmun atop Byrsa */}
      <g opacity="0.65" transform="translate(420, 75)">
        <rect x="0" y="20" width="110" height="4" fill="#0F2038" />
        <polygon points="0,20 55,8 110,20" fill="#FAF8F5" stroke="#0F2038" strokeWidth="1.2" />
        {/* Colonade */}
        {[10, 25, 40, 55, 70, 85, 100].map((cx, idx) => (
          <line key={idx} x1={cx} y1="24" x2={cx} y2="40" stroke="#0F2038" strokeWidth="1.5" />
        ))}
        <rect x="-5" y="40" width="120" height="6" fill="#0F2038" />
      </g>

      {/* The Circular Cothon Harbor Structure (Naval Island of Admiralty) */}
      <g opacity="0.75" transform="translate(680, 110)">
        {/* Circular Island Base */}
        <ellipse cx="120" cy="50" rx="110" ry="22" fill="#E2D7C5" stroke="#C5A880" strokeWidth="1.2" />
        {/* Naval Pavilion Rotunda */}
        <ellipse cx="120" cy="38" rx="45" ry="10" fill="#FAF8F5" stroke="#0F2038" strokeWidth="1.2" />
        {[90, 102, 114, 126, 138, 150].map((cx, idx) => (
          <line key={idx} x1={cx} y1="38" x2={cx} y2="48" stroke="#0F2038" strokeWidth="1.2" />
        ))}
        <polygon points="75,38 120,20 165,38" fill="#FAF8F5" stroke="#0F2038" strokeWidth="1.2" />
        {/* Outer Circular Ship Sheds */}
        {[20, 45, 70, 170, 195, 220].map((cx, idx) => (
          <rect key={idx} x={cx} y="44" width="12" height="10" fill="#0F2038" opacity="0.4" />
        ))}
      </g>

      {/* Carthage Seawall & Colonnade Promenade */}
      <g opacity="0.6">
        <line x1="0" y1="170" x2="1200" y2="170" stroke="#C5A880" strokeWidth="2" />
        <line x1="0" y1="173" x2="1200" y2="173" stroke="#0F2038" strokeWidth="1" />
        {/* Repeating Classical Pillars along Promenade */}
        {Array.from({ length: 48 }).map((_, i) => (
          <line key={i} x1={i * 25 + 10} y1="158" x2={i * 25 + 10} y2="170" stroke="#0F2038" strokeWidth="1" opacity="0.45" />
        ))}
      </g>

      {/* Harbor Water Body */}
      <rect x="0" y="173" width="1200" height="67" fill="url(#harborWater)" />

      {/* Engraved Water Ripples */}
      <g stroke="#C5A880" strokeWidth="1" strokeLinecap="round" opacity="0.6">
        <line x1="50" y1="182" x2="180" y2="182" />
        <line x1="240" y1="186" x2="420" y2="186" />
        <line x1="490" y1="180" x2="650" y2="180" />
        <line x1="720" y1="185" x2="890" y2="185" />
        <line x1="940" y1="181" x2="1120" y2="181" />

        <line x1="120" y1="198" x2="290" y2="198" />
        <line x1="380" y1="202" x2="560" y2="202" />
        <line x1="620" y1="196" x2="790" y2="196" />
        <line x1="840" y1="200" x2="1050" y2="200" />

        <line x1="80" y1="216" x2="260" y2="216" />
        <line x1="320" y1="220" x2="510" y2="220" />
        <line x1="580" y1="215" x2="780" y2="215" />
        <line x1="820" y1="219" x2="980" y2="219" />
        <line x1="1020" y1="214" x2="1180" y2="214" />
      </g>

      {/* Classical Punic Galleys in Harbor */}
      <g transform="translate(180, 168)" opacity="0.75">
        <path d="M0 16C15 22 55 22 70 16L74 10L65 12C50 14 20 14 8 12L-2 10L0 16Z" fill="#0F2038" />
        <line x1="35" y1="-10" x2="35" y2="16" stroke="#0F2038" strokeWidth="1.5" />
        <polygon points="35,-6 52,6 35,6" fill="#FAF8F5" stroke="#0F2038" strokeWidth="0.8" />
        <line x1="74" y1="10" x2="82" y2="6" stroke="#C5A880" strokeWidth="1.5" />
        {[10, 18, 26, 34, 42, 50, 58].map((ox, idx) => (
          <line key={idx} x1={ox} y1="15" x2={ox - 4} y2="23" stroke="#8C6527" strokeWidth="0.8" />
        ))}
      </g>

      <g transform="translate(560, 175)" opacity="0.65">
        <path d="M0 12C12 17 44 17 56 12L59 8L52 9C40 11 16 11 6 9L-2 8L0 12Z" fill="#0F2038" />
        <line x1="28" y1="-8" x2="28" y2="12" stroke="#0F2038" strokeWidth="1.2" />
        <polygon points="28,-5 42,4 28,4" fill="#FAF8F5" stroke="#0F2038" strokeWidth="0.8" />
        {[8, 15, 22, 29, 36, 43].map((ox, idx) => (
          <line key={idx} x1={ox} y1="12" x2={ox - 3} y2="18" stroke="#8C6527" strokeWidth="0.8" />
        ))}
      </g>
    </svg>
  );
};

/**
 * Metric Card Watermark Icons (Classical Engravings)
 */
export const ShipWatermark: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.12,
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} animate-galley-sway`}>
    <g opacity={opacity} stroke="#0F2038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 62C30 75 70 75 85 62L90 52L75 55C60 58 40 58 25 55L10 52L15 62Z" fill="#0F2038" fillOpacity="0.05" />
      <path d="M50 18V62" strokeWidth="2.5" />
      <polygon points="50,22 75,44 50,44" fill="#0F2038" fillOpacity="0.08" />
      <polygon points="50,24 30,42 50,42" fill="#0F2038" fillOpacity="0.08" />
      <path d="M8 74Q25 70 50 74T92 74" />
      <path d="M12 82Q35 78 50 82T88 82" strokeWidth="1.5" />
      <circle cx="50" cy="12" r="3" fill="#0F2038" />
    </g>
  </svg>
);

export const WavesWatermark: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.12,
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} animate-wave-drift`}>
    <g opacity={opacity} stroke="#0F2038" strokeWidth="2" strokeLinecap="round">
      <path d="M10 30C20 25 30 35 40 30C50 25 60 35 70 30C80 25 90 35 100 30" />
      <path d="M5 45C15 40 25 50 35 45C45 40 55 50 65 45C75 40 85 50 95 45" />
      <path d="M10 60C20 55 30 65 40 60C50 55 60 65 70 60C80 55 90 65 100 60" />
      <path d="M5 75C15 70 25 80 35 75C45 70 55 80 65 75C75 70 85 80 95 75" />
    </g>
  </svg>
);

export const TowerWatermark: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.12,
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g opacity={opacity} stroke="#0F2038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="30,85 70,85 64,30 36,30" fill="#0F2038" fillOpacity="0.05" />
      <rect x="32" y="24" width="36" height="6" />
      <polygon points="34,24 50,12 66,24" fill="#0F2038" fillOpacity="0.08" />
      <line x1="50" y1="12" x2="50" y2="6" strokeWidth="2" />
      <circle cx="50" cy="5" r="2" fill="#0F2038" />
      <line x1="42" y1="40" x2="42" y2="48" strokeWidth="2.5" />
      <line x1="58" y1="40" x2="58" y2="48" strokeWidth="2.5" />
      <line x1="50" y1="60" x2="50" y2="72" strokeWidth="2.5" />
      <line x1="20" y1="85" x2="80" y2="85" strokeWidth="3" />
    </g>
  </svg>
);

export const ColumnsWatermark: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.12,
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g opacity={opacity} stroke="#0F2038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="20,28 50,12 80,28" fill="#0F2038" fillOpacity="0.08" />
      <line x1="16" y1="28" x2="84" y2="28" strokeWidth="2.5" />
      <line x1="28" y1="30" x2="28" y2="80" strokeWidth="2.5" />
      <line x1="42" y1="30" x2="42" y2="80" strokeWidth="2.5" />
      <line x1="58" y1="30" x2="58" y2="80" strokeWidth="2.5" />
      <line x1="72" y1="30" x2="72" y2="80" strokeWidth="2.5" />
      <line x1="16" y1="80" x2="84" y2="80" strokeWidth="2.5" />
      <line x1="12" y1="85" x2="88" y2="85" strokeWidth="3" />
    </g>
  </svg>
);

export const AstrolabeWatermark: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.12,
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} animate-watermark-float`}>
    <g opacity={opacity} stroke="#8C6527" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="50" cy="50" r="42" strokeWidth="2" className="origin-center animate-spin-slow" />
      <circle cx="50" cy="50" r="36" strokeDasharray="3 3" className="origin-center animate-spin-slow-rev" />
      <circle cx="50" cy="50" r="24" />
      <circle cx="50" cy="50" r="8" fill="#8C6527" fillOpacity="0.1" />
      <line x1="50" y1="4" x2="50" y2="96" strokeWidth="1.8" />
      <line x1="4" y1="50" x2="96" y2="50" strokeWidth="1.8" />
      <line x1="18" y1="18" x2="82" y2="82" strokeDasharray="2 2" />
      <line x1="82" y1="18" x2="18" y2="82" strokeDasharray="2 2" />
      <polygon points="50,14 54,20 50,26 46,20" fill="#8C6527" fillOpacity="0.2" />
    </g>
  </svg>
);

export const CoinWatermark: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.12,
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} animate-watermark-float`}>
    <g opacity={opacity} stroke="#8C6527" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="50" cy="50" r="44" strokeWidth="2.5" className="origin-center animate-spin-slow-rev" />
      <circle cx="50" cy="50" r="39" strokeDasharray="2 2" className="origin-center animate-spin-slow" />
      {/* Tanit Celestial Emblem with Gold Aura Glow */}
      <g className="animate-gold-aura">
        <line x1="28" y1="65" x2="72" y2="65" strokeWidth="2.5" />
        <line x1="50" y1="65" x2="50" y2="35" strokeWidth="2.5" />
        <circle cx="50" cy="26" r="8" fill="#8C6527" fillOpacity="0.15" strokeWidth="2" />
        <path d="M28 42C38 35 62 35 72 42" strokeWidth="2" />
      </g>
    </g>
  </svg>
);

export const ShieldWatermark: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.12,
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g opacity={opacity} stroke="#0F2038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 8L88 22V52C88 74 50 92 50 92C50 92 12 74 12 52V22L50 8Z" fill="#0F2038" fillOpacity="0.04" />
      <path d="M50 18L78 28V50C78 66 50 80 50 80C50 80 22 66 22 50V28L50 18Z" strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="50" y1="24" x2="50" y2="72" strokeWidth="2" />
      <line x1="28" y1="46" x2="72" y2="46" strokeWidth="2" />
      <circle cx="50" cy="46" r="6" fill="#8C6527" fillOpacity="0.2" />
    </g>
  </svg>
);

/**
 * Classical Engraved Corner Flourish SVG for Cards, Modals, Dropdowns & Buttons
 */
export const CarthageCornerMotif: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#8C6527',
}) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.4">
      <path d="M2 30V8C2 4.7 4.7 2 8 2H30" />
      <path d="M6 30V12C6 8.7 8.7 6 12 6H30" strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="2" fill={color} fillOpacity="0.5" />
    </g>
  </svg>
);

/**
 * Translucent Background Engraving Canvas Layer (renders behind main page viewport)
 */
/**
 * Translucent Background Engraving Canvas Layer with Live Slow Rotations & Drift
 */
export const SubtlePageWhitespaceBackground: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden opacity-[0.04]">
    {/* Repeating Architectural Waterlines & Astrolabe Grid with Mesmerizing Slow Rotation */}
    <div className="absolute top-10 -left-20 w-[550px] h-[550px] animate-spin-slow">
      <AstrolabeWatermark className="w-full h-full text-[#8C6527]" opacity={1} />
    </div>
    <div className="absolute top-[35%] -right-28 w-[650px] h-[650px] animate-float-gentle">
      <ShipWatermark className="w-full h-full text-[#0F2038]" opacity={1} />
    </div>
    <div className="absolute bottom-10 left-[12%] w-[480px] h-[480px] animate-float-gentle" style={{ animationDelay: '2s' }}>
      <ColumnsWatermark className="w-full h-full text-[#0F2038]" opacity={1} />
    </div>
    <div className="absolute bottom-28 right-[18%] w-[400px] h-[400px] animate-spin-slow-rev">
      <CoinWatermark className="w-full h-full text-[#8C6527]" opacity={1} />
    </div>
  </div>
);

/**
 * Live Animated Pulse Beacon Dot (adds sophisticated live status feeling)
 */
export const LivePulseBeacon: React.FC<{ color?: 'emerald' | 'gold' | 'navy' | 'amber'; label?: string }> = ({
  color = 'emerald',
  label,
}) => {
  const bgMap = {
    emerald: 'bg-emerald-500',
    gold: 'bg-[#8C6527]',
    navy: 'bg-[#0F2038]',
    amber: 'bg-amber-500',
  };
  const ringMap = {
    emerald: 'bg-emerald-400',
    gold: 'bg-[#C5A880]',
    navy: 'bg-[#5A6E85]',
    amber: 'bg-amber-400',
  };

  return (
    <span className="inline-flex items-center gap-1.5 shrink-0">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-beacon-ring ${ringMap[color]}`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${bgMap[color]}`} />
      </span>
      {label && <span className="font-mono text-[10px] text-[#5A6E85]">{label}</span>}
    </span>
  );
};

/**
 * Translucent Button / Card Accent Watermark Motif
 */
export const ButtonTranslucentMotif: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g opacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <polygon points="12,5 17,12 12,12" fill="currentColor" fillOpacity="0.2" />
    </g>
  </svg>
);

/**
 * Classical Translucent Punic Filigree Divider Line
 */
export const PunicFiligreeDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2 my-2 opacity-50 pointer-events-none select-none ${className}`}>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
    <svg className="w-3.5 h-3.5 text-[#8C6527] shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
  </div>
);

/**
 * Translucent Dropdown & Popover Background Watermark
 */
export const DropdownTranslucentWatermark: React.FC = () => (
  <>
    <CarthageCornerMotif className="w-6 h-6 absolute top-1 right-1 pointer-events-none opacity-40 text-[#8C6527]" />
    <CarthageCornerMotif className="w-6 h-6 absolute bottom-1 left-1 pointer-events-none opacity-30 text-[#8C6527] rotate-180" />
    <ShipWatermark className="w-24 h-24 absolute -right-3 -bottom-3 pointer-events-none opacity-10 text-[#0F2038]" />
  </>
);

/**
 * Translucent Card Watermark Overlay (adds coin / column watermarks to cards)
 */
export const CardWatermarkOverlay: React.FC<{ watermark?: 'ship' | 'coin' | 'tower' | 'columns' | 'astrolabe' | 'waves' }> = ({ watermark = 'coin' }) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-[inherit]">
      <CarthageCornerMotif className="w-5 h-5 absolute top-1.5 right-1.5 opacity-35 text-[#8C6527]" />
      <CarthageCornerMotif className="w-5 h-5 absolute bottom-1.5 left-1.5 opacity-20 text-[#8C6527] rotate-180" />
      {watermark === 'ship' && <ShipWatermark className="w-28 h-28 absolute -right-4 -bottom-4 opacity-10 text-[#0F2038]" />}
      {watermark === 'coin' && <CoinWatermark className="w-24 h-24 absolute -right-3 -bottom-3 opacity-12 text-[#8C6527]" />}
      {watermark === 'tower' && <TowerWatermark className="w-24 h-24 absolute -right-3 -bottom-3 opacity-10 text-[#0F2038]" />}
      {watermark === 'columns' && <ColumnsWatermark className="w-24 h-24 absolute -right-3 -bottom-3 opacity-10 text-[#0F2038]" />}
      {watermark === 'astrolabe' && <AstrolabeWatermark className="w-24 h-24 absolute -right-3 -bottom-3 opacity-12 text-[#8C6527]" />}
      {watermark === 'waves' && <WavesWatermark className="w-28 h-28 absolute -right-4 -bottom-4 opacity-12 text-[#8C6527]" />}
    </div>
  );
};

/**
 * Translucent Hero / Section Header Watermark Banner
 */
export const HeroIllustrationWatermark: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-[inherit]">
    <div className="absolute inset-0 opacity-15">
      <CarthageHarborPanorama />
    </div>
    <div className="absolute top-2 right-4 opacity-10 w-32 h-32">
      <AstrolabeWatermark className="w-full h-full text-[#8C6527]" />
    </div>
  </div>
);

