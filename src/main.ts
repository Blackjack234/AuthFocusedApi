import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const logger = app.get(Logger)
  await app.listen(process.env.PORT ?? 3200,()=>{
    logger.debug(`[${ configService.get('PROJECT_NAME') } | ${ configService.get('NODE_ENV') }] is running: http://127.0.0.1:${configService.get('PORT')}/apidoc/v1`)
  });
}
bootstrap();
