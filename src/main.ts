
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger/swagger.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enforce DTO validation: strip/reject unknown fields and convert types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Generate Swagger document
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Setup Swagger UI
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
