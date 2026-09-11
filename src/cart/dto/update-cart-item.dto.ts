import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Updated quantity for the cart item',
    example: 3,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
