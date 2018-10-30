import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { UserFacingProgram } from '../../../models';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { DetailModalComponent } from '../detail-modal/detail-modal.component';
import { Router, ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-user-facing-program',
    templateUrl: './user-facing-program.component.html',
    styleUrls: ['./user-facing-program.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFacingProgramComponent implements OnInit {
    @Input() program: UserFacingProgram;

    private widthMatcher = {
        'small': {
            width: '95vw',
            height: '95vh'
        },
        'medium': {
            width: '95vw',
            height: '85vh'
        },
        'large': {
            width: '75vw',
            height: '65vh'
        }
    };

    constructor(public dialog: MdDialog, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.program.tags.sort( (a, b) => a.localeCompare(b));
    }

    private determineModalDimensions(widthInPixels: number){

        if (widthInPixels < 400) return this.widthMatcher.small;

        if (widthInPixels >= 400 && widthInPixels <= 800) return this.widthMatcher.medium;

        return this.widthMatcher.large;
    }

    openModal() {
        const screenDimensions: { [key: string]: string } = this.determineModalDimensions( window.innerWidth );
        const data =  {
            title: this.program.title,
            details: this.program.details,
            detailLinks: this.program.detailLinks || []
        };

        const config: MdDialogConfig = {
            data,
            width: screenDimensions.width,
            height: screenDimensions.height
        };
        this.dialog.open(DetailModalComponent, config);
    }
}
