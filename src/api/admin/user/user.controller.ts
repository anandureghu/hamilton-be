import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { CurrentuserDto } from '../../../auth/dto/current-user.dto';
import { Role } from '../../../auth/enums/role.enum';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { ApiPaginatedResponse } from '../../../common/decorators/api-response.decorator';
import { IdParamsDto } from '../../../common/dto/user-params.dto';
import { AddUserDto } from './dto/add-customer.dto';
import { CreateUserVehicleDto } from './dto/add-vehicle-user.dto';
import { UserVehicleResponseDto } from './dto/get-users-vehicle-response.dto';
import {
  SearchUserWithMobNo,
  UserVehicleDetailsResponseDto,
} from './dto/mobile-no.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserVehicleDto } from './dto/update-vehicle-user.dto';
import { UserProfileResponseDto } from './dto/user-profile.dto';
import { UserService } from './user.service';

@ApiTags('Admin user')
@ApiBearerAuth('JWT-auth')
@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'search user by mobile no' })
  @ApiPaginatedResponse(UserVehicleDetailsResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Get('search')
  async searchUserByMobileNo(
    @Query() params: SearchUserWithMobNo,
  ): Promise<UserVehicleDetailsResponseDto> {
    return this.userService.findUserDetailByMobNo(params.mob);
  }

  @ApiOperation({ summary: 'Get current user profile by id' })
  @ApiPaginatedResponse(UserProfileResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Get(':id')
  async getUserById(
    @Param() params: IdParamsDto,
  ): Promise<UserProfileResponseDto> {
    return this.userService.findById(params.id);
  }

  @ApiOperation({ summary: 'Update user profile by user id' })
  @ApiPaginatedResponse(UserProfileResponseDto)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Patch(':id')
  async updateUserProfile(
    @Param() params: IdParamsDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.userService.update(params.id, updateUserDto);
  }

  @ApiOperation({ summary: 'Soft delete user by id' })
  @ApiPaginatedResponse(UserProfileResponseDto)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Delete(':id')
  async softDeleteUserById(
    @Param() params: IdParamsDto,
    @CurrentUser() user: CurrentuserDto,
  ): Promise<UserProfileResponseDto> {
    return this.userService.softDeleteUserById(params.id, user.id);
  }

  @ApiOperation({ summary: 'Get users vehicle list by user id' })
  @ApiPaginatedResponse(UserVehicleResponseDto, true)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Get(':id/vehicle')
  async getUserVehicleDetails(
    @Param() params: IdParamsDto,
  ): Promise<UserVehicleResponseDto[]> {
    return this.userService.getUserVehicleDetails(params.id);
  }

  @ApiOperation({ summary: 'Add vehicle to users profile' })
  @ApiBody({ type: CreateUserVehicleDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Post('vehicle/:id')
  async addUsersVehicleDetails(
    @Param() param: IdParamsDto,
    @Body() body: CreateUserVehicleDto,
    @CurrentUser() user: CurrentuserDto,
  ): Promise<any> {
    return this.userService.addVehicleToUserProfile(param.id, body, user.id);
  }

  @ApiOperation({ summary: 'update users vehicle details' })
  @ApiBody({ type: UpdateUserVehicleDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Patch('vehicle/:id')
  async updateUsersVehicleDetails(
    @Param() param: IdParamsDto,
    @Body() body: UpdateUserVehicleDto,
    @CurrentUser() user: CurrentuserDto,
  ): Promise<any> {
    return this.userService.updateUsersVehicleDetails(param.id, body, user.id);
  }

  @ApiOperation({ summary: 'Add customer' })
  @ApiPaginatedResponse(UserProfileResponseDto)
  @ApiBody({ type: AddUserDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Post('customer')
  async addCustomer(
    @CurrentUser() currentUser: CurrentuserDto,
    @Body() body: AddUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.userService.addCustomer(body, currentUser.id);
  }
}
