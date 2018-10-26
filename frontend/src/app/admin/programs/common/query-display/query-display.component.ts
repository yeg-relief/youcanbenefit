import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { ProgramQueryClass } from '../../services/program-query.class';
import { ProgramQuery } from '../../../models'
import {MdDialog, MdDialogRef} from '@angular/material';



@Component({
    selector: 'app-query-display',
    templateUrl: './query-display.component.html',
    styleUrls: ['./query-display.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryDisplayComponent implements OnChanges, OnInit {
    @Input() query: ProgramQuery;
    @Input() selected: ProgramQueryClass
    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();
    styleClass = {
        query: true,
        selected: false
    };
    constructor(public dialog: MdDialog) { }

    ngOnChanges(changes){
        if (changes && changes.selected !== undefined && changes.selected.currentValue !== undefined) {
            changes.selected.currentValue.data.id === this.query.id ?
                this.styleClass.selected = true : this.styleClass.selected = false;
        }
    }

    ngOnInit() {
        this.query.conditions.sort( (a, b) => a.key.name.localeCompare(b.key.name) )
    }

    handleDelete(query_id) {
        const dialogRef = this.dialog.open(DeleteQueryDialog);
        dialogRef.afterClosed().subscribe(result => result ? this.delete.emit(query_id) : null );
    }
}

@Component({
    selector: 'app-delete-query-dialog',
    template: `
    <h2 md-dialog-title>Delete query</h2>
    <md-dialog-content>Are you sure?</md-dialog-content>
    <md-dialog-actions>
      <button md-button [md-dialog-close]="false">No</button>
      <!-- Can optionally provide a result for the closing dialog. -->
      <button md-button [md-dialog-close]="true">Yes</button>
    </md-dialog-actions>
  `,
})
export class DeleteQueryDialog {
    constructor(public dialogRef: MdDialogRef<DeleteQueryDialog>) {}
}
