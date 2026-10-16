import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  textColor?: string;
  goldColor?: string;
}

/**
 * Classical Carthage Punic Ship Crest Mark
 * Reverted to the authentic Carthage heritage emblem:
 * - Circular Punic galley with classical sail and celestial star
 * - Double concentric coin border with subtle dotted ring
 */
export const QartiniaCrestSvg: React.FC<{
  className?: string;
  size?: number;
  textColor?: string;
  goldColor?: string;
}> = ({
  className = 'w-9 h-9',
  size,
  textColor = '#0F2038',
  goldColor = '#8C6527',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Qartinia Carthage Crest"
    >
      <circle cx="32" cy="32" r="30" stroke={textColor} strokeWidth="1.5" fill="#FAF8F5" />
      <circle cx="32" cy="32" r="27" stroke="#C5A880" strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
      {/* Ship Hull */}
      <path
        d="M12 40C20 48 44 48 52 40L55 34L46 36C38 38 26 38 18 36L9 34L12 40Z"
        fill={textColor}
      />
      {/* Central Mast */}
      <line x1="32" y1="12" x2="32" y2="40" stroke={textColor} strokeWidth="2" strokeLinecap="round" />
      {/* Forward Navy Main Sail */}
      <polygon points="32,15 48,29 32,29" fill={textColor} opacity="0.9" />
      {/* Aft Bronze Jib Sail */}
      <polygon points="32,17 20,28 32,28" fill={goldColor} opacity="0.85" />
      {/* Carthage Seawall / Horizon Line */}
      <line x1="8" y1="46" x2="56" y2="46" stroke="#C5A880" strokeWidth="1.2" strokeLinecap="round" />
      {/* Water Ripple Line */}
      <line x1="14" y1="51" x2="50" y2="51" stroke={textColor} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      {/* Celestial Guidance Star at Mast Apex */}
      <circle cx="32" cy="10" r="2.5" fill={goldColor} />
    </svg>
  );
};

/**
 * Reverted Official Qartinia Brand Wordmark with Carthage Punic Crest
 * Combines the classical circular Carthage Punic galley emblem with bold serif typography
 */
export const QartiniaLogo: React.FC<{
  className?: string;
  height?: number;
  textColor?: string;
  goldColor?: string;
  withSubtitle?: boolean;
}> = ({
  className = '',
  height = 36,
  textColor = '#0F2038',
  goldColor = '#8C6527',
  withSubtitle = false,
}) => {
  const crestSize = Math.max(20, Math.round(height * 0.9));
  const fontSize = Math.max(16, Math.round(height * 0.65));

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <QartiniaCrestSvg
        size={crestSize}
        textColor={textColor}
        goldColor={goldColor}
        className="shrink-0"
      />
      <div className="flex flex-col justify-center">
        <span
          className="font-serif font-black tracking-tight leading-none"
          style={{ fontSize: `${fontSize}px`, color: textColor }}
        >
          Qartinia
        </span>
        {withSubtitle && (
          <span
            className="text-[9px] uppercase font-mono tracking-widest leading-none mt-1"
            style={{ color: goldColor }}
          >
            Deep-Tech Intelligence
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Base64 SVG URI for Qartinia Carthage Emblem to maintain backward compatibility
 */
export const QARTINIA_EMBLEM_SRC =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="%230F2038" stroke-width="1.5" fill="%23FAF8F5"/><circle cx="32" cy="32" r="27" stroke="%23C5A880" stroke-width="0.8" stroke-dasharray="2 2"/><path d="M12 40C20 48 44 48 52 40L55 34L46 36C38 38 26 38 18 36L9 34L12 40Z" fill="%230F2038"/><line x1="32" y1="12" x2="32" y2="40" stroke="%230F2038" stroke-width="2" stroke-linecap="round"/><polygon points="32,15 48,29 32,29" fill="%230F2038" opacity="0.9"/><polygon points="32,17 20,28 32,28" fill="%238C6527" opacity="0.85"/><line x1="8" y1="46" x2="56" y2="46" stroke="%23C5A880" stroke-width="1.2" stroke-linecap="round"/><line x1="14" y1="51" x2="50" y2="51" stroke="%230F2038" stroke-width="1" stroke-linecap="round" opacity="0.6"/><circle cx="32" cy="10" r="2.5" fill="%238C6527"/></svg>';
