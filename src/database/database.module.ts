import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { WinstonLoggerService } from '../logger/logger.service';
import { DatabaseService } from './database.service';

@Module({
  providers: [
    {
      provide: 'PG_POOL',
      inject: [ConfigService, WinstonLoggerService],
      useFactory: async (
        configService: ConfigService,
        logger: WinstonLoggerService,
      ) => {
        const dbConfig = {
          host: configService.get<string>('config.database.host'),
          port: configService.get<number>('config.database.port'),
          user: configService.get<string>('config.database.user'),
          password: configService.get<string>('config.database.password'),
          database: configService.get<string>('config.database.name'),
        };

        const pool = new Pool({
          ...dbConfig,
          min: 5,
          max:
            configService.get<number>('config.database.maxConnections') || 50,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });

        pool.on('error', (err: Error) => {
          logger.error(
            'Unexpected error on idle PostgreSQL client',
            err.stack,
            'DatabasePool',
          );
        });

        try {
          const client = await pool.connect();
          client.release();
          logger.log(
            `Successfully eager-loaded PostgreSQL pool!`,
            'DatabaseModule',
          );
        } catch (error: unknown) {
          const stack = error instanceof Error ? error.stack : undefined;

          logger.error(
            'FATAL: Failed to connect to PostgreSQL database. Exiting application...',
            stack,
            'DatabaseModule',
          );

          pool.end().catch(() => {});

          process.exit(1);
        }

        return pool;
      },
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
