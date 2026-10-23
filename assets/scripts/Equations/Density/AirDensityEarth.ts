import * as PressureEarth from "../Pressure/PressureEarth";
import * as TempEarth from "../Temperature/TempEarth";
import { UniversalConstants } from "../../Constants/TS/index";

export const airDensityEarth = (PressureAltitude, tempAtAltitudeInK) => {
  const { CELSIUS_ZERO_POINT } = UniversalConstants;
  const ZeroCelsitusInK = CELSIUS_ZERO_POINT.find(
    (a) => (a.unit = "Thermodynamic"),
  ).value;


  return PressureAltitude / (0.2869 * (tempAtAltitudeInK));
};
