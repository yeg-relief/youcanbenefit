import { Injectable } from '@angular/core';
import { UserFacingProgram } from '../shared/models';
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

@Injectable()
export class ProgramsServiceService {
    private programs: {[key: string]: any} = {};

    constructor(private httpClient: HttpClient) {}

    public addPrograms(newPrograms: UserFacingProgram[]) {
        newPrograms.forEach(p => this.programs[p.guid] = p);
    }

    public getProgram(guid: string): Promise<any> {
        return new Promise( (resolve, reject) => {
            if (this.programs[guid]) {
                resolve(this.programs[guid]);
            } else {
                this.fetchProgram(guid)
                    .take(1)
                    .subscribe(
                        (program) => {
                            if (program && program['guid']) {
                                this.programs[program['guid']] = program;
                            }
                            resolve(program)
                        },
                        err => reject(err)
                    )
            }
        })
    }

    private fetchProgram(guid: string) {
        return this.httpClient.get(`api/program/${guid}`)
    }
}
