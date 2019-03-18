import { Component, OnInit } from '@angular/core';
import { ProgramsServiceService } from "../../../../user/programs-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserFacingProgram } from "../../../models/program";

@Component({
    selector: 'app-program-detail',
    templateUrl: './program-detail.component.html',
    styleUrls: ['./program-detail.component.css', '../../../../admin/quill/quill.css']
})
export class ProgramDetailComponent implements OnInit {
    program: Promise<UserFacingProgram | string>;
    guid: string;
    allLinks = [];
    error = '';

    constructor(
        private programService: ProgramsServiceService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        const guid = this.route.snapshot.paramMap['params']['guid'];
        if (guid) {
            this.program =
                this.programService.getProgram(guid)
                    .catch(_ => {
                        this.error = 'Cannot retrieve program.';
                        return undefined;
                    });


        }
    }

    close() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }
}
