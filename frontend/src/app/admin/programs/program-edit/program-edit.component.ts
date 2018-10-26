import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgramModelService } from '../services/program-model.service'
import { UserProgram } from '../services/user-program.class';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DeleteProgramDialog } from '../program-overview/program-overview.component';
import 'rxjs/add/operator/multicast';

@Component({
  templateUrl: './program-edit.component.html',
  styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit, OnDestroy {
  program: Observable<UserProgram>;
  constructor(
    private model: ProgramModelService,
    private route: ActivatedRoute,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router
  ) {}

  ngOnInit(){
    const guid = this.route.snapshot.params['guid'];

    if (guid) 
      this.program = this.model
          .findProgram(guid).map(p => p.user)
          .multicast(new ReplaySubject(1)).refCount();
    
  };

  ngOnDestroy(){};


  handleQueryClick() {
    this._goToQueries().then();
  }

  handlSaveClick() {
    let program;
    this.program.take(1)
      .do(p => program = p)
      .flatMap(p => this.model.saveUserProgram(p._form.value))
      .subscribe(
        sucess => {
          let guidParam = this.route.snapshot.params['guid'];
          if (guidParam === 'new') {
            this.router.navigateByUrl(`/admin/programs/edit/${program.data.guid}`)
              .then(_ => this.ngOnInit())
          }
          this.display('save success.')
        },
        err => this.display('error saving.')
      )
  }

  async handleDeleteClick() {
    const program_guid = await this.program.take(1).toPromise().then(p => p.data.guid);
    const dialogRef = this.dialog.open(DeleteProgramDialog);
    const confirmation = await dialogRef.afterClosed().toPromise();

    if (!confirmation) return;

    try {
      const response = await this.model.deleteProgram(program_guid).toPromise();
      this.display('delete success.')
      this.router.navigateByUrl('admin/programs/overview');
    } catch (e) {
      console.error(e);
      this.display('delete failure.')
    }
  }

  private async _goToQueries(){
    const program = await this.program.take(1).toPromise();
    const form = program._form;
    let saveBeforeNavigate = false;
    
    if (program._form.dirty) {
      const dialogRef = this.dialog.open(UnsavedChangesDialog);
      saveBeforeNavigate = await dialogRef.afterClosed().toPromise();
    }

    if (saveBeforeNavigate) {
      const success = await this._saveBeforeNavigate(program);
      
      if (success)
        this.router.navigateByUrl(`admin/programs/application-edit/${program.data.guid}`);

    } else {
      this.router.navigateByUrl(`admin/programs/application-edit/${program.data.guid}`);
    }
  }

  private async _saveBeforeNavigate(program: UserProgram) {
    const httpResponse = await this.model.saveUserProgram(program._form.value).toPromise();
    if (httpResponse) {
      this.display('save success.');
      return Promise.resolve(true);
    }

    this.display('error saving.')
    return Promise.reject(httpResponse);
  }

  private display(text: string) {
    this.snackBar.open(text, '', {
      duration: 2000
    })
  }
}


@Component({
  selector: 'app-unsaved-user-program-dialog',
  template: `
    <h2 md-dialog-title>Unsaved Changes</h2>
    <md-dialog-content>
      You have unsaved changes. Do you wish to save before leaving the page.
    </md-dialog-content>
    <md-dialog-actions>
      <button md-button [md-dialog-close]="false">No</button>
      <!-- Can optionally provide a result for the closing dialog. -->
      <button md-button [md-dialog-close]="true">Yes</button>
    </md-dialog-actions>
  `,
})
export class UnsavedChangesDialog {
  constructor(public dialogRef: MdDialogRef<UnsavedChangesDialog>) {}
}
