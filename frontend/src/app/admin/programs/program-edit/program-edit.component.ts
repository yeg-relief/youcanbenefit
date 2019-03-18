import { Component, OnInit } from '@angular/core';
import { ProgramModelService } from '../services/program-model.service'
import { UserProgram } from '../services/user-program.class';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { Observable, ReplaySubject } from 'rxjs';
import { tap, flatMap, pluck, multicast, refCount, take, map } from 'rxjs/operators'
import { QuillService } from '../../quill/quill.service';
import * as Quill from 'quill';

@Component({
  templateUrl: './program-edit.component.html',
  styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit {
  program: Observable<UserProgram>;
  allTags: string[];
  quillEditor: any;
  quillModules: {};
  quillPlaceholder = 'program details';
  constructor(
    private model: ProgramModelService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private quillService: QuillService
  ) {}

  ngOnInit(){
    const guid = this.route.snapshot.params['guid'];
    
    if (guid) {
      this.program = this.model.findProgram(guid)
        .pipe(
          pluck('user'),
          multicast(new ReplaySubject(1)),
          refCount()
        )
    }

    this.allTags = this.model.getAllTags();
    this.quillModules = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline'],
          [{ 'header': 1}, { 'header': 2}],
          [{ 'list': 'ordered'}, { 'list': 'bullet'}],
          [{ 'indent': '-1'}, { 'indent': '+1' }], 
          [{ 'align': [] }],
          ['link', 'image']
        ],
        handlers: {
          'image': () => { this.quillService.uploadImage(this.quillEditor) }
        }
      }
    }

    let link = Quill.import('formats/link');
    link.sanitize = (url) => {
      const regexp = new RegExp('^(http://|https://)');
      return regexp.test(url) ? url : 'http://' + url;
    };
    Quill.register(link, true);
  }

  editorCreated(editor) {
    this.quillEditor = editor;
  }

  handleQueryClick() {
    this._goToQueries()
  }

  handlSaveClick() {
    let program;
    this.program
      .pipe(
        take(1),
        tap(p => program = p),
        flatMap(p => this.model.saveUserProgram(p._form.value))
      )
      .subscribe(
        () => {
          let guidParam = this.route.snapshot.params['guid'];
          if (guidParam === 'new') {
            this.router.navigateByUrl(`/admin/programs/edit/${program.data.guid}`)
              .then(_ => this.ngOnInit())
          }
          this.display('save success.')
        },
        () => this.display('error saving.')
      )
  }

  handleDeleteClick() {
    const res = window.confirm("Are you sure that you would like to delete this program?")
    
    if (res) {
      this.program.pipe(
        take(1),
        map(p => p.data.guid),
        flatMap(guid => this.model.deleteProgram(guid))
      ).subscribe((deleteResponse) => {
        if (deleteResponse) {
          this.display('delete success.');
          this.router.navigateByUrl('admin/programs/overview');
        } else {
          this.display('delete failure.');
        }
      })
    }
  }

  private _goToQueries(){
    let saveBeforeNavigate = false;
    this.program.pipe(take(1)).subscribe(program => {

      if (program._form.dirty) {
        saveBeforeNavigate = window.confirm("You have unsaved changes. Do you wish to save before leaving the page?")
      }

      if (saveBeforeNavigate) {
        this._saveBeforeNavigate(program)
      } else {
        this.router.navigateByUrl(`admin/programs/application-edit/${program.data.guid}`);
      }

    })
  }

  private async _saveBeforeNavigate(program: UserProgram) {
    this.model.saveUserProgram(program._form.value)
      .subscribe(httpResponse => {
        if (httpResponse) {
          this.display('save success.');
          this.router.navigateByUrl(`admin/programs/application-edit/${program.data.guid}`);
        } else {
          this.display('error saving.')
        }
      })
  }

  private display(text: string) {
    this.snackBar.open(text, '', {
      duration: 2000
    })
  }
}
