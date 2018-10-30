import { Component } from '@angular/core';
@Component({
    selector: 'app-admin',
    template: '<router-outlet ></router-outlet>',
    styles: [`
        :host {
            background-color: lightgoldenrodyellow;
            overflow-x: hidden;
        }
    `],
    providers: [ ]
})
export class AdminComponent {}
