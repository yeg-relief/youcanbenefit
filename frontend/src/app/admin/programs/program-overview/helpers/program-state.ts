import { ApplicationFacingProgram } from '../../../models/program';
import { FilterMessage } from './index';
import { Observable } from 'rxjs/Observable';


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


export function updateState(input$: Observable<FilterMessage | ApplicationFacingProgram[] | ApplicationFacingProgram>)
  : Observable<ProgramState> {
  
  const INITIAL_STATE =
  new ProgramState(
    [],
    new FilterMessage({ type: '', value: 'none' }),
  );
  
  return input$.scan((state: ProgramState, update: FilterMessage | ApplicationFacingProgram[] | ApplicationFacingProgram) => {
    if (update instanceof FilterMessage) {
      state.filter = update;
      return state;
    } else if (Array.isArray(update)) {
      state.programs = [...update].filter(program => program.guid !== undefined && program.guid !== null).sort(programComparator);
      return state;
    } else if (typeof update === 'object' && update.guid !== undefined) {
      const index = state.programs.findIndex(p => p.guid === update.guid)

      if (index >= 0) {
        state.programs[index] = update;
      }
      return state;
    }

    return INITIAL_STATE;
  }, INITIAL_STATE)
}


function programComparator(a: ApplicationFacingProgram, b: ApplicationFacingProgram): number {
  const titleA = a.user.title.toUpperCase();
  const titleB = b.user.title.toUpperCase();

  if (titleA < titleB) return -1;

  if (titleB < titleA) return 1;

  return 0;
}