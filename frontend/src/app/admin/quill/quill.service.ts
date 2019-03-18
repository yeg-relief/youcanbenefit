import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class QuillService {

  IMGUR_CLIENT_ID = 'e52c61fa40312d4';
  IMGUR_API_URL = 'https://api.imgur.com/3/image';

  constructor(private http: Http, private snackBar: MatSnackBar) {  }

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
