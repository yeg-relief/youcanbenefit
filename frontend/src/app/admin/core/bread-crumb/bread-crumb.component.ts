import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css'],
})
export class BreadCrumbComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  getUrl() {
    return this.router.routerState.snapshot.url.split('/').splice(2, 2).join(' / ');
  }
}
