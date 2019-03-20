import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import { MatSnackBar } from '@angular/material';
import * as Quill from 'quill';

@Injectable({
  providedIn: 'root'
})
export class QuillService {
  quillEditor: any;

  IMGUR_CLIENT_ID = 'e52c61fa40312d4';
  IMGUR_API_URL = 'https://api.imgur.com/3/image';

  constructor(private http: Http, private snackBar: MatSnackBar) {

    let Link = Quill.import('formats/link');
    Link.sanitize = (url) => {
      const regexp = new RegExp('^(http://|https://)');
      return regexp.test(url) ? url : 'http://' + url;
    };
    Quill.register(Link, true);

    let Embed = Quill.import('blots/embed');
    class Hr extends Embed {
      static blotName = 'hr';
      static tagName = 'hr';
    }
    Quill.register(Hr);

   }

  setQuillEditor(editor) {
    this.quillEditor = editor;
  }

  getQuillModules() {
    return { toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'header': 1}, { 'header': 2}],
        [{ 'list': 'ordered'}, { 'list': 'bullet'}],
        [{ 'indent': '-1'}, { 'indent': '+1' }], 
        [{ 'align': [] }],
        ['link', 'image', 'code']
      ],
      handlers: {
        'image': () => { this.uploadImage(this.quillEditor) },
        'code' : () => { this.insertHr(this.quillEditor) }
      }
    }}
  }

  getRequestOptions(): RequestOptions {
    const headers = new Headers();
    headers.append("Authorization", `Client-ID ${this.IMGUR_CLIENT_ID}`);
    return new RequestOptions({ headers: headers });
  }

  uploadImage(editor) {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp');
    fileInput.click();
    fileInput.addEventListener('change', () => {
      const file: File = fileInput.files[0];
      if (file != null) {
        return this.http.post(this.IMGUR_API_URL, file, this.getRequestOptions())
        .toPromise()
        .then(res => {
          res = res.json();
          if (res.status === 200) {
            const range = editor.getSelection();
            editor.insertEmbed(range.index, 'image', res['data']['link'], 'user');
          } else {
            this.snackBar.open('error uploading image.','', { duration: 2000 });
          }
        })
        .catch(err => {
          console.log(err);
          this.snackBar.open('error uploading image.','', { duration: 2000 })
        });
      }
    })
  }

  insertHr(editor) {
    const range = editor.getSelection();
    if (range) {
      editor.insertEmbed(range.index, 'hr', '', 'user')
    }
  }
}
