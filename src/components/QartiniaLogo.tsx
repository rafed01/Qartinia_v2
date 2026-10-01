import React from 'react';
import emblemImage from '../assets/images/qartinia_heritage_emblem_1790890145045.jpg';

export const QARTINIA_EMBLEM_SRC = emblemImage;

export const QartiniaCrestSvg: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Outer Deep Navy Crescent Q */}
    <circle cx="60" cy="56" r="44" stroke="#0F2537" strokeWidth="10" />
    {/* Inner Golden Heritage Ring */}
    <circle cx="60" cy="56" r="35" stroke="#C59B47" strokeWidth="2" strokeDasharray="4 3" />
    {/* Classical Carthaginian Columns inside the Q */}
    <rect x="42" y="36" width="6" height="34" fill="#C59B47" rx="1" />
    <rect x="55" y="28" width="6" height="42" fill="#0F2537" rx="1" />
    <rect x="68" y="40" width="6" height="30" fill="#C59B47" rx="1" />
    {/* Architrave / Horizon Line */}
    <path d="M34 70H86" stroke="#0F2537" strokeWidth="4" strokeLinecap="round" />
    {/* Signature Q Tail */}
    <path
      d="M74 82L102 104"
      stroke="#0F2537"
      strokeWidth="10"
      strokeLinecap="round"
    />
    <path
      d="M77 80L104 101"
      stroke="#C59B47"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
