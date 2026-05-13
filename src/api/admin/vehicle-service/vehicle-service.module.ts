import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { VehicleServiceAdminController } from './vehicle-service.controller';
import { VehicleServiceAdminService } from './vehicle-service.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VehicleServiceAdminController],
  providers: [VehicleServiceAdminService],
})
export class VehicleServiceAdminModule {}
