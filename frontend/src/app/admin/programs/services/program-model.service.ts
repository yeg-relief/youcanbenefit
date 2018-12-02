
import { throwError as observableThrowError, Observable , ReplaySubject } from 'rxjs';
import { map, flatMap, take, zip, catchError, tap } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { Http, RequestOptions} from '@angular/http';
import { ApplicationFacingProgram, ProgramQuery, Key } from '../../models'
import { UserFacingProgram } from '../../../shared/models'
import { AuthService } from '../../core/services/auth.service'
import { Program } from './program.class';
import { FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment'

@Injectable()
export class ProgramModelService {
    private _cache: ReplaySubject<ApplicationFacingProgram[]>;
    keys: ReplaySubject<Key[]>;
    constructor(
        private http: Http,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        this._cache = new ReplaySubject();
        this.keys = new ReplaySubject();
        this._loadPrograms().pipe(take(1))
            .subscribe(
                this._cache.next,
                console.error
            );

        this._getKeys().pipe(take(1))
            .subscribe(
                this.keys.next,
                console.error
            );
    }

    private _findProgram(guid: string) {
        return p => p.guid === guid;
    }

    findProgram(guid: string): Observable<Program> {
        return this._cache.asObservable()
            .pipe(map(programs => {
                const program = programs.find(this._findProgram(guid))
                return program ? new Program(program, this.fb) : new Program(undefined, this.fb)
            }))
    }

    getPrograms(): Observable<ApplicationFacingProgram[]> {
        return this._cache.asObservable();
    }

    private _updateUserProgramInCache(program: UserFacingProgram, resp: any) {
        if (resp.result === 'updated' || resp.result === 'created') {
            this._cache.asObservable().pipe(take(1))
                .subscribe(cache => {
                    const val = cache.find(p => p.guid === program.guid);
                    if (val) {
                        val.user = program;
                        this._cache.next(cache);
                    } else {
                        this._cache.next([{guid: program.guid, application: [], user: program},  ...cache]);
                    }
            })
        }
    }

    saveUserProgram(program: UserFacingProgram){
        const creds = this.getCredentials();
        creds.headers.append('Content-Type', 'application/json' );

        return this.http.put(`${environment.api}/protected/program-description/`, program, creds)
            .pipe(
                map(res => res.json()),
                tap(res => this._updateUserProgramInCache(program, res))
            )
    }

    deleteProgram(guid: string): Observable<boolean> {
        return this._deleteProgram(guid)
            .pipe(tap(res => {
                if (res) {
                    this._cache.asObservable().pipe(take(1)).subscribe(cache => this._cache.next(cache.filter(p => p.guid !== guid)))
                }
            }))
    }

    private getCredentials(): RequestOptions {
        return this.authService.getCredentials();
    }

    private _loadPrograms(): Observable<ApplicationFacingProgram[]> {
        const creds = this.getCredentials();
        return this.http.get(`${environment.api}/protected/program/`, creds)
            .pipe(map( res => res.json()), catchError(this.loadError))
    }

    private _deleteProgram(guid: string) {
        const creds = this.getCredentials();
        return this.http.delete(`${environment.api}/protected/program/${guid}`, creds)
            .pipe(
                map(res => res.json()),
                map( (res: [boolean, object, Array<ApplicationFacingProgram>]) => res[0]),
                catchError(this.loadError)
            )
    }

    private _getKeys() {
        const creds = this.getCredentials();
        return this.http.get(`${environment.api}/protected/key/`, creds)
            .pipe(map( res => res.json()), catchError(this.loadError))
    }

    loadError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body['message'] || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return observableThrowError(errMsg);
    }

    getBlankQuery(guid: string): ProgramQuery {
        return {
            id: this.generateRandomString(),
            guid,
            conditions: []
        };
    }

    generateRandomString(): string {
        const LENGTH = 26;
        const lowerCaseCharSet = "abcdefghijklmnopqrstuvwxyz";
        const charSet = lowerCaseCharSet
            .concat(lowerCaseCharSet.toUpperCase())
            .concat("1234567890");

        const generateCharacters = () => {
            const arr = new Array(LENGTH);
            for(let i = 0; i < arr.length; i++){
                arr[i] = charSet[Math.floor(Math.random() * charSet.length)];
            }
            return arr;
        };

        return generateCharacters().join('');
    }
}