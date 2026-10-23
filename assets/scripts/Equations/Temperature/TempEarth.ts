import { Earth } from "../../Constants/TS/index.ts";

export const TempEarthPerAltitudeInC = (Altitude: number) => {
  const averageTemp = Earth.terrestrial_atmosphere.average_temperature_C;
  let temp;

  if (Altitude > 25000) {
    temp = -131.21 + 0.00299 * Altitude;
  } else if (Altitude >= 11000) {
    temp = -56.46;
  } else {
    temp = averageTemp + 0.00649 * Altitude;
  }
  return temp;
};

export const TempEarthPerAltitudeInK = (Altitude: number) => {
  const averageTemp = Earth.terrestrial_atmosphere.average_temperature_C;
  let temp;

  if (Altitude > 25000) {
    temp = -131.21 + 0.00299 * Altitude;
  } else if (Altitude >= 11000) {
    temp = -56.46;
  } else {
    temp = averageTemp + 0.00649 * Altitude;
  }
  
  return temp + 273.1;
};
