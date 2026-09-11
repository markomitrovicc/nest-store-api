import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './cart.service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current authenticated user cart' })
  getCart(@Session() session: UserSession) {
    return this.cartService.getCart(session.user.id);
  }

  @Post('items')
  @ApiOperation({
    summary: 'Add a product to the current authenticated user cart',
  })
  addItem(@Session() session: UserSession, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(session.user.id, dto);
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update quantity for a cart item' })
  updateItem(
    @Session() session: UserSession,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(session.user.id, productId, dto);
  }

  @Delete('items/:productId')
  @ApiOperation({
    summary: 'Remove a product from the current authenticated user cart',
  })
  removeItem(
    @Session() session: UserSession,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(session.user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the current authenticated user cart' })
  clearCart(@Session() session: UserSession) {
    return this.cartService.clearCart(session.user.id);
  }
}
