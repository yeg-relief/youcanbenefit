import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProgramQueryClass } from '../../services/program-query.class';
import { QueryService } from '../../services/query.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { filter, take } from 'rxjs/operators'

@Component({
    selector: 'app-query-edit-v3',
    templateUrl: './query-edit-v3.component.html',
    styleUrls: ['./query-edit-v3.component.css']
})
export class QueryEditV3Component implements OnInit, OnDestroy {
    @Input() programQuery: ProgramQueryClass;
    private _subscription: Subscription;
    constructor(private service: QueryService, public snackBar: MatSnackBar) { }

    ngOnInit() {
        this.programQuery.conditions.sort( (a, b) => a.data.question.text.localeCompare(b.data.question.text));

        this._subscription = this.service.broadcast.asObservable()
            .pipe(filter(event => event.type === this.service.update && event.id === this.programQuery.data.id))
            .subscribe(() => {
                this.programQuery.form.markAsDirty();
                this.programQuery.commit();
            })
    }

    ngOnDestroy(){
        if (this._subscription !== undefined && !this._subscription.closed) this._subscription.unsubscribe();
    }

    newCondition() {
        this.programQuery.addCondition();
    }

    saveQuery() {
        try {
            this.service.createOrUpdate(this.programQuery, this.programQuery.data.guid)
                .pipe(take(1))
                .subscribe(
                    val => {
                        if(val.result === 'created' || val.result === 'updated') {
                            this.snackBar.open('query saved.', '', { duration: 2000 })
                        }else{
                            this.snackBar.open('error: query not saved.', '', { duration: 2000 })
                        }
                    });
        } catch (err) {
            this.snackBar.open(err.message, '', { duration: 2000 })
        }
    }

    handleRemove(condition) {
        this.programQuery.removeCondition(condition);
    }
}
