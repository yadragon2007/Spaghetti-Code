import { environments } from '../Havoc/environments';

export const Earth = {
  bulk_parameters: {
    mass_10_24_kg: 5.9722,
    volume_10_10_km3: 108.321,
    equatorial_radius_km: 6378.137,
    polar_radius_km: 6356.752,
    volumetric_mean_radius_km: 6371.000,
    core_radius_km: 3485,
    ellipticity_flattening: 0.003353,
    mean_density_kg_per_m3: 5513,
    // Overridden by HAVOC finding (9.81 m/s² vs NSSDC 9.82 m/s²)
    surface_gravity_mean_m_per_s2: environments.planetary_environments.earth.surface.gravity_m_per_s2,
    surface_acceleration_eq_m_per_s2: 9.780,
    escape_velocity_km_per_s: 11.186,
    gm_x_10_6_km3_per_s2: 0.3986,
    bond_albedo: 0.385
  },
  orbital_parameters: {
    semimajor_axis_10_6_km: 149.598,
    sidereal_orbit_period_days: 365.256,
    tropical_orbit_period_days: 365.242,
    perihelion_10_6_km: 147.095,
    aphelion_10_6_km: 152.100,
    mean_orbital_velocity_km_per_s: 29.78,
    max_orbital_velocity_km_per_s: 30.29,
    min_orbital_velocity_km_per_s: 29.29,
    orbit_inclination_deg: 0.000,
    orbit_eccentricity: 0.0167,
    sidereal_rotation_period_hrs: 23.9345,
    length_of_day_hrs: 24.0000,
    obliquity_to_orbit_deg: 23.44,
    inclination_of_equator_deg: 23.44
  },
  mean_orbital_elements_j2000: {
    semimajor_axis_AU: 1.00000011,
    orbital_eccentricity: 0.01671022,
    orbital_inclination_deg: 0.00005,
    longitude_of_ascending_node_deg: -11.26064,
    longitude_of_perihelion_deg: 102.94719,
    mean_longitude_deg: 100.46435
  },
  north_pole_of_rotation: {
    right_ascension: "0.00 - 0.641T",
    declination: "90.00 - 0.557T",
    reference_date: "12:00 UT 1 Jan 2000 (JD 2451545.0)",
    t_definition: "Julian centuries from reference date"
  },
  terrestrial_magnetosphere: {
    model: "GSFC-1283",
    dipole_field_strength_Gauss_Re3: 0.306,
    dipole_offset_Re: 0.076,
    surface_field_strength_Gauss: "0.24 - 0.66",
    geomagnetic_poles_model: "WMM2020",
    geocentric_dipole: "80.65 N, 72.68 W",
    magnetic_north_pole: "86.50 N, 164.04 E"
  },
  terrestrial_atmosphere: {
    // Overridden/unified with HAVOC surface metrics
    surface_pressure_kPa: environments.planetary_environments.earth.surface.pressure_kPa,
    surface_density_kg_per_m3: environments.planetary_environments.earth.surface.density_kg_per_m3,
    solar_power_W_per_m2: environments.planetary_environments.earth.surface.solar_power_W_per_m2,
    radiation_shielding_g_per_cm2: environments.planetary_environments.earth.surface.radiation_shielding_g_per_cm2,
    scale_height_km: 8.5,
    total_mass_of_atmosphere_kg: "5.1 x 10^18",
    total_mass_of_hydrosphere_kg: "1.4 x 10^21",
    average_temperature_C: environments.planetary_environments.earth.surface.temperature_degC,
    average_temperature_K: 288,
    diurnal_temperature_range_min_C: 10,
    diurnal_temperature_range_max_C: 20,
    wind_speeds_min_m_per_s: 0,
    wind_speeds_max_m_per_s: 100,
    mean_molecular_weight: 28.97
  }
} as const;

export default Earth;