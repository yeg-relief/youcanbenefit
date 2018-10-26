import { Component, OnInit } from '@angular/core';

@Component({
  template:
  `
    <md-card class="col-10 flex flex-column overview-wrapper">
      <router-outlet></router-outlet>
    </md-card>
  `,
  styles: [`
    md-card {
      height: 60vh;
      overflow-x: hidden;
      overflow-y: scroll;
      font-family: 'Open Sans', sans-serif;
      margin: 0 auto;
    }
  `]
})
export class KeysComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
