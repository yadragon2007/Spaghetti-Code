import { environments } from '../Havoc/environments';

export const Venus = {
  bulk_parameters: {
    mass_10_24_kg: 4.8673,
    volume_10_10_km3: 92.843,
    equatorial_radius_km: 6051.8,
    polar_radius_km: 6051.8,
    volumetric_mean_radius_km: 6051.8,
    core_radius_km: 3200,
    ellipticity_flattening: 0.0000,
    mean_density_kg_per_m3: 5243,
    surface_gravity_mean_m_per_s2: environments.planetary_environments.venus.surface.gravity_m_per_s2,
    surface_acceleration_eq_m_per_s2: environments.planetary_environments.venus.surface.gravity_m_per_s2,
    escape_velocity_km_per_s: 10.36,
    gm_x_10_6_km3_per_s2: 0.3249,
    bond_albedo: 0.770,
    visual_geometric_albedo: 0.689,
    visual_magnitude_v_1_0: -4.38,
    solar_irradiance_W_per_m2: 2601.3,
    black_body_temperature_K: 226.6,
    topographic_range_km: 13.0,
    moment_of_inertia_i_mr2: 0.33
  },
  orbital_parameters: {
    semimajor_axis_10_6_km: 108.210,
    sidereal_orbit_period_days: 224.701,
    tropical_orbit_period_days: 224.695,
    perihelion_10_6_km: 107.480,
    aphelion_10_6_km: 108.940,
    synodic_period_days: 583.92,
    mean_orbital_velocity_km_per_s: 35.02,
    max_orbital_velocity_km_per_s: 35.26,
    min_orbital_velocity_km_per_s: 34.79,
    orbit_inclination_deg: 3.39,
    orbit_eccentricity: 0.0067,
    sidereal_rotation_period_hrs: -5832.5,
    length_of_day_hrs: 2802.0,
    obliquity_to_orbit_deg: 177.36,
    inclination_of_equator_deg: 177.36
  },
  mean_orbital_elements_j2000: {
    semimajor_axis_AU: 0.72333199,
    orbital_eccentricity: 0.00677323,
    orbital_inclination_deg: 3.39471,
    longitude_of_ascending_node_deg: 76.68069,
    longitude_of_perihelion_deg: 131.53298,
    mean_longitude_deg: 181.97973
  },
  north_pole_of_rotation: {
    right_ascension: "272.76",
    declination: "67.16",
    reference_date: "12:00 UT 1 Jan 2000 (JD 2451545.0)"
  },
  venusian_magnetosphere: {
    magnetic_field_strength: "Essentially zero",
    dipole_field_strength_Gauss_Re3: 0.00001,
    description: "No intrinsic magnetic field. Induced magnetic field created by interaction of solar wind with the ionosphere."
  },
  // Surface parameters overridden by HAVOC models
  venusian_surface_atmosphere: {
    surface_pressure_kPa: environments.planetary_environments.venus.surface.pressure_kPa,
    surface_density_kg_per_m3: environments.planetary_environments.venus.surface.density_kg_per_m3,
    surface_temperature_C: environments.planetary_environments.venus.surface.temperature_degC,
    solar_power_W_per_m2: environments.planetary_environments.venus.surface.solar_power_W_per_m2,
    radiation_shielding_min_g_per_cm2: environments.planetary_environments.venus.surface.radiation_shielding_min_g_per_cm2,
    scale_height_km: 15.9,
    total_mass_of_atmosphere_kg: "4.8 x 10^20",
    wind_speeds_min_m_per_s: 0.3,
    wind_speeds_max_m_per_s: 1.0,
    mean_molecular_weight: 43.45,
    composition_percentage: {
      carbon_dioxide_percent: 96.5,
      nitrogen_percent: 3.5
    },
    composition_ppm: {
      sulfur_dioxide_ppm: 150,
      argon_ppm: 70,
      water_ppm: 20,
      carbon_monoxide_ppm: 17,
      helium_ppm: 12,
      neon_ppm: 7
    }
  },
  // Injected HAVOC operational layer profile
  atmosphere_at_50_km: environments.planetary_environments.venus.atmosphere_at_50_km
} as const;

export default Venus;