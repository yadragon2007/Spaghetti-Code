export const trajectories = {
  flight_dynamics_and_trajectories: {
    interplanetary_round_trip: {
      outbound_transit_days: 110,
      venus_stay_time_days: 30,
      return_transit_days: 300,
      total_mission_duration_days: 440,
      earth_departure_delta_v_km_per_s: 3.9,
      venus_arrival_entry_velocity_km_per_s: 11.3,
      venus_departure_delta_v_km_per_s: 4.1,
      earth_arrival_entry_velocity_km_per_s: 14.2
    },
    airship_propulsive_velocities: {
      dash_velocity_m_per_s: 15,
      low_energy_night_velocity_m_per_s: 3,
      inflation_start_velocity_m_per_s: 100
    },
    solar_electric_propulsion_concept: {
      payload_mass_kg: 3000,
      power_kWe: 50,
      specific_impulse_s: 2500,
      efficiency_percent: 60,
      propellant_mass_kg: 2850,
      inert_mass_kg: 8770,
      time_of_flight_days: 360,
      departure_v_infinity_km_per_s: 3.46,
      arrival_v_infinity_km_per_s: 0.0
    },
    aerocapture_design_limits: {
      target_orbit_altitude_km: 300,
      minimum_flight_path_corridor_width_deg: 1.0,
      aerocapture_entry_speed_min_km_per_s: 10.0,
      aerocapture_entry_speed_max_km_per_s: 12.0,
      lift_to_drag_ratios_analyzed: [0.4, 0.52, 0.6]
    }
  },
  entry_descent_and_inflation_profiles: {
    robotic_mission: {
      entry_altitude_km: 200,
      entry_velocity_m_per_s: 7200,
      max_heat_rate_W_per_cm2: 66.3,
      max_heat_rate_time_s: 195,
      max_heat_rate_altitude_km: 99.1,
      max_heat_rate_velocity_m_per_s: 6695,
      max_dynamic_pressure_kPa: 2.39,
      max_dynamic_pressure_time_s: 198,
      max_dynamic_pressure_altitude_km: 98.7,
      max_dynamic_pressure_velocity_m_per_s: 6542,
      max_g_load_earth_g: 6.17,
      parachute_deploy_time_s: 444,
      parachute_deploy_altitude_km: 82.7,
      parachute_deploy_velocity_m_per_s: 451,
      jettison_aeroshell_time_s: 488,
      jettison_aeroshell_altitude_km: 76.2,
      jettison_aeroshell_velocity_m_per_s: 96,
      jettison_parachute_time_s: 796,
      jettison_parachute_altitude_km: 66.2,
      jettison_parachute_velocity_max_m_per_s: 10
    },
    crewed_mission: {
      entry_altitude_km: 200,
      entry_velocity_m_per_s: 7200,
      max_heat_rate_W_per_cm2: 233,
      max_heat_rate_time_s: 211,
      max_heat_rate_altitude_km: 90.1,
      max_heat_rate_velocity_m_per_s: 6705,
      max_dynamic_pressure_kPa: 27.3,
      max_dynamic_pressure_time_s: 216,
      max_dynamic_pressure_altitude_km: 89.4,
      max_dynamic_pressure_velocity_m_per_s: 6422,
      max_g_load_earth_g: 6.71,
      parachute_deploy_time_s: 522,
      parachute_deploy_altitude_km: 75.1,
      parachute_deploy_velocity_m_per_s: 483,
      jettison_aeroshell_time_s: 586,
      jettison_aeroshell_altitude_km: 64.1,
      jettison_aeroshell_velocity_m_per_s: 99,
      jettison_parachute_time_s: 709,
      jettison_parachute_altitude_km: 55.6,
      jettison_parachute_velocity_m_per_s: 41
    },
    inflation_assumptions: {
      airship_inflation_trigger_velocity_m_per_s: 100,
      parachute_jettison_buoyancy_to_drag_ratio_percent: 90
    }
  }
} as const;