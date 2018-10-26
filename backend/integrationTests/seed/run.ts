import { Seeder } from "./index"
import * as path from "path"
import * as fs from "fs"

main();

function main() {
    readData()
        .catch(readDataError)
        .then(executeSeed)
        .catch(executeSeedError)
        .then(_ => console.log("Seed is completed."))
}

function readData(folder?: string): Promise<any[]> {
    const concreteFolder = folder || path.resolve(__dirname, 'data');

    const programs = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'programs.json')).toString()
    );

    const queries = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'queries.json')).toString()
    );

    const screener = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'screener.json')).toString()
    );

    const programMappings = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'program_mapping.json')).toString()
    ).programs;

    const queryMappings = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'query_mapping.json')).toString()
    ).master_screener;

    const screenerMappings = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'screener_mapping.json')).toString()
    ).questions;

    const a = {
        queryMappings,
        programs,
        queries,
        screener
    };

    const b = {
        programMappings,
        queryMappings,
        screenerMappings
    };


    return Promise.resolve([a, b])
}

function readDataError(err) {
    console.log("Could read local data.");
    console.error(err);
    process.exit(3);
}

function executeSeed(_data: any[]): Promise<Object> {
    // const args = process.argv.slice(2);
    //const target = JSON.parse(fs.readFileSync(path.resolve('..', 'config.json')).toString()).target  || args[0];
    const target = "http://localhost:9400";

    const [data, mappings] = _data;

    if (target.includes("youcanbenefit")) {
        return Promise.reject(new Error("ACCIDENTAL SEED"))
    }

    return new Seeder(data, mappings).execute()
}

function executeSeedError(err) {
    if (err.message === "ACCIDENTAL SEED") {
        console.log("SEEDING A LIVE ENDPOINT");
        console.log("STOPPING SEED TO SAVE YOUR ASS");
        process.exit(4);
    }


    console.log("Could not seed data.");
    console.error(err);
    process.exit(3);
}