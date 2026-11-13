import { metadata } from './metadata.ts';
import { missions } from './missions.ts';
import { environments } from './environments.ts';
import { trajectories } from './trajectories.ts';
import { spacecraft } from './spacecraft.ts';
import { science } from './science.ts';
import { materials } from './materials.ts';

export const Havoc = {
  ...metadata,
  ...missions,
  ...environments,
  ...trajectories,
  ...spacecraft,
  ...science,
  ...materials
} as const;

export default Havoc;