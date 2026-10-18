import { metadata } from './metadata';
import { missions } from './missions';
import { environments } from './environments';
import { trajectories } from './trajectories';
import { spacecraft } from './spacecraft';
import { science } from './science';
import { materials } from './materials';

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