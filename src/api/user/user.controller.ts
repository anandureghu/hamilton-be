import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CurrentuserDto } from '../../auth/dto/current-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiPaginatedResponse } from '../../common/decorators/api-response.decorator';
import { IdParamsDto } from '../../common/dto/user-params.dto';
import { CreateUserVehicleDto } from './dto/add-vehicle-user.dto';
import { CreateBookingDto } from './dto/get-slot-booking-details.dto';
import { UserVehicleResponseDto } from './dto/get-users-vehicle-response.dto';
import { VehicleResponseDto } from './dto/get-vehicle-detail-by-id-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserVehicleDto } from './dto/update-vehicle-user.dto';
import { UserProfileResponseDto } from './dto/user-profile.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get current user profile (Self)' })
  @ApiPaginatedResponse(UserProfileResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMe(
    @CurrentUser() user: CurrentuserDto,
  ): Promise<UserProfileResponseDto> {
    return this.userService.findById(user.id);
  }

  @ApiOperation({ summary: 'Update current user profile(self)' })
  @ApiPaginatedResponse(UserProfileResponseDto)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateSelfProfile(
    @CurrentUser() user: CurrentuserDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.userService.update(user.id, updateUserDto);
  }

  @ApiOperation({ summary: 'Get users vehicle list by user id' })
  @ApiPaginatedResponse(UserVehicleResponseDto, true)
  @UseGuards(JwtAuthGuard)
  @Get('vehicle')
  async getUserVehicleDetailsList(
    @CurrentUser() params: CurrentuserDto,
  ): Promise<UserVehicleResponseDto[]> {
    return this.userService.getUserVehicleDetailsList(params.id);
  }

  @ApiOperation({ summary: 'Add vehicle to users profile' })
  @ApiBody({ type: CreateUserVehicleDto })
  @UseGuards(JwtAuthGuard)
  @Post('vehicle')
  async addUsersVehicleDetails(
    @Body() body: CreateUserVehicleDto,
    @CurrentUser() user: CurrentuserDto,
  ): Promise<any> {
    return this.userService.addVehicleToUserProfile(body, user.id);
  }

  @ApiOperation({ summary: 'update users vehicle details' })
  @ApiBody({ type: UpdateUserVehicleDto })
  @UseGuards(JwtAuthGuard)
  @Patch('vehicle/:id')
  async updateUsersVehicleDetails(
    @Param() param: IdParamsDto,
    @Body() body: UpdateUserVehicleDto,
    @CurrentUser() user: CurrentuserDto,
  ): Promise<any> {
    return this.userService.updateUsersVehicleDetails(param.id, body, user.id);
  }

  @ApiOperation({ summary: 'Get users vehicle detail by vehicle id' })
  @ApiPaginatedResponse(VehicleResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get('vehicle/:id')
  async getUserVehicleDetails(
    @Param() idParam: IdParamsDto,
    @CurrentUser() params: CurrentuserDto,
  ): Promise<VehicleResponseDto> {
    return this.userService.getUserVehicleDetailsById(params.id, idParam.id);
  }

  @ApiOperation({ summary: 'Get users booking details' })
  @ApiPaginatedResponse(CreateBookingDto, true)
  @UseGuards(JwtAuthGuard)
  @Get('booking')
  async getUserBookingDetails(
    @CurrentUser() user: CurrentuserDto,
  ): Promise<CreateBookingDto[]> {
    return this.userService.getUserBookingDetails(user.id);
  }
}
