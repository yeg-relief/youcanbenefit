# `Uploader`
Will upload data to a host. There is some attempt and making overwrite
protection, but not complete.

`ts-node run.ts` will upload data from the `./data` folder
to the `config.json#target` elasticsearch server.

Will throw an error if the domain name has `youcanbenefit` in it.

This file depends on proper mappings, ie don't use it alone. Use
`Seeder` instead.