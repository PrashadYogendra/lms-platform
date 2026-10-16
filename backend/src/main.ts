import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Security middleware - secure http headers
  app.use(helmet());

  app.use(
    cors({
      origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
      credentials: true,
    }),
  );

  // Logger middleware - har incoming request log karega
  app.use(morgan('combined'));

  // Global validation pipe - request body validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`Server listening on http://localhost:${port}/api`);
}

await bootstrap();