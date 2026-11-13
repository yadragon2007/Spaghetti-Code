import { R_AIR } from '../EarthConstants.ts';
import { temperatureK } from '../Temperature/TempEarth.ts';
import { pressurePa } from '../Pressure/PressureEarth.ts';

/** Air density in kg/m³ from the ideal gas law: ρ = P / (R_air · T) */
export function densityKgM3(h: number): number {
  return pressurePa(h) / (R_AIR * temperatureK(h));
}