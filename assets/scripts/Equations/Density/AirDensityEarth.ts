import * as PressureEarth from "../Pressure/PressureEarth.ts";
import * as TempEarth from "../Temperature/TempEarth.ts";
import { UniversalConstants } from "../../Constants/TS/index.ts";

export const airDensityEarth = (PressureAltitude: number, tempAtAltitudeInK: number) => {
  const { CELSIUS_ZERO_POINT } = UniversalConstants;

  return PressureAltitude / (0.2869 * (tempAtAltitudeInK));
};
