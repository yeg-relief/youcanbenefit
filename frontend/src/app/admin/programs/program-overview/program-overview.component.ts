import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { ApplicationFacingProgram } from '../../models/program';
import { Animations } from '../../../shared/animations';
import { FilterService } from './services';
import  * as helpers from './helpers';
import { MatDialog } from '@angular/material';
import { ProgramModelService } from '../services/program-model.service';
import { MatSnackBar } from '@angular/material';
import { DetailModalComponent } from '../../../shared/components/program/detail-modal/detail-modal.component';
import { Observable, merge } from 'rxjs';
import { distinctUntilChanged, map, pluck, shareReplay, take, tap } from 'rxjs/operators'

@Component({
    selector: 'app-program-overview',
    templateUrl: './program-overview.component.html',
    styleUrls: ['./program-overview.component.css'],
    animations: [
        Animations.fadeinAndOut,
        Animations.routeAnimation
    ],
    providers: [ FilterService ]
})
export class ProgramOverviewComponent implements OnInit {
    programs: Observable<any>;
    programUpdate$ = new EventEmitter<ApplicationFacingProgram>();
    currentPage = 0;

    constructor(
        private filterService: FilterService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private model: ProgramModelService) { }

    ngOnInit() {
        console.log("HERE1")
        this.programs = merge(
            this.model.getPrograms(),
            this.filterService.form.valueChanges.pipe(distinctUntilChanged(), map(update => new helpers.FilterMessage(update))),
            this.programUpdate$
        )
        .pipe(
            tap(console.log),
            helpers.updateState,
            helpers.applyFilter,
            pluck('programs'),
            shareReplay()
        )
        console.log("HERE2")
    }

    handleDetailInspection(guid: string) {
        this.programs.pipe( take(1), map(programs => programs.find(p => p.guid === guid)))
        .subscribe(programToInspect => {
            this.dialog.open(DetailModalComponent, {
                data: {
                    title: programToInspect.user.title,
                    details: programToInspect.user.details,
                    detailLinks: programToInspect.user.detailLinks || []
                },
                width: '75vw',
                height: '75vh'
            })
        })
    }

    handleUpdate($event) {
        this.programUpdate$.emit($event);
    }

    handleDelete(guid: string) {
        this._delete(guid);
    }

    private _delete(guid: string) {
        const shouldDelete = window.confirm("Are you sure that you would like to delete this program?")

        if (shouldDelete) {
            this.model.deleteProgram(guid).pipe(take(1))
            .subscribe(success => {
                if (success) {
                    this.snackBar.open('program deleted successfully', '', { duration: 2000 })
                } else {
                    this.snackBar.open('error deleting program', '', { duration: 2000 })
                }
            })
        }
    }
}