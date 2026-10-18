export const fuleTank = {
  robotic_airship_helium_tanks: {
    lifting_gas_type: "Helium",
    gas_molecular_weight_g_per_mole: 4.0,
    gas_mass_capacity_kg: 118,
    tank_dry_mass_kg: 96,
    operational_sequence:
      "Multiple tanks discharged in sequence and jettisoned when depleted",
  },
  human_airship_helium_tanks: {
    lifting_gas_type: "Helium",
    gas_molecular_weight_g_per_mole: 4.0,
    gas_mass_capacity_kg: 8183,
    tank_dry_mass_kg: 6623,
    operational_sequence:
      "Multiple tanks discharged in sequence and jettisoned when depleted",
  },
  venus_ascent_vehicle_tanks: {
    propellant_type: "LOX / RP-1",
    total_vehicle_gross_mass_t: 63.0,
    total_vehicle_mass_kg: 62743,
  },
  interplanetary_propellant_stages: {
    tvi_stage_1_gross_mass_kg: 109351,
    tvi_stage_2_gross_mass_kg: 109351,
    tei_stage_gross_mass_kg: 52367,
  },
} as const;

export default fuleTank;
