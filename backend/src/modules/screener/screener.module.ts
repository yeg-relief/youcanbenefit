import { Module } from '@nestjs/common';
import { DbElasticsearchModule } from "../db.elasticsearch/db.elasticsearch.module"
import { ScreenerService } from "./screener.service"


@Module({
    modules: [ DbElasticsearchModule ],
    controllers: [  ],
    components: [ ScreenerService ],
    exports: [ ScreenerService ]
})
export class ScreenerModule {}
