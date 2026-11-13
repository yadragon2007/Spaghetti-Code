export const stageSeparator = {
  trans_venus_injection_staging: {
    stage_1_separation_imleo_kg: 348455,
    stage_1_dry_jettison_mass_kg: 109351,
    stage_2_separation_imleo_kg: 239104,
    stage_2_dry_jettison_mass_kg: 109351
  },
  entry_and_descent_separation_sequence: {
    aeroshell_separation_velocity_m_per_s: 100,
    parachute_jettison_trigger_buoyancy_to_drag_percent: 90,
    robotic_parachute_jettison_altitude_km: 66.2,
    crewed_parachute_jettison_altitude_km: 55.6
  },
  venus_ascent_vehicle_staging: {
    number_of_stages: 2,
    stage_1_burn_location: "From 50 km cloud deck into upper atmosphere",
    stage_2_burn_location: "Vacuum orbital circularization to 300 km Low Venus Orbit (LVO)",
    estimated_total_delta_v_m_per_s: 9000
  }
} as const;

export default stageSeparator;