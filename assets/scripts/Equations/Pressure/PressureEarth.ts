import { TempEarthPerAltitudeInC } from "../Temperature/TempEarth.ts";
import { UniversalConstants } from "../../Constants/TS/index.ts";

export const PressuerEarthPascal = (Altitude:number, tempAtAltitudeInK:number) => {
  const { CELSIUS_ZERO_POINT } = UniversalConstants;

  let pressure_kPa;

  if (Altitude > 25000) {
    pressure_kPa = 2.488 * Math.pow(tempAtAltitudeInK / 216.6, -11.388);
  } else if (Altitude >= 11000) {
    pressure_kPa = 22.65 * Math.exp(1.73 - 0.000157 * Altitude);
  } else {
    pressure_kPa = 101.29 * Math.pow(tempAtAltitudeInK / 288.08, 5.256);
  }

  return pressure_kPa;
};
