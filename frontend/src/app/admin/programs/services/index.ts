import { ProgramQueryClass } from './program-query.class';
import { FormGroup } from '@angular/forms';

export interface QueryEvent{
  id: string;
  type: Symbol;
  data: ProgramQueryClass;
}