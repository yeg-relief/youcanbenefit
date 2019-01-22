`Seeder` from `./index.ts` can be used to create a working database.

__depends on ../upload#Uploader__

It will set the mappings and make:

(1) Program called "test"
(2) A Boolean Key called "test"
(3) A Toggle Question labeled "test"

Click `start`, choose `yes` and you should see the program "test" in
the results.

`ts-node run.ts` can be used to seed the database on `localhost:9200`

check out `./run#executeSeed` to change this behaviour.