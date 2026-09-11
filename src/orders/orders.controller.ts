import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an order from the current authenticated user cart',
  })
  create(@Session() session: UserSession) {
    return this.ordersService.create(session.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all orders for the current authenticated user',
  })
  findAll(@Session() session: UserSession) {
    return this.ordersService.findAllByUser(session.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one order for the current authenticated user' })
  findOne(@Session() session: UserSession, @Param('id') id: string) {
    return this.ordersService.findOneByUser(id, session.user.id);
  }
}
