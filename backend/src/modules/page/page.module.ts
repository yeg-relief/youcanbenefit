import { Module } from '@nestjs/common';
import { PageService } from "./page.service";
import { DbElasticsearchModule } from "../db.elasticsearch/db.elasticsearch.module"

@Module({
    imports: [ DbElasticsearchModule ],
    providers: [ PageService ],
    exports: [ PageService ]
})
export class PageModule {}
