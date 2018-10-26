import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/debounceTime';
import { InitialRedirectService } from "./initial-redirect.service";


@Component({
    selector: 'app-root',
    template: `
    <app-toolbar></app-toolbar>
    <main id="main-outlet" 
          [ngClass]="backgroundClass" [style.height]="height" [style.width]="width">
      <router-outlet></router-outlet>
    </main>
  `,
    styles: [
        `
      #main-outlet {
        margin: 0 auto;
        overflow-x: hidden;
      }
    `,`
      .background {
        background-image: url(assets/17_03_15-YouCanBenefit-Illustration.svg);
        background-position: center bottom;
        background-repeat: no-repeat;
        background-size: contain;
      }
    `,`
      @media(max-width: 600px) {
        .background {
          background-image: url(assets/17_03_15-YouCanBenefit-Illustration.svg);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
    `,`
      .backgroundcolor {
        background-color: lightgoldenrodyellow;
      }
    `

    ],
    providers: [ ]
})
export class AppComponent implements OnInit {
    isIE: boolean;
    backgroundClass = {
        background: true,
        backgroundcolor: false
    };
    height = 'default';
    width = '98vw';

    constructor(
        private router: Router,
        private initialRedirect: InitialRedirectService,
    ){}

    ngOnInit() {
        this.initialRedirect.doRedirect();

        const userAgent: string = window ? window.navigator.userAgent: '';
        this.isIE = userAgent.includes('Trident');

        const isAdminRoute = url => url.substring(0, 7) === '/admin/';


        /*
            the following code needs a refactor

         */


        this.router.events
            .map(event => event instanceof NavigationEnd ? this.router.url : undefined)
            .filter(url => !!url)
            .debounceTime(60)
            .map( url => [isAdminRoute(url), url] )
            .subscribe( ([val, url]) => {
                if (this.isIE) {
                    this.backgroundClass.background = false;
                    this.backgroundClass.backgroundcolor = true;
                } else {
                    this.backgroundClass.background = (val === false ||  val === 'false');
                    this.backgroundClass.backgroundcolor = (val === true ||  val === 'true');
                }

                if ((<string>url).indexOf('details') === -1) {
                    this.width = 'auto';
                    this.height = 'auto';
                } else if ((<string>url).indexOf('details') > -1 && window.innerWidth < 450){
                    this.width = 'auto';
                    this.height = 'auto';
                }

                if ((<string>url).indexOf('questions') > -1 && window.innerWidth < 450) {
                    this.width = 'auto';
                    this.height = 'auto';
                }

                if ((<string>url).indexOf('about') > -1) {
                    this.backgroundClass.background = false;
                    this.backgroundClass.backgroundcolor = true;
                }

                if ((<string>url).indexOf('quick-links') > -1) {
                    this.backgroundClass.background = false;
                    this.backgroundClass.backgroundcolor = true;
                }

                if ((<string>url).indexOf('browse') > -1) {
                    this.backgroundClass.background = false;
                    this.backgroundClass.backgroundcolor = true;
                }

                if ((<string>url).indexOf('results') > -1) {
                    this.backgroundClass.background = false;
                    this.backgroundClass.backgroundcolor = true;
                }
            });


    }
}
