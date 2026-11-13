export const missions = {
  program_evolution_phases: [
    { phase_number: 1, title: "Robotic Exploration", architecture: "Robotic airship deployed into atmosphere" },
    { phase_number: 2, title: "Crew to Orbit", stay_time_days: 30, architecture: "Crew orbital operations at Venus" },
    { phase_number: 3, title: "Crew to Atmosphere", stay_time_days: 30, architecture: "Human airship habitat operations in atmosphere" },
    { phase_number: 4, title: "Crew to Atmosphere", stay_time_years: 1, architecture: "Long-duration human atmospheric operations" },
    { phase_number: 5, title: "Permanent Human Presence", architecture: "Multi-airship permanent atmospheric human settlement" }
  ],
  historical_missions_by_decade: {
    "1960s": [
      { name: "Mariner", type: "Orbit/Flyby", country: "United States" },
      { name: "Venera", type: "Orbit/Flyby, Atmosphere, Surface", country: "Soviet Union" }
    ],
    "1970s": [
      { name: "Pioneer", type: "Orbit/Flyby, Atmosphere", country: "United States" },
      { name: "Venera", type: "Orbit/Flyby, Atmosphere, Surface", country: "Soviet Union" }
    ],
    "1980s": [
      { name: "Vega", type: "Orbit/Flyby, Atmosphere, Surface", country: "Soviet Union" },
      { name: "Galileo", type: "Orbit/Flyby", country: "United States" }
    ],
    "1990s": [
      { name: "Magellan", type: "Orbit/Flyby", country: "United States" },
      { name: "Cassini", type: "Orbit/Flyby", country: "United States" }
    ],
    "2000s": [
      { name: "Messenger", type: "Orbit/Flyby", country: "United States" },
      { name: "Venus Express", type: "Orbit/Flyby", country: "Europe/International" }
    ]
  }
} as const;