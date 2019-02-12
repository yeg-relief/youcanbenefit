import { Module } from '@nestjs/common';
import { DbElasticsearchModule } from "../db.elasticsearch/db.elasticsearch.module"
import { QuestionService } from './question.service'

@Module({
    imports: [ DbElasticsearchModule ],
    providers: [ QuestionService ],
    exports: [ QuestionService ]
})
export class QuestionModule {}
