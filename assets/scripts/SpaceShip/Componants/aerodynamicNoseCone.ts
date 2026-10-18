export const aerodynamicNoseCone = {
  ellipsled_robotic_precursor: {
    geometry_configuration: "Ellipsled: right circular cylinder with hemispherical nose cap and flat base",
    length_to_diameter_ratio: 3.0,
    diameter_m: 4.7,
    aeroheating_flow_assumption: "Fully turbulent flow and fully catalytic wall",
    mach_calibration_point: 24,
    database_freestream_mach_min: 1.5,
    database_freestream_mach_max: 50.0,
    database_dynamic_pressure_min_bar: 1e-8,
    database_dynamic_pressure_max_bar: 0.06,
    database_total_angle_of_attack_min_deg: 0,
    database_total_angle_of_attack_max_deg: 90
  },
  ellipsled_crewed_entry: {
    geometry_configuration: "Ellipsled: right circular cylinder with hemispherical nose cap and flat base",
    length_to_diameter_ratio: 3.0,
    diameter_m: 10.0,
    aeroheating_flow_assumption: "Fully turbulent flow and fully catalytic wall",
    mach_calibration_point: 24,
    database_freestream_mach_min: 1.5,
    database_freestream_mach_max: 50.0,
    database_dynamic_pressure_min_bar: 1e-8,
    database_dynamic_pressure_max_bar: 0.06,
    database_total_angle_of_attack_min_deg: 0,
    database_total_angle_of_attack_max_deg: 90
  }
} as const;

export default aerodynamicNoseCone;