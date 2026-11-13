export const engine = {
  venus_ascent_vehicle_propulsion: {
    stages_count: 2,
    propellant_combination: "LOX / RP-1",
    thermal_management_advantage:
      "Easier thermal management than cryogenic fuels",
    total_delta_v_delivered_m_per_s: 9000,
    ascent_origin_altitude_km: 50.0,
    insertion_orbit: "Low Venus Orbit (LVO)",
  },
  solar_electric_low_thrust_engine: {
    propellant_mass_kg: 2850,
    power_input_kWe: 50,
    specific_impulse_s: 2500,
    efficiency_percent: 60,
    thrust_operation: "Continuous low-thrust interplanetary transfer",
    time_of_flight_days: 360,
  },
  interplanetary_injection_stages: {
    trans_venus_injection_stage_1_delta_v_km_per_s: 3.9,
    trans_venus_injection_stage_2_mass_kg: 109351,
    trans_earth_injection_stage_delta_v_km_per_s: 4.1,
    trans_earth_injection_stage_mass_kg: 52367,
  },
} as const;

export default engine;
