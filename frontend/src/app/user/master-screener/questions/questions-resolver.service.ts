
import {throwError as observableThrowError,  Observable , of} from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router'
import { MasterScreenerService } from '../master-screener.service';

@Injectable()
export class QuestionsResolverService {

  constructor(private backend: MasterScreenerService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.backend.loadQuestions()
      .pipe(
        switchMap( (data: any) => {
          if (data.questions === undefined || data.conditionalQuestions === undefined) {
            return observableThrowError({error: 'malformed data', data})
          }
  
          if (!Array.isArray(data.questions)) {
            return observableThrowError({error: 'questions are not an array', data})
          }
  
          data.questions.sort(QuestionsResolverService.findAndSort);
  
          data.conditionalQuestions.forEach(QuestionsResolverService.findAndSort);
  
  
  
          return of(data);
        }),
        catchError(err => of({error: err}))
      );
  }

  static findAndSort(q) {
    if(Array.isArray(q.options)) {
      q.options.sort(QuestionsResolverService.sortOptions);
    }
  }

  static sortOptions(a, b) {
    return a - b;
  }
}
