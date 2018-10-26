import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/delay';
import { Animations } from '../shared/animations';

@Component({
  selector: 'app-construction-ribbon',
  templateUrl: './construction-ribbon.component.html',
  styleUrls: ['./construction-ribbon.component.css'],
  animations: [
    Animations.fadeinAndOut
  ]
})
export class ConstructionRibbonComponent implements OnInit {
  shouldHide = {
    hidden: false
  };
  fade;
  constructor(private router: Router) {}

  ngOnInit(){
    const isAdminChange = this.router.events
      .map(event => event instanceof NavigationEnd ? this.router.url : "don't care")
      .filter(url => url !== "don't care")
      .debounceTime(60)
      .map( url => url.substring(0, 7) === '/admin/' );


    const notAdminRoute = isAdminChange.filter(val => val === false )
      .do( _ => this.fade = "in")
      .delay(1000)
      .switchMap(val => Observable.of(val))
      .do( _ => this.fade = "out")
      .subscribe();



    const adminRoute = isAdminChange.filter(val => val === true )
      .do( _ => this.fade = "out")
      .subscribe();
  }
}
