import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsMongoId, IsNotEmpty, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({
    description: 'Product id to add to the cart',
    example: '64f2e4b1e4a4c5a2d8f9c123',
  })
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @ApiProperty({
    description: 'Quantity to add',
    example: 2,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
