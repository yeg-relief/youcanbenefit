import { Module } from '@nestjs/common';
import { DbElasticsearchModule } from "../db.elasticsearch/db.elasticsearch.module"
import { ApplicationQueryService } from "./ApplicationQuery.service";
import { EsQueryService } from "./EsQuery.service"

@Module({
    modules: [ DbElasticsearchModule ],
    controllers: [  ],
    components: [ ApplicationQueryService, EsQueryService ],
    exports: [ ApplicationQueryService, EsQueryService ]
})
export class QueryModule {}
