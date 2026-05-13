import { ApiProperty } from '@nestjs/swagger';

class ServiceAvailabilityDto {
  @ApiProperty({
    description: 'The name of the service offered',
    example: 'oil change',
  })
  service_name!: string;

  @ApiProperty({
    description: 'Unique identifier for the service',
    example: '1454de58-a5e7-4c92-ad48-c63f30fbb7e6',
  })
  service_id!: string;

  @ApiProperty({
    description: 'The total number of cars that can be handled',
    example: 3,
  })
  total_capacity!: number;

  @ApiProperty({
    description: 'The number of slots currently remaining',
    example: 3,
  })
  available_slot!: number;
}

export class SlotTimingDto {
  @ApiProperty({
    description: 'The start time for the appointment slot',
    example: '08:00',
  })
  slot_timing!: string;

  @ApiProperty({
    description: 'Unique identifier for the time slot',
    example: 'f7d3e709-ca28-4e19-b7ba-1b77322256b0',
  })
  slot_id!: string;

  @ApiProperty({
    type: [ServiceAvailabilityDto],
    description: 'List of services and their availability for this time slot',
  })
  service_availability!: ServiceAvailabilityDto[];
}
