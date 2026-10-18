export const Parachute = {
  supersonic_dgb_parachute: {
    decelerator_type: "Disc-Gap-Band (DGB) supersonic parachute",
    operational_mach_min: 1.0,
    operational_mach_max: 2.25,
    dynamic_pressure_lower_limit_Pa: 200,
    dynamic_pressure_upper_limit_Pa: 900,
    robotic_deploy_time_s: 444,
    robotic_deploy_altitude_km: 82.7,
    robotic_deploy_velocity_m_per_s: 451,
    crewed_deploy_time_s: 522,
    crewed_deploy_altitude_km: 75.1,
    crewed_deploy_velocity_m_per_s: 483,
    jettison_threshold_buoyancy_to_drag_percent: 90
  },
  high_dynamic_pressure_advanced_decelerator: {
    candidate_architectures: ["Ballute", "Inflatable Aerodynamic Decelerator (IAD)"],
    deployment_dynamic_pressure_min_kPa: 3.0,
    deployment_dynamic_pressure_max_kPa: 4.0,
    application: "Enables decelerator deployment under heavy crewed entry dynamic pressure loads"
  }
} as const;

export default Parachute;