import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  app.use(morgan('dev'));

  const config = app.get(ConfigService);

  await app.listen(config.get('PORT'), config.get('HOST'));
}

bootstrap();
