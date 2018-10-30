import { Module } from '@nestjs/common';
import { ClientService } from "./client.service";

@Module({
    modules: [  ],
    controllers: [ ],
    components: [ ClientService ],
    exports: [ ClientService ]
})
export class DbElasticsearchModule {}
