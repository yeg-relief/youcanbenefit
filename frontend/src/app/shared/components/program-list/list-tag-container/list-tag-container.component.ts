import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-list-tag-container',
    templateUrl: './list-tag-container.component.html',
    styleUrls: ['./list-tag-container.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTagContainerComponent implements OnInit {
    @Input() tags: string[] = [];

    constructor() { }

    ngOnInit() {
        this.tags.sort((a, b) => a.localeCompare(b))
    }

}
