export const srcThruster = {
  habitat_attitude_control: {
    ascent_habitat_rcs_mass_kg: 0,
    atmospheric_habitat_rcs_mass_kg: 0,
    transit_habitat_rcs_mass_kg: 0,
    control_allocation_notes: "ACS/RCS thrust authority delegated to attached propulsion stages and service modules during coast and burns"
  },
  orbit_attitude_station_keeping: {
    target_apogee_maintenance_altitude_km: 300,
    required_attitude_guidance: "Closed-loop 3-axis bank and angle-of-attack modulation during aerocapture corridor passage"
  }
} as const;

export default srcThruster;