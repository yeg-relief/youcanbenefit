import { Module } from '@nestjs/common';
import { DocumentService } from "./document.service";
import { DbElasticsearchModule } from "../db.elasticsearch/db.elasticsearch.module"

@Module({
    imports: [ DbElasticsearchModule ],
    providers: [ DocumentService ],
    exports: [ DocumentService ]
})
export class DocumentModule {}
