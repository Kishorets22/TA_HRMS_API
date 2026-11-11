
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { createTypeOrmConfig } from './typeorm.config.js';

const logger = new Logger('DatabaseModule');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const get = (key: string) =>
          configService.get<string>(key);

        logger.log(
          `Connecting to PostgreSQL database: ${get('DB_NAME')} ` +
          `at ${get('DB_HOST')}:${get('DB_PORT') ?? 5432}`,
        );
        logger.log(`DB_SYNCHRONIZE: ${get('DB_SYNCHRONIZE')}`);
        return createTypeOrmConfig(get);
      },
    }),
  ],
})
export class DatabaseModule {}