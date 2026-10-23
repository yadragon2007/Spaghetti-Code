import { T0, LAYERS, geopotential, layerIndex } from '../EarthConstants.ts';

// Temperature at the base of every layer: T = Tb + L·ΔH
export const BASE_T: number[] = [T0];
for (let i = 1; i < LAYERS.length; i++) {
  const prev = LAYERS[i - 1];
  BASE_T.push(BASE_T[i - 1] + prev.L * (LAYERS[i].hb - prev.hb));
}

/** Temperature in Kelvin at geometric altitude h (m) */
export function temperatureK(h: number): number {
  const H = geopotential(Math.max(0, h));
  const i = layerIndex(H);
  return BASE_T[i] + LAYERS[i].L * (H - LAYERS[i].hb);
}

/** Temperature in °C at geometric altitude h (m) */
export function temperatureC(h: number): number {
  return temperatureK(h) - 273.15;
}