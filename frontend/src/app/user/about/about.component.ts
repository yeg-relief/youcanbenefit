import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  dynamicDocument = "test document";
  constructor(
    private aboutService: AboutService
  ) {}

  ngOnInit() {
    console.log('Asking for doc')
    this.aboutService.getDocument().then((doc) => {
      this.dynamicDocument = doc
    }, (err) => {
      console.error(err)
    })
  }

}
