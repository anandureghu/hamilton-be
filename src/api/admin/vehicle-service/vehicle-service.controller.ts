import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../auth/enums/role.enum';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { DateParamDto } from '../../../common/dto/date-param.dto';
import { VehicleServiceAdminService } from './vehicle-service.service';

@ApiTags('Admin/Vehicle-service')
@ApiBearerAuth('JWT-auth')
@Controller('admin/service')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
export class VehicleServiceAdminController {
  constructor(
    private readonly vehicleServiceAdminService: VehicleServiceAdminService,
  ) {}

  @ApiOperation({ summary: '' })
  // @ApiPaginatedResponse(BookingDto, true)
  @Get('bookings')
  async getAllBookings(@Query() param: DateParamDto): Promise<any> {
    return this.vehicleServiceAdminService.getAllBookings(param.date);
  }
}
