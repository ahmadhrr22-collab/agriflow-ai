import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

let server: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  if (!server) {
    server = await bootstrap();
  }
  if (req.url === '/' || req.url === '') {
    return res.status(200).json({
      status: 'ok',
      service: 'AgriFlow AI API',
      version: '1.0.0',
      endpoints: '/api/v1',
    });
  }
  server(req, res);
}
