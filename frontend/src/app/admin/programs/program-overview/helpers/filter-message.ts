import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { ProgramState } from './program-state';

export class FilterMessage {
  type: '' | 'tag' | 'title' | 'none' = '';
  value: string = '';

  constructor(update) {
    this.type = update.type;
    this.value = update.value;
  }
}

export function applyFilter(source: Observable<ProgramState>): Observable<ProgramState> {
  return source
    .switchMap((state: ProgramState) => {
      if (state.filter === undefined || state.filter.type === undefined || state.filter.value === undefined) {
        return Observable.of(new ProgramState(state.programs, state.filter))
      }
      const programs = state.programs;

      switch (state.filter.type) {
        case '': {
          return Observable.of(new ProgramState(state.programs, state.filter));
        }

        case 'tag': {
          const filterTag = state.filter.value;

          return Observable.from(programs)
            .filter(program => program.user.tags.find(tag => tag === filterTag) !== undefined)
            .toArray()
            .map(programs => new ProgramState(programs, state.filter))
        }

        case 'title': {
          if (state.filter.value === '') {
            return Observable.of(new ProgramState([], state.filter));
          }


          const regexp = new RegExp(state.filter.value.toLowerCase().trim());

          return Observable.from(programs)
            .filter(program => regexp.test(program.user.title.toLowerCase().trim()))
            .toArray()
            .map(programs => new ProgramState(programs, state.filter))
        }

        case 'none': {
          return Observable.of(new ProgramState(programs, state.filter));
        }

        default: {
          return Observable.of(new ProgramState(programs, state.filter));
        }
      }
    })
}