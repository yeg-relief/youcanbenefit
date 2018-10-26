import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
    @Input() options: Array<any>;
    @Output() delete = new EventEmitter();
    @Output() edit = new EventEmitter();
    constructor() { }

    ngOnInit() {
        if (!this.options) {
            this.options = [];
        }
    }

}
