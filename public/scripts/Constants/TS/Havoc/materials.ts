export const materials = {
  spacecraft_materials_and_subsystems: {
    FEP_Teflon: {
      transmittance_percent: { min: 91.5, max: 93.2 },
      thermal_tolerance_degC: { min: 75, max: 80 }
    },
    Polypropylene_PP: {
      transmittance_percent: { min: 90.7, max: 91.1 },
      temperature_degradation_limit_degC: { value: 50 }
    },
    Polyvinyl_Chloride_PVC: {
      transmittance_percent: { min: 42.6, max: 80.2 }
    },
    HEEET: {
      composition_type: { value: "Dual-layer 3D woven carbon fibers infused with phenolic resin" }
    },
    PICA: {
      composition_type: { value: "Phenolic Impregnated Carbon Ablator" }
    },
    Graphite_BMI: {
      thickness_cm: { value: 0.1 }
    },
    Aluminum_Honeycomb: {
      thickness_cm: { value: 5.08 },
      density_kg_per_m3: { value: 70 }
    },
    Helium: {
      molecular_weight_g_per_mole: { value: 4.0 }
    },
    LOX_RP1: {
      application_type: { value: "Venus Ascent Vehicle bipropellant" }
    },
    Lithium_ion_Batteries: {
      specific_energy_W_hr_per_kg: { value: 200 }
    },
    Ammonia: {
      application_type: { value: "External thermal loop working fluid" }
    },
    Propylene_Glycol_Water_Mixture: {
      concentration_percent: { value: 60 }
    },
    Lithium_Hydroxide_LiOH: {
      application_type: { value: "Atmospheric habitat open-loop CO2 scrubber" }
    },
    Multi_Layer_Insulation_MLI: {
      layer_count: { value: 20 }
    },
    Water_Radiation_Shielding: {
      thickness_cm: { value: 5.8 }
    },
    Gallium_Arsenide_GaAs: {
      cell_architecture_type: { value: "3-Junction" }
    },
    Disc_Gap_Band_Parachute: {
      mach_deployment_min: 1.0,
      mach_deployment_max: 2.25,
      dynamic_pressure_deployment_min_Pa: 200,
      dynamic_pressure_deployment_max_Pa: 900
    },
    common_habitat_architecture_assumptions: {
      minimum_barrel_ceiling_height_m: 2.5,
      secondary_structure_mass_kg_per_m2: 2.46,
      launch_integration_mass_percentage_of_gross: 2.0,
      power_distribution_voltage_V_DC: 120,
      power_management_efficiency_percent: 92,
      mass_growth_allowance_percent: 20,
      project_managers_reserve_percent: 10,
      contingency_consumables_days: 30
    },
    transit_habitat_airlock_and_eclss: {
      contingency_internal_airlock_mass_kg: 600,
      contingency_internal_airlock_volume_m3: 6.0,
      nominal_atmospheric_pressure_kPa: 70.3,
      nominal_atmospheric_pressure_psi: 10.2,
      eclss_air_loop_closure_percent: 100,
      eclss_water_loop_closure_percent: 85,
      eclss_hardware_service_duration_days: 380,
      diagnostics_and_maintainability_mass_percent: 10
    },
    aeroshell_geometry_and_aerothermodynamics: {
      configuration: "Ellipsled (right circular cylinder with hemispherical nose and flat base)",
      length_to_diameter_ratio: 3,
      robotic_diameter_m: 4.7,
      crewed_diameter_m: 10.0,
      database_freestream_mach_min: 1.5,
      database_freestream_mach_max: 50.0,
      database_freestream_dynamic_pressure_min_bar: 1e-8,
      database_freestream_dynamic_pressure_max_bar: 0.06,
      database_total_angle_of_attack_min_deg: 0,
      database_total_angle_of_attack_max_deg: 90,
      tps_minimum_manufacturable_thickness_mm: 5.0,
      tps_mass_margin_percent: 25
    }
  }
} as const;