import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'oracle',
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        connectString: `${configService.get<string>('DB_HOST')}:${configService.get<string>('DB_PORT')}/${configService.get<string>('DB_SERVICE')}`,
        entities: [],
        synchronize: false, // Disabled for migrations
        logging: true, // Shows SQL queries in console
        dropSchema: false, // Does NOT delete existing tables
        autoLoadEntities: true, // Loads entities automatically
        migrations: ['dist/migrations/*.js'], // Migration files
        migrationsRun: false, // Don't run migrations automatically
        // Oracle-specific configuration
        extra: {
          // Additional Oracle configuration
          poolMin: 0,
          poolMax: 10,
          poolIncrement: 1,
          // Connection retry settings
          connectTimeout: 30000, // 30 seconds
          acquireTimeout: 30000, // 30 seconds
          timeout: 30000, // 30 seconds
        },
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
