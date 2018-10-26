import { Component, OnInit } from '@angular/core';
import {DataManagementService} from "./data-management.service";
import "rxjs/add/operator/take";
import "rxjs/add/operator/do";

@Component({
    selector: 'app-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
    states = {
        "BACKUP": {
            active: false,
            "action-item": true
        },
        "INIT": {
            active: true,
            "action-item": true
        },
        "UPLOAD": {
            active: false,
            "action-item": true
        }
    };
    error = "";
    success = "";
    force = false;
    hasBeenInitialized = false;

    constructor(private dataService: DataManagementService) { }

    ngOnInit() {
        this.dataService.hasBeenInitialized().take(1).subscribe(res => this.hasBeenInitialized = res)
    }

    select(state: string) {
        Object.keys(this.states).map(key => this.states[key].active = false);
        this.states[state].active = true;
        this.force = false;
        this.success = "";
        this.error = "";
    }

    initSearchEngine() {
        this.dataService
            .init(this.force)
            .take(1)
            .subscribe(
                (res) => {
                    let success = true;
                    res.forEach( ([exists, created]) => {
                        success = created && created.acknowledged
                    });
                    if (success) {
                        this.success = "the search engine has been initialized."
                    }


                    this.error = "";
                },
                err => {
                    const error = err.json();
                    if (error.statusCode === 500) {
                        this.error = "You may have already configured your database";
                    } else {
                        this.error = error.message;
                    }
                }
            )
    }

    downloadData() {
        this.dataService
            .downloadData()
            .take(1)
            .subscribe(
                blob => {
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);

                    const date = new Date();
                    link.download = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-YouCanBenefit.json`;
                    link.click();
                    this.success = "Data downloaded."
                },

                err => {
                    const error = err.json ? err.json() : err;
                    this.error = "unable to download data.";
                }
            )
    }

    onUploadChange($event) {
        const [ file ] = $event.target.files;
        const reader = new FileReader();
        const upload = event => {
            const data = event.target['result'];
            this.dataService.upload(data).take(1).subscribe(
                res => {
                    console.dir(res);
                    this.success = "Search engine configured."
                },
                error => {
                    console.error(error);
                    this.error = "Upload failed";
                }

            )
        };

        reader.addEventListener('load', upload);
        reader.readAsText(file);
    }
}
