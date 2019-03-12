import { ApplicationFacingProgram } from '../../../models/program';
import { FilterMessage } from './filter-message';

export class ProgramState {
  filter: FilterMessage;
  programs: ApplicationFacingProgram[];
  updateMeta;

  constructor(
    programs: ApplicationFacingProgram[],
    filter: FilterMessage) {
    this.programs = [...programs];
    this.filter = (<any>Object).assign({}, filter);
  }
}