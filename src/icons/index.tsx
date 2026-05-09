// src/icons/index.tsx — CIPHER icon set
// Line-art only. Stroke 1.5. No fills unless explicitly noted.

import React from "react";
import Svg, { Path, Rect, Circle, G, Line } from "react-native-svg";

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const D = (size = 24) => ({ width: size, height: size, viewBox: "0 0 24 24" });

export const MicIcon: React.FC<IconProps> = ({ size = 28, color = "#fff", strokeWidth = 1.8 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="9" y="3" width="6" height="11" rx="3" />
    <Path d="M5 11a7 7 0 0 0 14 0" />
    <Path d="M12 18v3" />
  </Svg>
);

export const StopIcon: React.FC<IconProps> = ({ size = 22, color = "#fff" }) => (
  <Svg {...D(size)} fill={color}>
    <Rect x="5" y="5" width="14" height="14" rx="2" />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 24, color = "#fff", strokeWidth = 1.5 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="5" y="11" width="14" height="9" rx="1.5" />
    <Path d="M8 11V7.5a4 4 0 1 1 8 0V11" />
  </Svg>
);

export const ReticleIcon: React.FC<IconProps> = ({ size = 24, color = "#fff", strokeWidth = 1.5 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="12" cy="12" r="7" />
    <Circle cx="12" cy="12" r="2.5" fill={color} stroke="none" />
    <Line x1="12" y1="2" x2="12" y2="5" strokeLinecap="round" />
    <Line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round" />
    <Line x1="2" y1="12" x2="5" y2="12" strokeLinecap="round" />
    <Line x1="19" y1="12" x2="22" y2="12" strokeLinecap="round" />
  </Svg>
);

export const HintIcon: React.FC<IconProps> = ({ size = 18, color = "#fff", strokeWidth = 1.5 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18h6" />
    <Path d="M10 21h4" />
    <Path d="M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.5 1 2.5h6c0-1 .3-1.9 1-2.5A6 6 0 0 0 12 3z" />
  </Svg>
);

export const HintHideIcon: React.FC<IconProps> = ({ size = 18, color = "#fff", strokeWidth = 1.5 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 3l18 18" />
    <Path d="M9 18h6" />
    <Path d="M10 21h4" />
    <Path d="M9 13.5C7.2 12.4 6 10.4 6 8a6 6 0 0 1 10.5-4M18 8c0 2-.8 3.7-2 5" />
  </Svg>
);

export const SolutionIcon: React.FC<IconProps> = ({ size = 18, color = "#fff", strokeWidth = 1.5 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 5h18v14H3z" />
    <Path d="M3 5l9 6 9-6" />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 14, color = "#fff", strokeWidth = 2 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12.5l4 4 10-10" />
  </Svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 20, color = "#fff", strokeWidth = 2 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 20, color = "#fff", strokeWidth = 1.5 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Svg>
);

export const HouseIcon: React.FC<IconProps> = ({ size = 18, color = "#fff", strokeWidth = 1.5 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />
  </Svg>
);

export const ExitIcon: React.FC<IconProps> = ({ size = 18, color = "#fff", strokeWidth = 1.5 }) => (
  <Svg {...D(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Path d="M16 17l5-5-5-5" />
    <Path d="M21 12H9" />
  </Svg>
);

// CIPHER mark — eye + soundwaves. Used on AuthLanding logo, Story success, etc.
export const CipherMark: React.FC<IconProps> = ({ size = 80, color = "#FF6A1A", strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none">
      <Path d="M12 40c8-12 18-18 28-18s20 6 28 18c-8 12-18 18-28 18s-20-6-28-18z" />
      <Circle cx="40" cy="40" r="9" />
      <Circle cx="40" cy="40" r="3.5" fill={color} />
      <Path d="M6 36c-1 2.5-1 5.5 0 8" />
      <Path d="M2 32c-2 5-2 11 0 16" />
      <Path d="M74 36c1 2.5 1 5.5 0 8" />
      <Path d="M78 32c2 5 2 11 0 16" />
    </G>
  </Svg>
);

export const TruthRevealedIcon: React.FC<IconProps> = ({ size = 56, color = "#FF6A1A" }) => (
  <CipherMark size={size} color={color} strokeWidth={2.2} />
);

export const AscendIcon: React.FC<IconProps> = ({ size = 56, color = "#FF6A1A", strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="28" cy="28" r="22" />
    <Path d="M18 32l10-10 10 10" />
    <Path d="M18 24l10-10 10 10" />
  </Svg>
);
