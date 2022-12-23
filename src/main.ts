import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import dotenv = require('dotenv');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AllExceptionsFilter } from './all-exceptions.filter';
import * as bodyParser from 'body-parser';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const option = new DocumentBuilder()
    .setTitle(process.env.APP_NAME)
    .setDescription('MJ Rest API Docs')
    .setVersion(process.env.APP_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, option);
  SwaggerModule.setup('swagger', app, document)
  app.use(bodyParser.json({ limit: '150mb' }));
  app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  await app.listen(process.env.APP_PORT);
  console.log('backend on port : ' + process.env.APP_PORT)
}
bootstrap();
