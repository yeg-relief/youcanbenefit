import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

interface Section {
  title: string;
  url: string;
}


@Component({
  selector: 'app-sidenav-section',
  templateUrl: './sidenav-section.component.html',
  styleUrls: ['./sidenav-section.component.css'],
  providers: []
})
export class SidenavSectionComponent implements OnInit {
  @Input() section: Section;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  getRoot() {
    return this.router.routerState.snapshot.url.split('/').splice(2, 2)[0];
  }
}
