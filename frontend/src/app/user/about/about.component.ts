import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  dynamicDocument = "";
  documents = ["A", "B", "C"];
  error = "";
  constructor(
    private aboutService: AboutService
  ) {}

  ngOnInit() {
    // this.aboutService.getDocument().then((doc) => {
    //   this.dynamicDocument = doc
    // }, (err) => {
    //   this.error = err;
    // })
  }

  editDocument() {
    
  }

}
