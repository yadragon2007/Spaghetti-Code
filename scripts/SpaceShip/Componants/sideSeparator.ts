export const sideSeparator = {
  airship_gondola_release_mechanism: {
    interface_type: "Structural baseplate retention and launch release bolts",
    separated_element: "Venus Ascent Vehicle (VAV)",
    separation_environment:
      "Mid-air atmospheric drop at 50 km altitude during floating operations",
  },
  aeroshell_clamshell_separation: {
    mechanism_type: "Linear pyrotechnic charge / mechanical pushers",
    separated_element: "Forebody/aftbody fairing halves",
    functional_objective:
      "Unfurl and permit gas bag inflation clear of aerodynamic interference",
    initiation_velocity_m_per_s: 100,
  },
} as const;

export default sideSeparator;
