export const environments = {
  planetary_environments: {
    earth: {
      surface: {
        temperature_degC: 15,
        solar_power_W_per_m2: 1060,
        radiation_shielding_g_per_cm2: 1020,
        pressure_kPa: 101.3,
        density_kg_per_m3: 1.240,
        gravity_m_per_s2: 9.81
      }
    },
    venus: {
      surface: {
        temperature_degC: 462,
        solar_power_W_per_m2: 661,
        radiation_shielding_min_g_per_cm2: 8280,
        pressure_kPa: 9330,
        density_kg_per_m3: 64.79,
        gravity_m_per_s2: 8.87
      },
      atmosphere_at_50_km: {
        temperature_degC: 75,
        pressure_atm: 1.05,
        pressure_kPa: 106.6,
        density_kg_per_m3: 1.594,
        gravity_m_per_s2: 8.73,
        solar_power_W_per_m2: 1418,
        solar_power_kW_per_m2: 1.42,
        radiation_shielding_g_per_cm2: 1290,
        radiation_shielding_kg_per_cm2: 1.29,
        composition_CO2_percent: 96,
        composition_N2_percent: 3,
        atmosphere_molecular_weight_g_per_mole: 43.58,
        longitudinal_winds_equator_min_m_per_s: 85,
        longitudinal_winds_equator_max_m_per_s: 100,
        time_to_circle_planet_hours: 110,
        northward_winds_max_m_per_s: 5,
        shortest_day_hours: 44,
        longest_night_hours: 66
      }
    },
    mars: {
      surface: {
        temperature_degC: -63,
        solar_power_W_per_m2: 590,
        radiation_shielding_g_per_cm2: 16,
        pressure_kPa: 0.64,
        density_kg_per_m3: 0.016,
        gravity_m_per_s2: 3.71
      }
    }
  }
} as const;