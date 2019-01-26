import { Module } from '@nestjs/common';
import { ClientService } from "./client.service";
import { SearchModule } from './search.module'

@Module({
    imports: [ SearchModule ],
    providers: [ ClientService ],
    exports: [ ClientService ]
})
export class DbElasticsearchModule {}
