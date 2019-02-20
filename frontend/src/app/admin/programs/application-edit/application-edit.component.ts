import { Component, OnInit } from '@angular/core';
import { ProgramModelService } from '../services/program-model.service'
import { QueryService } from '../services/query.service'
import { Program } from '../services/program.class';
import { ProgramQueryClass } from '../services/program-query.class';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'
import { ApplicationFacingProgram } from '../../models';
import { Observable, ReplaySubject, Subject, merge, combineLatest, of } from 'rxjs';
import { filter, tap, multicast, refCount, pluck, take, catchError } from 'rxjs/operators'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'app-application-edit',
  templateUrl: './application-edit.component.html',
  styleUrls: ['./application-edit.component.css']
})
export class ApplicationEditComponent implements OnInit {
  program: Observable<Program>;
  data: ApplicationFacingProgram;
  form: Observable<FormGroup>;
  selected: ProgramQueryClass;
  update = new Subject<Program>();

  constructor(
    private modelService: ProgramModelService,
    private queryService: QueryService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.program = merge(
      this.modelService.findProgram(this.route.snapshot.params['guid']),
      this.update.asObservable().pipe(filter(Boolean))
    ).pipe(
        tap( ({data}) => this.data = data),
        multicast(new ReplaySubject<Program>(1)),
        refCount()
    );



    this.form = this.program.pipe(
      pluck('form'),
      multicast(new ReplaySubject<FormGroup>(1)),
      refCount()
    );
  }

  selectQuery(query: ProgramQueryClass) {
    this.selected = query;
  }

  handleDelete(query_id: string){
    combineLatest(
      this.program.take(1),
      this.queryService.deleteQuery(query_id).pipe(take(1), catchError(of)),
    ).subscribe(
      ([program, wasDeleted ]) => {

        const index = program.application.findIndex(q => q.data.id === query_id);
        if (wasDeleted && index >= 0) {
          program.application.splice(index, 1);
          
          this.snackBar.open('query deleted','', {
            duration: 2000
          })
        }
        else {
            this.snackBar.open('unable to delete query','',{
                duration: 2000
            })
        }
      },
      console.error
    );
  }

  handleCopy(query_id: string) {
    this.program.pipe(take(1))
      .subscribe( program => {
        const query = this.modelService.getBlankQuery(program.data.guid);
        const conditions = program.application.find(q => q.data.id === query_id).conditions;
        query.conditions = conditions.map(c => c.data);
        program._addQuery(query);
        this.selected = program.application.find(qc => qc.data.id === query.id);
      })
  }

  newQuery(){
    this.program.pipe(take(1))
        .subscribe( program => {
          const query = this.modelService.getBlankQuery(program.data.guid);
          program._addQuery(query);
          this.selected = program.application.find(qc => qc.data.id === query.id);
        })
  }
}
