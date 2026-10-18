export const docking = {
  ascent_habitat_docking: {
    docking_mechanisms_count: 1,
    docking_tunnels_count: 0,
    target_rendezvous_vehicle:
      "Orbiting Transit Habitat and TEI stage in Low Venus Orbit (LVO)",
    host_habitat_dry_structure_mass_kg: 523,
    launch_integration_allocation_percent: 2.0,
  },
  atmospheric_habitat_docking: {
    docking_mechanisms_count: 1,
    docking_tunnels_count: 1,
    target_rendezvous_vehicle:
      "Ascent vehicle transfer tunnel / airship envelope port",
    host_habitat_dry_structure_mass_kg: 1104,
    launch_integration_allocation_percent: 2.0,
  },
  transit_habitat_docking: {
    docking_mechanisms_count: 2,
    docking_tunnels_count: 2,
    target_rendezvous_vehicle:
      "Crew Capsule and Ascent Habitat in Earth/Venus orbit",
    contingency_internal_airlock_mass_kg: 600,
    contingency_internal_airlock_volume_m3: 6.0,
    host_habitat_dry_structure_mass_kg: 2767,
    launch_integration_allocation_percent: 2.0,
  },
} as const;

export default docking;
