export const fairing = {
  robotic_entry_aeroshell: {
    function: "Protective rigid aerodynamic shell enclosing folded airship, solar arrays, and payload",
    structural_core_type: "Aluminum honeycomb",
    core_thickness_cm: 5.08,
    core_density_kg_per_m3: 70.0,
    facesheets_material: "Graphite / BMI",
    facesheet_thickness_cm: 0.1,
    jettison_event_time_s: 488,
    jettison_altitude_km: 76.2,
    jettison_velocity_m_per_s: 96
  },
  crewed_entry_aeroshell: {
    function: "Protective rigid aerodynamic shell enclosing human airship and atmospheric habitat",
    structural_core_type: "Aluminum honeycomb",
    core_thickness_cm: 5.08,
    core_density_kg_per_m3: 70.0,
    facesheets_material: "Graphite / BMI",
    facesheet_thickness_cm: 0.1,
    jettison_event_time_s: 586,
    jettison_altitude_km: 64.1,
    jettison_velocity_m_per_s: 99
  }
} as const;

export default fairing;