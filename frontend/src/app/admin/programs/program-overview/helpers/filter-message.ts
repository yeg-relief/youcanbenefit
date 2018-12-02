import { Observable, from, of } from 'rxjs'
import { ProgramState } from './program-state';
import { switchMap, filter, toArray, map } from 'rxjs/operators'

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
    .pipe(
      switchMap((state: ProgramState) => {
        if (state.filter === undefined || state.filter.type === undefined || state.filter.value === undefined) {
          return of(new ProgramState(state.programs, state.filter))
        }
        const programs = state.programs;
  
        switch (state.filter.type) {
          case '': {
            return of(new ProgramState(state.programs, state.filter));
          }
  
          case 'tag': {
            const filterTag = state.filter.value;
  
            return from(programs)
              .pipe(
                filter(program => program.user.tags.find(tag => tag === filterTag) !== undefined),
                toArray(),
                map(programs => new ProgramState(programs, state.filter))
              )
              
          }
  
          case 'title': {
            if (state.filter.value === '') {
              return of(new ProgramState([], state.filter));
            }
  
  
            const regexp = new RegExp(state.filter.value.toLowerCase().trim());
  
            return from(programs)
              .pipe(
                filter(program => regexp.test(program.user.title.toLowerCase().trim())),
                toArray(),
                map(programs => new ProgramState(programs, state.filter))
              )
              
          }
  
          case 'none': {
            return of(new ProgramState(programs, state.filter));
          }
  
          default: {
            return of(new ProgramState(programs, state.filter));
          }
        }
      })
    )
}