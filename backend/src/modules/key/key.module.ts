import { Module } from '@nestjs/common';
import { DbElasticsearchModule } from "../db.elasticsearch/db.elasticsearch.module"
import { KeyService } from "./key.service"

@Module({
    modules: [ DbElasticsearchModule ],
    controllers: [  ],
    components: [ KeyService ],
    exports: [ KeyService ]
})
export class KeyModule {}
