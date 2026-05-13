import { ApiProperty } from "@nestjs/swagger";

export class BookSlotResponseDto {
  @ApiProperty({example:"c738ae72-a89c-488a-80b9-73f021981208", description:"Id of booked slot"})  
  id:string;
}
