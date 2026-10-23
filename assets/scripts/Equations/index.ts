import { airDensityEarth } from "./Density/AirDensityEarth";
import { PressuerEarthPascal } from "./Pressure/PressureEarth";
import {
  TempEarthPerAltitudeInC,
  TempEarthPerAltitudeInK,
} from "./Temperature/TempEarth";

export const earthAltitudeData = (Altitude) => {
  const temperature_degC = TempEarthPerAltitudeInC(Altitude);
  const temperature_degK = TempEarthPerAltitudeInK(Altitude);

  const pressure_kPa = PressuerEarthPascal(Altitude, temperature_degK);
  const airDensityEarth_kgPerCubicMeter = airDensityEarth(
    pressure_kPa,
    temperature_degK,
  );

  return {
    Altitude,
    temperature: {
      _degC:temperature_degC,
      _degK:temperature_degK,
    },
    pressure_kPa,
    airDensityEarth_kgPerCubicMeter,
  };
};
