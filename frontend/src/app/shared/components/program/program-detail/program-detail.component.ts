import { Component, OnInit } from '@angular/core';
import { ProgramsServiceService } from "../../../../user/programs-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserFacingProgram } from "../../../models/program";

@Component({
    selector: 'app-program-detail',
    templateUrl: './program-detail.component.html',
    styleUrls: ['./program-detail.component.css']
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
                    .then(program => {
                        program.detailLinks = program.detailLinks || [];
                        return program;
                    })
                    .then( program => {
                        this.allLinks = [program.externalLink, ...program.detailLinks];
                        return program;
                    })
                    .then(program => {
                        this.allLinks = this.allLinks.map(link => {
                            if (link.substring(0, 8) !== 'http://') {
                                return 'http://' + link;
                            }
                            return link;
                        });
                        return program;
                    })
                    .catch(_ => {
                        this.error = 'Can not retrieve program.';
                        return undefined;
                    });


        }
    }

    close() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }
}
