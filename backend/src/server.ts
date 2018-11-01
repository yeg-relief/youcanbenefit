import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';
const bodyParser = require('body-parser');

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    app.use(bodyParser.urlencoded( {extended: true} ));
    app.use(bodyParser.json( {limit: '50mb'} ));
    await app.listen(3000);
}
bootstrap();
