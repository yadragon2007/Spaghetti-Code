export const heatShield = {
  robotic_tps: {
    selected_material: "PICA (Phenolic Impregnated Carbon Ablator)",
    material_architecture: "Monolithic resin-infused fiber-form insulation",
    assumed_mass_kg: 1050,
    calculated_mass_with_25pct_margin_kg: 2360,
    minimum_manufacturable_thickness_mm: 5.0,
    dual_pulse_aerocapture_entry_verified: false
  },
  crewed_tps: {
    selected_material: "HEEET (Heatshield for Extreme Entry Environment Technology)",
    material_architecture: "Dual-layer 3D woven carbon fibers infused with phenolic resin (recession and insulation layers)",
    assumed_mass_kg: 33300,
    calculated_mass_with_25pct_margin_kg: 34500,
    minimum_manufacturable_thickness_mm: 5.0,
    thickness_tailoring_rules: {
      maximum_thickness_location: "Intersection of sphere and cylinder at centerline (t_max)",
      longitudinal_variation: "Falls from t_max to 60% of t_max down the cylinder along centerline",
      circumferential_variation: "Drops from centerline thickness to minimum thickness (t_min)",
      backshell_coverage: "No TPS required on back side of sphere or cylinder sections"
    }
  }
} as const;

export default heatShield;