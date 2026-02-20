import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { crossEnv } from 'cross-env';
import * as  compression from 'compression';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  app.use(bodyParser.json())
  app.enableCors({
    origin:'*',
    methods:['GET','POST','PUT','DELETE','PATCH'],
    credentials:true
  })
  app.use(compression())
  app.use(helmet({
    crossOriginResourcePolicy: false
  }))
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))


  const configService = app.get(ConfigService)
  const logger = app.get(Logger)



  if (configService.getOrThrow<string>('NODE_ENV') === 'development') {
    const createConfig = (title: string, description: string) => {
      return new DocumentBuilder()
        .setOpenAPIVersion('3.1.0')
        .setTitle(title)
        .setDescription(description)
        .addBearerAuth()
        .setVersion('1.0')
        .addTag('Auth')
        .addServer(configService.getOrThrow<string>('BACKEND_URL'))
        .build()
    }


    const configApi = createConfig(
      `${configService.get('PROJECT_NAME')} Frontend  test check application API`,
      `The User API. <br><br> API endpoints for APIs. <br> <a  href="/apidoc/v1"> Admin panel API-Doc </a> <br><br> 📥 OpenAPI JSON (Postman): <code>${configService.get('BACKEND_URL')}apidoc/v1/user/openapi.json</code>`,
    )


    const document = SwaggerModule.createDocument(app, configApi)

    SwaggerModule.setup(
      'apidoc/v1/user',
      app,
      {
        ...document,
        paths: Object.fromEntries(
          Object.entries(document.paths).filter(
            ([key]) =>
              !key.includes('admin') || (key.includes('auth') && !key.includes('login-admin') && !key.includes('logout-admin'))
          )
        )
      },
      {
        swaggerOptions: {
          defaultModelsExpandDepth: -1, // Hides the Schemas section
        },
        jsonDocumentUrl: 'apidoc/v1/user/openapi.json',
      },
    )
  }


  await app.listen(process.env.PORT ?? 3200, () => {
    logger.debug(`[${configService.get('PROJECT_NAME')} | ${configService.get('NODE_ENV')}] is running: http://127.0.0.1:${configService.get('PORT')}/apidoc/v1`)
  });
}
bootstrap();
