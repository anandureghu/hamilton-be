import { ApiProperty } from '@nestjs/swagger';

class SlotDto {
  @ApiProperty({ example: 'f7d3e709-ca28-4e19-b7ba-1b77322256b0' })
  id: string;

  @ApiProperty({ example: '08:00', description: '24-hour format timing' })
  slot_timing: string;
}

class ServiceDetailDto {
  @ApiProperty({ example: 'c738ae72-a89c-488a-80b9-73f021981208' })
  id: string;

  @ApiProperty({ example: 'brake pad service' })
  service_name: string;
}

class VehicleDetailDto {
  @ApiProperty({ example: '3828650b-ce35-4a1c-b85a-d7d11ce64c57' })
  id: string;

  @ApiProperty({ example: 'KL-08Masd' })
  license_plate: string;

  @ApiProperty({ example: 10001, description: 'Current odometer reading' })
  odo_reading: number;
}

export class CreateBookingDto {
  @ApiProperty({
    example: 'f64c85d4-81b2-4174-a355-b5e63aacb5f2',
    description: 'Unique identifier for the booking',
  })
  id: string;

  @ApiProperty({ example: '2026-05-13', description: 'ISO 8601 date format' })
  booking_date: string;

  @ApiProperty({ type: () => SlotDto })
  slot: SlotDto;

  @ApiProperty({ example: 'just normal service' })
  description: string;

  @ApiProperty({
    example: 'confirmed',
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
  })
  status: string;

  @ApiProperty({
    type: () => ServiceDetailDto,
    description: 'Nested service metadata',
  })
  json_build_object: ServiceDetailDto;

  @ApiProperty({ type: () => VehicleDetailDto })
  vehicle_detail: VehicleDetailDto;
}
