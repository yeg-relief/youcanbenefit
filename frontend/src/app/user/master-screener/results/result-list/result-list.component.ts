import { Component, OnInit } from '@angular/core';
import { MasterScreenerService } from '../../master-screener.service';
import { Animations } from '../../../../shared/animations';
import {ProgramsServiceService} from "../../../programs-service.service";

@Component({
    selector: 'app-result-list',
    templateUrl: './result-list.component.html',
    styleUrls: ['./result-list.component.css'],
    animations: [
        Animations.fadeinAndOut
    ]
})
export class ResultListComponent implements OnInit {
    errorMessage: string;
    results = [];

    constructor(
        private masterScreenerService: MasterScreenerService,
        private programService: ProgramsServiceService
    ) { }

    ngOnInit() {
        if (this.masterScreenerService.results !== undefined &&  Array.isArray(this.masterScreenerService.results)){
            this.results = [...this.masterScreenerService.results];

        } else {
            this.errorMessage = 'error loading results, try again later.';
        }

    }
}
