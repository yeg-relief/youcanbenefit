import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms'

@Component({
    selector: 'app-tag-edit',
    templateUrl: './tag-edit.component.html',
    styleUrls: ['./tag-edit.component.css']
})
export class TagEditComponent implements OnInit {
    @Input() tags: FormArray;
    linkInput = new FormControl('', Validators.pattern('[a-zA-Z0-9]{2,32}'));
    constructor() { }

    ngOnInit() {}

    addTag() {
        if (this.linkInput.valid && this.linkInput.value.trim().length > 0 ) {
            this.tags.push(new FormControl(this.linkInput.value));
            this.linkInput.setValue('');
        }
    }

    removeTagAt(index: number){
        this.tags.removeAt(index);
    }
}
