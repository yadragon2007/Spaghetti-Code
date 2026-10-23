import { TempEarthPerAltitudeInC } from "../Temperature/TempEarth.ts";
import { UniversalConstants } from "../../Constants/TS/index.ts";
import { Earth } from "../../Constants/TS/index.ts";


export const EarthGravityEquation = (Altitude: number) => {
  let { gm_m3_per_s2: GM, equatorial_radius_m: R } = Earth.bulk_parameters;

  let gravityAltitude_MperS3 = GM / Math.pow(R+Altitude,2);

  return gravityAltitude_MperS3;
};
