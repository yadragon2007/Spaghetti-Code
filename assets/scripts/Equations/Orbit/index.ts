import { orbitPeriod } from "./PlanetOrbit/orbitPeriod.ts";
import { orbitSpeed } from "./PlanetOrbit/orbitSpeed.ts";

export const Orbit = () => {};

import { Sun, Earth } from "../../Constants/TS/index.ts";
const { gm_x_10_6_km3_per_s2 } = Sun.bulk_parameters;
const { gm_m3_per_s2 , equatorial_radius_m } = Earth.bulk_parameters;
/**
 * Constants for Interplanetary Transfer Calculations
 * Distances are in meters, masses in kg, velocities in m/s, time in seconds.
 */
export const ASTRO_CONSTANTS = {
  // Standard gravitational parameters (μ = G * M) in m^3/s^2
  MU_SUN: gm_x_10_6_km3_per_s2 * 1000,
  MU_EARTH: gm_m3_per_s2,

  // Orbital radii in meters
  R_ORBIT_EARTH: 1.495978707e11,
  R_ORBIT_VENUS: 1.08208e11,

  // Earth reference velocities in m/s
  V_ORBIT_EARTH: 29780,

  // Angular velocity of Venus in degrees per second
  OMEGA_VENUS_DEG_PER_SEC: 1.602e-7,

  // Standard gravity for ISP calculations (m/s^2)
  G0: 9.80665,
};

// 1. Transfer Orbit Semi-major Axis (a_t)
export function getTransferSemiMajorAxis(r1: number, r2: number): number {
  return (r1 + r2) / 2;
}

// 2. Transfer Velocity (v_transfer)
export function getTransferVelocity(
  muCentral: number,
  rCurrent: number,
  aTransfer: number,
): number {
  return Math.sqrt(muCentral * (2 / rCurrent - 1 / aTransfer));
}

// 3. Hyperbolic Excess Velocity (v_infinity)
export function getHyperbolicExcessVelocity(
  vPlanet: number,
  vTransfer: number,
): number {
  return Math.abs(vPlanet - vTransfer);
}

// 4. Time of Flight (TOF) in seconds
export function getTimeOfFlight(aTransfer: number, muCentral: number): number {
  return Math.PI * Math.sqrt(Math.pow(aTransfer, 3) / muCentral);
}

// 5. Phase Angle (phi) in degrees
export function getPhaseAngle(
  omegaTarget: number,
  timeOfFlight: number,
): number {
  return 180 - omegaTarget * timeOfFlight;
}

// 6. Injection Velocity (v_injection)
export function getInjectionVelocity(
  muPlanet: number,
  rParkingOrbit: number,
  vInfinity: number,
): number {
  const escapeVelSq = (2 * muPlanet) / rParkingOrbit;
  return Math.sqrt(escapeVelSq + Math.pow(vInfinity, 2));
}

// 7. Required Delta-v (Δv)
export function getDeltaV(vInjection: number, vParkingOrbit: number): number {
  return vInjection - vParkingOrbit;
}

// 8. Propellant Mass (m_fuel)
export function getRequiredPropellantMass(
  deltaV: number,
  specificImpulse: number,
  dryMass: number,
): number {
  const exhaustVelocity = specificImpulse * ASTRO_CONSTANTS.G0;
  return dryMass * (Math.exp(deltaV / exhaustVelocity) - 1);
}

// 9. Escape Eccentricity (e)
export function getEscapeEccentricity(
  rParkingOrbit: number,
  vInfinity: number,
  muPlanet: number,
): number {
  return 1 + (rParkingOrbit * Math.pow(vInfinity, 2)) / muPlanet;
}

// ==========================================
// Example Execution for an Earth-to-Venus Transfer
// ==========================================

const parkingOrbitAltitude = 300_000; // 300 km LEO
const earthRadius = 6_371_000;
const rLEO = earthRadius + parkingOrbitAltitude;
const vLEO = Math.sqrt(ASTRO_CONSTANTS.MU_EARTH / rLEO);

const spacecraftDryMass = 2000;
const engineISP = 320;

const a_t = getTransferSemiMajorAxis(
  ASTRO_CONSTANTS.R_ORBIT_EARTH,
  ASTRO_CONSTANTS.R_ORBIT_VENUS,
);

const v_transfer = getTransferVelocity(
  ASTRO_CONSTANTS.MU_SUN,
  ASTRO_CONSTANTS.R_ORBIT_EARTH,
  a_t,
);

const v_inf = getHyperbolicExcessVelocity(
  ASTRO_CONSTANTS.V_ORBIT_EARTH,
  v_transfer,
);

const tof = getTimeOfFlight(a_t, ASTRO_CONSTANTS.MU_SUN);

const phaseAngle = getPhaseAngle(ASTRO_CONSTANTS.OMEGA_VENUS_DEG_PER_SEC, tof);

const v_inj = getInjectionVelocity(ASTRO_CONSTANTS.MU_EARTH, rLEO, v_inf);

const deltaV = getDeltaV(v_inj, vLEO);

const fuelMass = getRequiredPropellantMass(
  deltaV,
  engineISP,
  spacecraftDryMass,
);

const eccentricity = getEscapeEccentricity(
  rLEO,
  v_inf,
  ASTRO_CONSTANTS.MU_EARTH,
);
