import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Animations } from '../shared/animations';
import { of } from 'rxjs';
import { map, filter, debounceTime, tap, switchMap, delay } from 'rxjs/operators'

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
      .pipe(
        map(event => event instanceof NavigationEnd ? this.router.url : "don't care"),
        filter(url => url !== "don't care"),
        debounceTime(60),
        map( url => url.substring(0, 7) === '/admin/' )
      )
      
    const notAdminRoute = isAdminChange
      .pipe(
        filter(val => val === false),
        tap( _ => this.fade = "in"),
        delay(1000),
        switchMap(val => of(val)),
        tap( _ => this.fade = "out")
      )
      .subscribe();



    const adminRoute = isAdminChange
      .pipe(
        filter(val => val === true ),
        tap( _ => this.fade = "out")
      )
      .subscribe();
  }
}
