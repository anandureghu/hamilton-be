import { Controller, Get, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import configuration from './config/configuration';
import { WinstonLoggerService } from './logger/logger.service';
@Controller()
export class AppController {
  constructor(
    private readonly logger: WinstonLoggerService,
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
  ) {
    this.logger.setContext(AppController.name);
  }

  @Get()
  check() {
    try {
      const name = this.config.project;
      return `Hello from ${name}`;
    } catch (error: unknown) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error('Failed to load welcome message', stack);
      throw error;
    }
  }
}
