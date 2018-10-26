import { Component } from '@nestjs/common';
import { ConstantsReadonly } from "../constants.readonly";
import * as fs from 'fs';
import * as path from 'path';
import {ProgramDto} from "../Program/program.dto";

@Component()
export class LogService {
    LOG_PATH = process.env.NODE_ENV === 'production' ? new ConstantsReadonly().logPath : path.resolve(__dirname, 'logs');
    constructor() {
        fs.access(this.LOG_PATH, fs.constants.W_OK, err => {
            if (err) {
                console.log("CAN NOT ACCESS LOG PATH: ", this.LOG_PATH);
                throw err;
            }
        })
    }

    logFormSubmission(data: Object) {
        const _path = path.resolve(this.LOG_PATH, 'youcanbenefit', 'form_submission', `${String(Date.now())}.json` );

        fs.writeFile(_path, JSON.stringify(data), err => {
            if (err) {
                throw err
            }
            console.log("form submission saved!")
        });
    }

    logProgramResults(data: ProgramDto[]) {
        const _path = path.resolve(this.LOG_PATH, 'youcanbenefit', 'form_results', `${String(Date.now())}.json` );

        const namesAndGuids = data.map(({title, guid}) => ({title, guid}));

        fs.writeFile(_path, JSON.stringify(namesAndGuids), err => {
            if (err) {
                throw err
            }
            console.log("result saved!")
        })
    }

}