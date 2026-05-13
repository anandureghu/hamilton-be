import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SlotsAdminModule } from './api/admin/slots/slots.module';
import { UserAdminModule } from './api/admin/user/user.module';
import { VehicleServiceAdminModule } from './api/admin/vehicle-service/vehicle-service.module';
import { BrandModule } from './api/brand/brand.module';
import { SlotsModule } from './api/slots/slot.module';
import { UserModule } from './api/user/user.module';
import { VehicleModule } from './api/vehicle/vehicle.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';
import configuration from './config/configuration';
import validationSchema from './config/validation';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    LoggerModule,
    HealthModule,
    AuthModule,
    UserModule,
    BrandModule,
    VehicleModule,
    UserAdminModule,
    SlotsModule,
    SlotsAdminModule,
    VehicleServiceAdminModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
