export const thrusters = {
  atmospheric_airship_propellers: {
    type: "Vectoring electric motors and propellers mounted to gondola baseplate",
    power_source: "Solar array with rechargeable Li-ion batteries",
    daytime_dash_velocity_m_per_s: 15,
    nighttime_low_energy_stationkeeping_velocity_m_per_s: 3,
    primary_vectoring_objective: "Counter northward poleward drift of up to 5 m/s while riding 85-100 m/s longitudinal winds"
  },
  solar_electric_propulsion_thrusters: {
    propulsion_class: "High-efficiency, low-thrust electric propulsion",
    input_power_kWe: 50,
    specific_impulse_s: 2500,
    thruster_efficiency_percent: 60,
    propellant_mass_capacity_kg: 2850,
    mission_time_of_flight_days: 360
  }
} as const;

export default thrusters;