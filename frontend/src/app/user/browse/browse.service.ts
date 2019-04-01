import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ProgramsServiceService } from '../programs-service.service';
import { environment } from '../../../environments/environment';
import { map, tap, multicast, refCount, switchMap, pluck, reduce, take } from 'rxjs/operators'
import { UserFacingProgram } from 'src/app/shared';

@Injectable()
export class BrowseService {
    programs$;

    constructor(private http: Http, private programService: ProgramsServiceService) {
        this.programs$ =  this.http.get(`${environment.api}/api/program`)
            .pipe(
                map(res => res.json()),
                tap(programs => this.programService.addPrograms(programs)),
                multicast( new ReplaySubject(1) ),
                refCount(),
            )
    }

    getCategories() {
        return this.programs$
            .pipe(
                switchMap( (x: any) => x),
                pluck('tags'),
                reduce( (allTags, programTags) => {
                    programTags.forEach(tag => {
                        if (allTags.indexOf(tag) < 0) {
                            allTags.push(tag);
                        }
                    });
                    return allTags;
                }, []),
            )            
    }

    getAllPrograms()  {
        return this.programs$.toPromise();
    }

    loadError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body.message || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return new Error(errMsg);
    }

    updateProgramInCache(program: UserFacingProgram) {
        this.programs$.pipe(take(1))
                .subscribe(cache => {
                    let index = cache.findIndex(p => p.guid === program.guid);
                    if (index >= 0) {
                        cache[index] = program;
                    } else {
                        cache.push(program)
                    }
                    this.programService.addPrograms(cache);
                })
    }

    deleteProgramInCache(guid: string) {
        this.programs$.pipe(take(1))
            .subscribe(cache => {
                let index = cache.findIndex(p => p.guid === guid);
                if (index >= 0) {
                    cache.splice(index, 1);
                }
            })
    }
}
