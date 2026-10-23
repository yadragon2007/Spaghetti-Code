import { Earth } from '../../Constants/TS/index.ts';

export const R_UNIVERSAL = 8.31446261815324;                                   // J/(mol·K)
export const T0 = Earth.terrestrial_atmosphere.average_temperature_C + 273.15; // K
export const P0 = Earth.terrestrial_atmosphere.surface_pressure_kPa * 1000;    // Pa
export const MOLAR_MASS = Earth.terrestrial_atmosphere.mean_molecular_weight / 1000; // kg/mol
export const R_AIR = R_UNIVERSAL / MOLAR_MASS;                                 // J/(kg·K)
export const R_EARTH = Earth.bulk_parameters.volumetric_mean_radius_km * 1000; // m
export const GM = Earth.bulk_parameters.gm_m3_per_s2;                          // m³/s² (needs the 0.3986e15 fix)
export const G0 = GM / (R_EARTH * R_EARTH);                                    // m/s²

// Temperature layers (U.S. Standard Atmosphere 1976): base geopotential height (m), lapse rate (K/m)
export const LAYERS = [
  { hb: 0,     L: -0.0065 },
  { hb: 11000, L:  0.0    },
  { hb: 20000, L:  0.0010 },
  { hb: 32000, L:  0.0028 },
  { hb: 47000, L:  0.0    },
  { hb: 51000, L: -0.0028 },
  { hb: 71000, L: -0.0020 },
  { hb: 84852, L:  0.0    },
];

/** Geometric altitude h (m) -> geopotential altitude H (m) */
export function geopotential(h: number): number {
  return (R_EARTH * h) / (R_EARTH + h);
}

/** Index of the layer that contains geopotential altitude H */
export function layerIndex(H: number): number {
  let i = LAYERS.length - 1;
  while (i > 0 && H < LAYERS[i].hb) i--;
  return i;
}