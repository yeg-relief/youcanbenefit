import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/shareReplay';
import { ApplicationFacingProgram } from '../../models/program';
import { Animations } from '../../../shared/animations';
import { FilterService } from './services';
import  * as helpers from './helpers';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ProgramModelService } from '../services/program-model.service';
import { MdSnackBar } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { DetailModalComponent } from '../../../shared/components/program/detail-modal/detail-modal.component';



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
    programs: Observable<ApplicationFacingProgram[]>;
    programUpdate$ = new EventEmitter<ApplicationFacingProgram>();
    currentPage = 0;

    constructor(
        private filterService: FilterService,
        public dialog: MdDialog,
        public snackBar: MdSnackBar,
        private model: ProgramModelService) { }

    ngOnInit() {

        this.programs = Observable.merge(
            this.model.getPrograms(),
            this.filterService.form.valueChanges.distinctUntilChanged().map(update => new helpers.FilterMessage(update)),
            this.programUpdate$
        )
            .let(helpers.updateState)
            .let(helpers.applyFilter)
            .map(state => state.programs)
            .shareReplay();
    }

    handleDetailInspection(guid: string) {
        this.programs.take(1).toPromise()
            .then( programs => programs.find(p => p.guid === guid) )
            .then( programToInpect => {
                this.dialog.open(DetailModalComponent, {
                    data: {
                        title: programToInpect.user.title,
                        details: programToInpect.user.details,
                        detailLinks: programToInpect.user.detailLinks || []
                    },
                    width: '75vw',
                    height: '75vh'
                })
            });
    }

    handleUpdate($event) {
        this.programUpdate$.emit($event);
    }

    handleDelete(guid: string) {
        this._delete(guid).then();
    }

    private async _delete(guid: string) {
        let dialogref = this.dialog.open(DeleteProgramDialog);
        const confirmation = await dialogref.afterClosed().toPromise();
        if (confirmation) {
            const success = this.model.deleteProgram(guid).toPromise();
            if (success) {
                this.snackBar.open('program deleted successfully', '', {
                    duration: 2000
                })
            } else {
                this.snackBar.open('error deleting program', '', {
                    duration: 2000
                })
            }
        }
    }
}

@Component({
    selector: 'app-delete-program-dialog',
    template: `
    <h2 md-dialog-title>Delete Program</h2>
    <md-dialog-content>
      Are you sure that you would like to delete this program?
    </md-dialog-content>
    <md-dialog-actions>
      <button md-button [md-dialog-close]="false">No</button>
      <!-- Can optionally provide a result for the closing dialog. -->
      <button md-button [md-dialog-close]="true">Yes</button>
    </md-dialog-actions>
  `,
})
export class DeleteProgramDialog {
    constructor(public dialogRef: MdDialogRef<DeleteProgramDialog>) {}
}

@Component({
    selector: 'app-description-program-dialog',
    template: `      
    <!DOCTYPE html>
    <main class="wrapper">
      <h2 md-dialog-title> {{ data.title }} </h2>
      <md-dialog-content>
        <textarea disabled>
          {{ data.details }}
        </textarea>
        <section class="detail-links" *ngIf="data.detailLinks.length > 0">
          <h3> Additional Links</h3>
          <ul>
              <li *ngFor="let link of data.detailLinks">
                  <a [href]=link target="_blank">{{link}}</a>
              </li>
          </ul>
        </section>
      </md-dialog-content>
      <md-dialog-actions>
        <button md-button md-dialog-close>Close</button>
      </md-dialog-actions>
    </main>
  `,
    styles: [
        `
      .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      h2[md-dialog-title] {
        font-weight: bolder;
        padding-left: 2em;
        margin-top: 2em;
        background-color: lightgrey;
        font-size: x-large;
        border: dashed 2px darkorange;
      }

      md-dialog-content {
        margin: 0em 2em;
        min-height: 50%;
        border-radius: 5px;
      }

      textarea {
        height: 223px;
        width: 426px;
        font-size: large;
        resize: none;
        overflow: auto;
      }

      button[md-dialog-close] {
        background-color: darkorange;
      }


      ul {

          width: 100%;
          display: flex;
          flex-wrap: wrap;
      }

      li {
          margin-right: 2rem;
      }

        `
    ]
})
export class DescriptionProgramDialog {
    constructor(@Inject(MD_DIALOG_DATA) public data: any) {}
}

