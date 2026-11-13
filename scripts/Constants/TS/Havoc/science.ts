export const science = {
  science_payloads_and_investigations: {
    vexag_science_investigations_satisfaction_percentage: {
      orbital: 35,
      high_level_aerial_greater_than_60km: 55,
      mid_level_aerial_45_to_60km: 62,
      low_level_aerial_15_to_45km: 56,
      near_surface_aerial_0_to_15km: 51,
      single_entry_probe: 46,
      multiple_entry_probe: 54,
      single_short_lived_lander: 60,
      multiple_short_lived_lander: 78,
      single_long_lived_lander: 72,
      multiple_long_lived_lander: 84,
      surface_system_with_mobility: 74
    },
    robotic_balloon_instruments: {
      gas_chromatograph_mass_spectrometer: {
        mass_kg: 11.0,
        power_W: 40.0,
        mass_resolution_AMU: 0.1,
        mass_range_min_AMU: 1,
        mass_range_max_AMU: 150
      },
      meteorology_suite_thermocouple_anemometer_barometer_accelerometer: {
        mass_kg: 2.0,
        power_W: 3.2,
        anemometer_range_min_m_per_s: 1,
        anemometer_range_max_m_per_s: 100,
        anemometer_accuracy_low_speed_cm_per_s: 10,
        anemometer_accuracy_high_speed_cm_per_s: 100,
        wind_direction_accuracy_deg: 20
      },
      radio_tracking: {
        mass_kg: 0.0,
        power_W: 0.0
      },
      net_flux_radiometer: {
        mass_kg: 2.3,
        power_W: 4.6,
        look_angles_count: 11,
        measurement_interval_minutes: 30,
        channel_1_wavelength_min_um: 0.2,
        channel_1_wavelength_max_um: 3.0,
        channel_2_wavelength_min_um: 0.8,
        channel_2_wavelength_max_um: 25.0
      },
      magnetometer: {
        mass_kg: 1.0,
        power_W: 2.0
      },
      nephelometer: {
        mass_kg: 0.5,
        power_W: 1.2
      },
      lightning_detector: {
        mass_kg: 0.5,
        power_W: 0.5
      },
      total_suite_mass_kg: 17.3,
      total_suite_power_W: 51.5
    }
  }
} as const;