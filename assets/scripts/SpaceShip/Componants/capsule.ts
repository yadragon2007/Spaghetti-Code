export const capsule = {
  ascent_habitat_capsule: {
    design_reference: "Similar to small capsule",
    crew_capacity: 2,
    mission_duration_days: 1,
    atmospheric_pressure_kPa: 101.4,
    habitable_volume_per_person_m3: 1.28,
    habitable_volume_total_m3: 2.56,
    pressurized_volume_total_m3: 4.63,
    length_m: 2.77,
    diameter_m: 1.5,
    dry_mass_kg: 2150,
    wet_mass_kg: 2172,
    power_required_kW: 1.0,
    battery_energy_storage_kWh: 4.9,
    number_of_batteries: 3,
    battery_depth_of_discharge_percent: 80,
    eva_capability: false,
    eclss_closure_air: "Open",
    eclss_closure_water: "Open",
  },
  earth_return_capsule: {
    design_reference: "Crew capsule with Service Module (SM)",
    crew_capacity: 2,
    mission_phase: "Earth return rendezvous, aerocapture/entry, and EDL",
    entry_velocity_km_per_s: 14.2,
  },
} as const;

export default capsule;
