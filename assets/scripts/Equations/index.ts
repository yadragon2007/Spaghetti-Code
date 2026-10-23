import { airDensityEarth } from "./Density/AirDensityEarth.ts";
import { PressuerEarthPascal } from "./Pressure/PressureEarth.ts";
import {
  TempEarthPerAltitudeInC,
  TempEarthPerAltitudeInK,
} from "./Temperature/TempEarth.ts";
import { EarthGravityEquation } from "./Gravity/EarthGravity.ts";




export const earthAltitudeData = (Altitude: number) => {
  const temperature_degC = TempEarthPerAltitudeInC(Altitude);
  const temperature_degK = TempEarthPerAltitudeInK(Altitude);

  const pressure_kPa = PressuerEarthPascal(Altitude, temperature_degK);
  
  const airDensityEarth_kgPerCubicMeter = airDensityEarth(
    pressure_kPa,
    temperature_degK
  );

  const gravity_m_per_s2 = EarthGravityEquation(Altitude);

  return {
    Altitude,
    temperature: {
      _degC: temperature_degC,
      _degK: temperature_degK,
    },
    pressure_kPa,
    airDensityEarth_kgPerCubicMeter,
    gravity_m_per_s2,
  };
};



console.log(earthAltitudeData(432434343));
