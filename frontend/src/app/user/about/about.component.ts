import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  quillModules: {};
  dynamicDocument = "";
  editMode = false;
  documents = [
    {
      guid: "1",
      content: "e4c is a non-profit, charitable organization that has been working for almost 50 years to help vulnerable people here and now. At the same time, we’re working to prevent and eventually eliminate poverty. It’s a big task, but one we know is possible with the help of others who are ready to see the strength we see in the people we serve. Our organization’s areas of focus are shelter and housing, community and collaboration, skill development and education, and food security."
    },
    {
      guid: "2",
      content: "B"
    },
    {
      guid: "3",
      content: "C"
    }
  ]
  editingDocuments = {
    "1": false,
    "2": false,
    "3": false
  }
  error = "";
  constructor(
    private aboutService: AboutService
  ) {}

  ngOnInit() {
    this.quillModules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'header': 1}, { 'header': 2}],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet'}],
        [{ 'indent': '-1'}, { 'indent': '+1' }], 
        [{ 'align': [] }],
        ['link']
      ]
    }
    // this.aboutService.getDocument().then((doc) => {
    //   this.dynamicDocument = doc
    // }, (err) => {
    //   this.error = err;
    // })
  }

  editDocument(guid) {
    if (!this.editingDocuments[guid]) {
      this.editingDocuments[guid] = true;
    } else {
      this.editingDocuments[guid] = false;
    }
  }

  addDocument() {
    this.documents.push({
      guid: this.randomString(),
      content: ""
    })
  }

  deleteDocument(guid) {
    const ind = this.documents.findIndex(doc => doc.guid == guid);
    this.documents.splice(ind, 1);
  }

  toggleEditMode() {
    if (!this.editMode) {
      this.editMode = true
    } else {
      this.editMode = false
    }
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
