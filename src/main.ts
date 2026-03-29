import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { WinstonLoggerService } from './logger/logger.service';

async function bootstrap() {
  const logger = new WinstonLoggerService();
  const app = await NestFactory.create(AppModule, { logger: logger });
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  const configSwagger = new DocumentBuilder()
    .setTitle('Hamilton API')
    .setDescription('The core authentication and user management API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, document);
  const port = config.get<number>('config.port');

  await app.listen(port ?? 3001);

  logger.log(
    `Application started successfully on port http://localhost:${port ?? 3001}`,
    'Bootstrap',
  );
}

bootstrap().catch((error: unknown) => {
  const stack = error instanceof Error ? error.stack : undefined;
  console.error('Failed to start application:', stack || error);
  process.exit(1);
});
