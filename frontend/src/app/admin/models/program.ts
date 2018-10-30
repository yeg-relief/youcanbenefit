import { UserFacingProgram } from '../../shared/models';
import { Key } from './key';

export interface ProgramCondition {
  key: Key;
  value: boolean | string | number;
  type: 'boolean' | 'text' | 'number';
  qualifier?: string | 'lessThan' | 'lessThanOrEqual' | 'equal' | 'greaterThanOrEqual' | 'greaterThan';
}

export interface ProgramQuery {
  guid: string;
  id: string;
  conditions: ProgramCondition[];
}

export interface ApplicationFacingProgram {
  guid: string;
  application: ProgramQuery[];
  user: UserFacingProgram;
}
