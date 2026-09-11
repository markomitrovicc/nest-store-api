import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(userId: string) {
    const cart = await this.cartModel.findOne({ userId }).exec();

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty.');
    }

    const orderItems: Array<{
      productId: Types.ObjectId;
      productName: string;
      price: number;
      quantity: number;
      subtotal: number;
    }> = [];

    for (const cartItem of cart.items) {
      const product = await this.productModel
        .findById(cartItem.productId)
        .exec();

      if (!product) {
        throw new NotFoundException(
          `Product with id ${cartItem.productId} not found`,
        );
      }

      if (cartItem.quantity > product.stock) {
        throw new ConflictException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}`,
        );
      }

      orderItems.push({
        productId: cartItem.productId,
        productName: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        subtotal: product.price * cartItem.quantity,
      });
    }

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const order = new this.orderModel({
      userId,
      items: orderItems,
      total,
      status: 'pending',
    });

    await order.save();

    for (const item of orderItems) {
      const product = await this.productModel.findById(item.productId).exec();

      if (!product) {
        throw new NotFoundException(
          `Product with id ${item.productId} not found during stock update`,
        );
      }

      product.stock -= item.quantity;
      await product.save();
    }

    cart.items = [];
    await cart.save();

    return order;
  }

  async findAllByUser(userId: string) {
    const orders = await this.orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    return orders;
  }

  async findOneByUser(orderId: string, userId: string) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('Invalid order id');
    }

    const order = await this.orderModel
      .findOne({ _id: orderId, userId })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
