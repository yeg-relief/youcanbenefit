import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-quick-links-content',
    templateUrl: './quick-links-content.component.html',
    styleUrls: ['./quick-links-content.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class QuickLinksContentComponent implements OnInit {

    @Input() fragments: any  = {};

    constructor() { }

    ngOnInit() {
    }

}
