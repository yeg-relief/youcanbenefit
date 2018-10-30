import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserFacingProgram } from "../../models/program";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-program-list',
    templateUrl: './program-list.component.html',
    styleUrls: ['./program-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramListComponent {
    @Input() programs: UserFacingProgram[] = [];

    constructor(private router: Router, private route: ActivatedRoute) {}

    navigateToDetails(guid: string) {
        this.router.navigate(['./details/' + guid ], {relativeTo: this.route})
    }

    encodeURIComponent(programTitle) {
        return encodeURIComponent(programTitle)
    }
}
