import { Module } from '@nestjs/common';
import { ProgramService } from "./program.service";
import { DbElasticsearchModule } from "../db.elasticsearch/db.elasticsearch.module"

@Module({
    imports: [ DbElasticsearchModule ],
    providers: [ ProgramService ],
    exports: [ ProgramService ]
})
export class ProgramModule {}
