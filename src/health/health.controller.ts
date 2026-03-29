import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { WinstonLoggerService } from '../logger/logger.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(HealthController.name);
  }

  @Get()
  async check() {
    try {
      await this.dbService.query('SELECT 1');

      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error('Health check failed: Database unreachable', stack);

      throw new HttpException(
        {
          status: 'error',
          database: 'disconnected',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
