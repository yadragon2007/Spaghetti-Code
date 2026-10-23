import { temperatureK, temperatureC } from "./Temperature/TempEarth.ts";
import { pressurePa } from "./Pressure/PressureEarth.ts";
import { densityKgM3 } from "./Density/AirDensityEarth.ts";
import { gravityMS2 } from "./Gravity/EarthGravity.ts";

export function atmosphereAt(h: number) {
  return {
    altitude_m: h,
    temperature_K: temperatureK(h),
    temperature_C: temperatureC(h),
    pressure_Pa: pressurePa(h),
    density_kg_m3: densityKgM3(h),
    gravity_m_s2: gravityMS2(h),
  };
}
console.log(atmosphereAt(1));