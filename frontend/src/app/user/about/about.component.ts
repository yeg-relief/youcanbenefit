import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { AuthService } from 'src/app/admin/core/services/auth.service';
import { Page, Document } from '../../shared/models';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators'
import { QuillService } from '../../admin/quill/quill.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  quillEditor: any;
  quillModules = {};
  showEditButton = false;
  editMode = false;
  
  page: Page = {
    title: 'about',
    documents: [],
    created: -1
  }
  
  editingDocument: string;

  constructor(
    private aboutService: AboutService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private quillService: QuillService
  ) {}

  ngOnInit() {
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
    this.showEditButton = this.authService.isLoggedIn;

    this.aboutService.getPage()
    .then((page: Page) => this.page.documents = page.documents)
    .catch(err => {
      console.log(err)
      this.snackBar.open('error: unable to retrieve page.', '', { duration: 2000 });
    });
  }

  editorCreated(editor: any) {
    this.quillEditor = editor;
  }

  editDocument(guid) {
    if (this.editingDocument == guid) {
      this.editingDocument = "";
    } else {
      this.editingDocument = guid;
    }
  }

  addDocument() {
    this.page.documents.push({
      guid: this.randomString(),
      content: ""
    })
  }

  deleteDocument(guid) {
    const ind = this.page.documents.findIndex(doc => doc.guid == guid);
    this.page.documents.splice(ind, 1);
  }

  toggleEditMode() {
    if (!this.editMode) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
    this.editingDocument = "";
  }

  savePage() {
    this.aboutService.savePage(this.page)
    .subscribe(
      val => {
        if(val.result === 'created' || val.result === 'updated') {
            this.snackBar.open('page saved.', '', { duration: 2000 });
        }else{
            this.snackBar.open('error: page not saved.', '', { duration: 2000 });
        }
    },
      err => {
        this.snackBar.open('error: page not saved.', '', { duration: 2000 });
      }
    );
  }

  cancel() {
    this.editMode = false;
    this.editingDocument = "";
    this.aboutService.getPage()
    .then((page: Page) => this.page.documents = page.documents)
    .catch(err => {
      console.log(err)
      this.snackBar.open('error: unable to retrieve page.', '', { duration: 2000 });
    });
  }

  private randomString() {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 20; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }

}
