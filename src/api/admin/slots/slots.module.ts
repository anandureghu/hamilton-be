import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { SlotsAdminController } from './slots.controller';
import { SlotsAdminService } from './slots.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SlotsAdminController],
  providers: [SlotsAdminService],
})
export class SlotsAdminModule {}
