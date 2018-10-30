import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProgramQueryClass } from '../../services/program-query.class';
import { QueryService } from '../../services/query.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/throw';
import { MdSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-query-edit-v3',
    templateUrl: './query-edit-v3.component.html',
    styleUrls: ['./query-edit-v3.component.css']
})
export class QueryEditV3Component implements OnInit, OnDestroy {
    @Input() programQuery: ProgramQueryClass;
    private _subscription: Subscription;
    constructor(private service: QueryService, public snackBar: MdSnackBar) { }

    ngOnInit() {
        this.programQuery.conditions.sort( (a, b) => a.data.key.name.localeCompare(b.data.key.name));

        this._subscription = this.service.broadcast.asObservable()
            .filter(event => event.type === this.service.update && event.id === this.programQuery.data.id)
            .subscribe(event => {
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
                .take(1)
                .subscribe(
                    val => {
                        if(val.created === true || val.result === 'updated') {
                            this.snackBar.open('query saved.', '', {
                                duration: 2000
                            })
                        }else{
                            this.snackBar.open('error: query not saved.', '', {
                                duration: 2000
                            })
                        }
                    });
        } catch (err) {
            this.snackBar.open(err.message, '', {
                duration: 2000
            })
        }
    }

    handleRemove(condition) {
        this.programQuery.removeCondition(condition);
    }
}
