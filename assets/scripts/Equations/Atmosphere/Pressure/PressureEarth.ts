import { P0, G0, R_AIR, LAYERS, geopotential, layerIndex } from '../EarthConstants.ts';
import { BASE_T, temperatureK } from '../Temperature/TempEarth.ts';

// Layer with lapse rate:  P = Pb · (T/Tb)^(-g0/(R·L))
// Isothermal layer:       P = Pb · exp(-g0·ΔH/(R·Tb))
function layerPressure(Pb: number, Tb: number, T: number, L: number, dH: number): number {
  return L === 0
    ? Pb * Math.exp(-G0 * dH / (R_AIR * Tb))
    : Pb * Math.pow(T / Tb, -G0 / (R_AIR * L));
}

// Pressure at the base of every layer
const BASE_P: number[] = [P0];
for (let i = 1; i < LAYERS.length; i++) {
  const prev = LAYERS[i - 1];
  const dH = LAYERS[i].hb - prev.hb;
  BASE_P.push(layerPressure(BASE_P[i - 1], BASE_T[i - 1], BASE_T[i], prev.L, dH));
}

/** Pressure in Pa at geometric altitude h (m) */
export function pressurePa(h: number): number {
  const H = geopotential(Math.max(0, h));
  const i = layerIndex(H);
  const { hb, L } = LAYERS[i];
  return layerPressure(BASE_P[i], BASE_T[i], temperatureK(h), L, H - hb);
}