import { Injectable } from '@angular/core';
import { Http , RequestOptions} from '@angular/http';
import { ApplicationFacingProgram, ProgramQuery, Key } from '../../models'
import { UserFacingProgram } from '../../../shared/models'
import { AuthService } from '../../core/services/auth.service'
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Program } from './program.class';
import { FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do'

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
        this._loadPrograms().take(1).subscribe(
            programs => this._cache.next(programs),
            error => console.error(error)
        );

        this._getKeys().take(1).subscribe(
            keys => this.keys.next(keys),
            error => console.error(error)
        )
    }

    private _findProgram(guid: string) {
        return p => p.guid === guid;
    }

    findProgram(guid: string): Observable<Program> {
        return this._cache.asObservable()
            .map(programs => programs.find(this._findProgram(guid)))
            .map(p => p !== undefined ? new Program(p, this.fb) : null)
            .map(p => p === null ? new Program(undefined, this.fb) : p)
    }

    getPrograms(): Observable<ApplicationFacingProgram[]> {
        return this._cache.asObservable();
    }

    private async _updateUserProgramInCache(program: UserFacingProgram, resp: any): Promise<boolean> {
        if (resp.result === 'updated' || resp.result === 'created') {
            const cache = await this._cache.asObservable().take(1).toPromise();
            const val = cache.find(p => p.guid === program.guid);

            if (val) {
                val.user = program;
                this._cache.next(cache);
            } else {
                this._cache.next([{guid: program.guid, application: [], user: program},  ...cache]);
            }
            return true;
        }
        return false;
    }


    saveUserProgram(program: UserFacingProgram): Observable<boolean> {
        const creds = this.getCredentials();
        creds.headers.append('Content-Type', 'application/json' );

        return this.http.put('/protected/program-description/', program, creds)
            .map( res => res.json() )
            .flatMap( res => Observable.fromPromise(this._updateUserProgramInCache(program, res)))
    }

    deleteProgram(guid: string): Observable<boolean> {
        return this._deleteProgram(guid).do(res => {
            if (res) {
                this._cache.asObservable().take(1).subscribe(cache => this._cache.next(cache.filter(p => p.guid !== guid)))
            }
        })
    }

    private _updateValueInCache(input$: Observable<ApplicationFacingProgram>): Observable<ApplicationFacingProgram> {
        return input$.flatMap(data => Observable.zip(Observable.of(data), this._cache.asObservable()))
            .do( ([data, cache]) => {
                let index = cache.findIndex(this._findProgram(data.guid));

                if (index >= 0)
                    cache[index] = data;

                this._cache.next(cache);
            })
            .map( ([data, cache]) => data)
    }

    private getCredentials(): RequestOptions {
        return this.authService.getCredentials();
    }

    private _loadPrograms(): Observable<ApplicationFacingProgram[]> {
        const creds = this.getCredentials();
        return this.http.get('/protected/program/', creds)
            .map( res => res.json())
            .catch(this.loadError)
    }

    private _updateProgram(program: ApplicationFacingProgram) {
        const creds = this.getCredentials();
        creds.headers.append('Content-Type', 'application/json' );
        const body = JSON.stringify({ data: program });
        return this.http.put('/protected/program/', body, creds)
            .map(res => res.json().created)
            .catch(this.loadError)
    }

    private _saveProgram(program: ApplicationFacingProgram) {
        const creds = this.getCredentials();
        creds.headers.append('Content-Type', 'application/json' );
        const body = JSON.stringify({ data: program });
        return this.http.post('/protected/program/', body, creds)
            .map(res => res.json().response)
            .catch(this.loadError)
    }

    private _deleteProgram(guid: string) {
        const creds = this.getCredentials();
        return this.http.delete(`/protected/program/${guid}`, creds)
            .map(res => res.json())
            // object is an es response, the array is the remaining programs
            .map( (res: [boolean, object, Array<ApplicationFacingProgram>]) => res[0])
            .catch(this.loadError)
    }

    private _getKeys() {
        const creds = this.getCredentials();
        return this.http.get('/protected/key/', creds)
            .map(res => res.json())
            .catch(this.loadError);
    }

    loadError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body['message'] || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
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