import { GM, R_EARTH } from '../EarthConstants.ts';

/** Gravity in m/s² at geometric altitude h (m): g = GM / (R + h)² */
export function gravityMS2(h: number): number {
  const r = R_EARTH + Math.max(0, h);
  return GM / (r * r);
}