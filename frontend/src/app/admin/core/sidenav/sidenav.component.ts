import { Component, OnInit } from '@angular/core';

interface Section {
  title: string;
  url: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  content: Section[] = [
    {
      title: 'screener',
      url: 'screener/edit',
    },
    {
      title: 'programs',
      url: 'programs/overview',
    },
    {
      title: 'keys',
      url: 'keys/overview'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
