import { Module } from '@nestjs/common';
import { DbElasticsearchModule } from "../db.elasticsearch/db.elasticsearch.module"
import { ScreenerService } from "./screener.service"


@Module({
    imports: [ DbElasticsearchModule ],
    providers: [ ScreenerService ],
    exports: [ ScreenerService ]
})
export class ScreenerModule {}
