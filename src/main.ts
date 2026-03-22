import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './logger/logger.service';

async function bootstrap() {
  const logger = new WinstonLoggerService();
  const app = await NestFactory.create(AppModule, { logger: logger });
  const config = app.get(ConfigService);

  // FIXED 1 & 2: Added <number> so TypeScript knows this isn't 'any'
  const port = config.get<number>('config.port');

  // Now perfectly safe because port is strictly number | undefined
  await app.listen(port ?? 3001);

  // Updated to dynamically log the actual port being used
  logger.log(
    `Application started successfully on port http://localhost:${port ?? 3001}`,
    'Bootstrap',
  );
}

// FIXED 3: Catch the floating promise to satisfy the strict linter
bootstrap().catch((error: unknown) => {
  const stack = error instanceof Error ? error.stack : undefined;
  console.error('Failed to start application:', stack || error);
  process.exit(1);
});
