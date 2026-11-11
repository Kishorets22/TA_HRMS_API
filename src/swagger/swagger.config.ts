import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('TA HRMS API')
  .setVersion('1.0')
  .build();