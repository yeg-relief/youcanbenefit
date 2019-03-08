import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
    selector: 'app-detail-modal',
    templateUrl: './detail-modal.component.html',
    styleUrls: ['./detail-modal.component.css']
})
export class DetailModalComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public ref: MatDialogRef<DetailModalComponent>) { }

    close(){
        this.ref.close();
    }
}
