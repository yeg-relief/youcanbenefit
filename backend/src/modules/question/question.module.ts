import { Module } from '@nestjs/common';
import { DbElasticsearchModule } from "../db.elasticsearch/db.elasticsearch.module"
import { QuestionService } from './question.service'
import { EsQueryService } from '../query/EsQuery.service';

@Module({
    imports: [ DbElasticsearchModule ],
    providers: [ QuestionService,
                EsQueryService ],
    exports: [ QuestionService ]
})
export class QuestionModule {}
