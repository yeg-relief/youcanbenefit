import { Component, OnInit } from '@angular/core';
import { ProgramModelService } from '../services/program-model.service'
import { QueryService } from '../services/query.service'
import { Program } from '../services/program.class';
import { ProgramQueryClass } from '../services/program-query.class';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'
import { ApplicationFacingProgram } from '../../models/program';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { MdSnackBar } from '@angular/material';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/merge';

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
    public snackBar: MdSnackBar
  ) {}

  ngOnInit() {
    this.program = this.modelService
      .findProgram(this.route.snapshot.params['guid'])
      .merge(this.update.asObservable().filter(u => u !== undefined))
      .do( p => this.data = p.data)
      .multicast(new ReplaySubject<Program>(1)).refCount();

    this.form = this.program.map(p => p.form).multicast(new ReplaySubject<FormGroup>(1)).refCount();

  }

  selectQuery(query: ProgramQueryClass) {
    this.selected = query;
  }

  handleDelete(query_id: string){
    Observable.combineLatest(
      this.program.take(1),
      this.queryService.deleteQuery(query_id).take(1).catch( err => Observable.of(err)),
    ).subscribe(
      ([program, wasDeleted ]) => {

        const index = program.application.findIndex(q => q.data.id === query_id);
        if (wasDeleted && index >= 0) {
          program.application.splice(index, 1);
          
          this.snackBar.open('query deleted','',{
            duration: 2000
          })
        }
        else {
            this.snackBar.open('unable to delete query','',{
                duration: 2000
            })
        }
      },
      err => console.error(err)
    );
  }

  newQuery(){
    this.program.take(1)
        .subscribe( program => {
          const query = this.modelService.getBlankQuery(program.data.guid);
          program._addQuery(query)
          this.selected = program.application.find(qc => qc.data.id === query.id);
        })
  }
}
