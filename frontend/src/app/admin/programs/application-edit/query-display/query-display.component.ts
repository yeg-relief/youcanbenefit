import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { ProgramQueryClass } from '../../services/program-query.class';
import { ProgramQuery } from '../../../models'

@Component({
    selector: 'app-query-display',
    templateUrl: './query-display.component.html',
    styleUrls: ['./query-display.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryDisplayComponent implements OnChanges, OnInit {
    @Input() query: ProgramQuery;
    @Input() selected: ProgramQueryClass;
    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() copy = new EventEmitter();
    styleClass = {
        query: true,
        selected: false
    };
    ngOnChanges(changes){
        if (changes && changes.selected !== undefined && changes.selected.currentValue !== undefined) {
            changes.selected.currentValue.data.id === this.query.id ?
                this.styleClass.selected = true : this.styleClass.selected = false;
        }
    }

    ngOnInit() {
        try{
            this.query.conditions.sort( (a, b) => a.question.text.localeCompare(b.question.text) );
        } catch(e) {
            console.log("~~~~~~~~~~~~~");
            console.log("BAD QUERY", this.query);
            console.log("~~~~~~~~~~~~~")
        }
    }

    handleDelete(query_id) {
        const result = window.confirm("Are you sure you want to delete this query?");
        if (result) {
            this.delete.emit(query_id)
        }
    }

    handleCopy(query_id) {
      this.copy.emit(query_id);
    }
}
