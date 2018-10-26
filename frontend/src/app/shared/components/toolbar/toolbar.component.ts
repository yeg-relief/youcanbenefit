import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/do';

import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations'
import {AuthService} from "../../../admin/core/services/auth.service";


@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('fadein', [
            state('*', style({opacity: 1 })),
            transition('void => *', [
                style({opacity: 0 }),
                animate('400ms ease-out')
            ]),
        ]),
        trigger('flyin', [
            state('in', style({transform: 'translateX(0)'})),
            transition('void => *', [
                style({transform: 'translateX(-50%)'}),
                animate('450ms ease-out')
            ]),
        ]),
    ]
})
export class ToolbarComponent implements OnInit {

    routes = [];

    userRoutes = [
        ["home", "home"],
        ["questions", "master-screener/questions"],
        ["browse", "browse-programs/all"],
    ].sort((a,b) => a[0].localeCompare(b[0]));



    adminRoutes = [
        ["screener", "admin/screener/edit"],
        ["programs", "admin/programs/overview"],
        ["keys", "admin/keys/overview"],
        ["data", "admin/data"]
    ].sort((a,b) => a[0].localeCompare(b[0]));

    showAdminRoutes = false;

    activeMap = {
        "home": {
            active: true
        },
        "links": {
            active: false
        },
        "about": {
            active: false
        },
        "questions": {
            active: false
        },
        "browse": {
            active: false
        }
    };

    constructor(
        private router: Router,
        public cd: ChangeDetectorRef,
        private authService: AuthService) {}

    ngOnInit() {
        this.showAdminRoutes = this.authService.isLoggedIn;
        this.routes = [...this.userRoutes];
        this.buildActiveMap(window.location.pathname);

        const navigationStart = this.router.events.filter(e => e instanceof NavigationEnd).map( e => e['url']);


        navigationStart
            .do(url => {
                this.buildActiveMap(url);
            })
            .map(url => url.split('/').indexOf('admin') > -1)
            .subscribe(val => {
                this.showAdminRoutes = this.authService.isLoggedIn;
                this.cd.markForCheck();
            });
    }

    buildActiveMap(url) {

        Object.keys(this.activeMap).forEach(key => {
            this.activeMap[key]['active'] = false;
        });

        if (url.indexOf('browse-programs') > -1) {
            this.setActive(this.activeMap['browse'])
        } else if (url.indexOf('home') > -1) {
            this.setActive(this.activeMap['home'])
        } else if (url.indexOf('links') > -1) {
            this.setActive(this.activeMap['links'])
        } else if (url.indexOf('about') > -1) {
            this.setActive(this.activeMap['about'])
        } else if (url.indexOf('master-screener/questions') > -1) {
            this.setActive(this.activeMap['questions'])
        }

        this.cd.markForCheck();
    }

    setActive(obj: any) {
        if (obj) {
            obj.active = true;
        }
    }
}
