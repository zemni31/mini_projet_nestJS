import { v4 as uuidv4 } from 'uuid';
import { UUID_PROVIDER } from './common.constants';

export const uuidProvider = {
  provide: UUID_PROVIDER,
  useValue: uuidv4,
};