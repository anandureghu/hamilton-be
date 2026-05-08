import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CurrentuserDto } from '../../auth/dto/current-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiPaginatedResponse } from '../../common/decorators/api-response.decorator';
import { BookSlotResponseDto } from './dto/book-slot-response.dto';
import { GetAllSlotQueryDto } from './dto/get-all-slots-query.dto';
import { SlotTimingDto } from './dto/get-all-slots.dto';
import { SlotBookingBodyDto } from './dto/slot-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { SlotService } from './slot.service';

@ApiTags('Slots')
@ApiBearerAuth('JWT-auth')
@Controller('slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @ApiOperation({ summary: 'Get all available slots' })
  @ApiPaginatedResponse(SlotTimingDto, true)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllBrand(
    @Query() params: GetAllSlotQueryDto,
  ): Promise<SlotTimingDto[]> {
    return this.slotService.getAllAvailableSlots(params.date);
  }

  @ApiOperation({ summary: 'Book service slot' })
  @ApiPaginatedResponse(BookSlotResponseDto, true)
  @UseGuards(JwtAuthGuard)
  @Post()
  async bookSlot(
    @CurrentUser() user: CurrentuserDto,
    @Body() data: SlotBookingBodyDto,
  ): Promise<BookSlotResponseDto[]> {
    return this.slotService.bookSlot(data, user.id);
  }

  @ApiOperation({ summary: 'Update booked slot' })
  @ApiPaginatedResponse(BookSlotResponseDto)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateBookedSlot(
    @Param('id') param: string,
    @CurrentUser() user: CurrentuserDto,
    @Body() data: Partial<UpdateBookingDto>,
  ): Promise<BookSlotResponseDto> {
    return this.slotService.updateBookedSlot(param, data, user.id);
  }
}
