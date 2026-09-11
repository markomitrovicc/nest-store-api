import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    example: 'shipped',
    enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
  })
  @IsNotEmpty()
  @IsIn(['pending', 'processing', 'shipped', 'completed', 'cancelled'])
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
}
