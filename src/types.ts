// Shared Types for Fluid Motion TV & Lotus Nexus Piano

export interface TideData {
  heightM: number;
  meanLevelM: number;
  direction: 'flooding' | 'ebbing';
  velocityKnots: number;
  barCrossingSafe: boolean;
  locationName: string;
  nextHighAt: string;
}

export interface ScriptLine {
  speaker: 'kimi' | 'timi' | 'both';
  text: string;
}

export interface CompositionScene {
  id: number;
  name: string;
  root: number;
  scale: number[];
  tempo: number;
  color: [number, number, number];
  petals: number;
}

export interface SystemTelemetry {
  horizonEngine: number;
  d9ClockSync: number;
  tideOracleFeed: number;
  meshUptime: number;
}

export type ViewMode = 'horizon' | 'lotus' | 'dashboard';
