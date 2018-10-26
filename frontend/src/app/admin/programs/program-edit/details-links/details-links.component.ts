import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormArray, Validators} from "@angular/forms";

@Component({
    selector: 'app-details-links',
    templateUrl: './details-links.component.html',
    styleUrls: ['./details-links.component.css']
})
export class DetailsLinksComponent implements OnInit {
    @Input() links: FormArray;
    linkInput = new FormControl('', Validators.required);
    constructor() { }

    ngOnInit() {}

    addLink() {
        if (this.linkInput.valid && this.linkInput.value.trim().length > 0 ) {
            this.links.push(new FormControl(this.linkInput.value));
            this.linkInput.setValue('');
        }
    }

    removeLinkAt(index: number){
        this.links.removeAt(index);
    }
}
