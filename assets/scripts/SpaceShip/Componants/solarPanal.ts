export const solarPanal = {
  robotic_airship_array: {
    placement: "Top-mounted on the upper hull of the airship",
    active_area_m2: 50.4,
    power_output_operations_kWe: 9.1,
    power_output_regeneration_kWe: 2.5,
    total_power_output_kWe: 11.6,
    solar_irradiance_at_50km_W_per_m2: 1418
  },
  human_airship_array: {
    placement: "Top-mounted on the upper hull of the airship",
    active_area_m2: 1044.0,
    power_output_operations_kWe: 187.0,
    power_output_regeneration_kWe: 53.0,
    total_power_output_kWe: 240.0,
    solar_irradiance_at_50km_W_per_m2: 1418
  },
  transit_habitat_arrays: {
    cell_architecture: "3-Junction Gallium Arsenide (GaAs)",
    sizing_reference: "Sized for Earth-to-Venus transit orbital solar flux",
    power_delivered_kWe: 12.0
  },
  protective_transparent_encapsulants: {
    fep_teflon: {
      transmittance_300_to_1000nm_unexposed_percent: 91.5,
      transmittance_300_to_1000nm_30day_85pct_acid_percent: 93.2,
      thermal_tolerance_degC: 80
    },
    polypropylene: {
      transmittance_300_to_1000nm_unexposed_percent: 90.7,
      transmittance_300_to_1000nm_30day_85pct_acid_percent: 91.1,
      thermal_degradation_limit_degC: 50
    }
  }
} as const;

export default solarPanal;