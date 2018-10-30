import { Module } from '@nestjs/common';
import { PercolateService } from "./percolate.service";
import { DbElasticsearchModule } from "../db.elasticsearch/db.elasticsearch.module"
import { ProgramModule } from "../Program/Program.module";
import { LogModule } from "../log/log.module";

@Module({
    modules: [ DbElasticsearchModule, ProgramModule, LogModule ],
    controllers: [ ],
    components: [ PercolateService ],
    exports: [ PercolateService ]
})
export class PercolateModule {}
