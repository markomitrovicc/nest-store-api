import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Cart, CartDocument, CartItem } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId }).lean().exec();

    if (!cart) {
      return {
        items: [],
        total: 0,
      };
    }

    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productModel.findById(item.productId).exec();

        if (!product) {
          throw new NotFoundException(
            `Product with id ${item.productId} was not found`,
          );
        }

        const subtotal = product.price * item.quantity;

        return {
          product: {
            id: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
          },
          quantity: item.quantity,
          subtotal,
        };
      }),
    );

    const total = itemsWithProducts.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    return {
      items: itemsWithProducts,
      total,
    };
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    if (!Types.ObjectId.isValid(dto.productId)) {
      throw new BadRequestException('Invalid product id');
    }

    const product = await this.productModel.findById(dto.productId).exec();

    if (!product) {
      throw new NotFoundException(`Product with id ${dto.productId} not found`);
    }

    if (dto.quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    if (dto.quantity > product.stock) {
      throw new ConflictException(
        `Only ${product.stock} item(s) available in stock for this product`,
      );
    }

    let cart = await this.cartModel.findOne({ userId }).exec();

    if (!cart) {
      cart = new this.cartModel({
        userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === dto.productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;

      if (newQuantity > product.stock) {
        throw new ConflictException(
          `Only ${product.stock} item(s) available in stock for this product`,
        );
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(dto.productId),
        quantity: dto.quantity,
      } as CartItem);
    }

    await cart.save();

    return this.getCart(userId);
  }

  async updateItem(userId: string, productId: string, dto: UpdateCartItemDto) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product id');
    }

    if (dto.quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const cart = await this.cartModel.findOne({ userId }).exec();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = cart.items.find(
      (cartItem) => cartItem.productId.toString() === productId,
    );

    if (!item) {
      throw new NotFoundException(
        `Product with id ${productId} not found in cart`,
      );
    }

    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    if (dto.quantity > product.stock) {
      throw new ConflictException(
        `Only ${product.stock} item(s) available in stock for this product`,
      );
    }

    item.quantity = dto.quantity;
    await cart.save();

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product id');
    }

    const cart = await this.cartModel.findOne({ userId }).exec();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (existingItemIndex === -1) {
      throw new NotFoundException(
        `Product with id ${productId} not found in cart`,
      );
    }

    cart.items.splice(existingItemIndex, 1);
    await cart.save();

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId }).exec();

    if (!cart) {
      return { items: [], total: 0 };
    }

    cart.items = [];
    await cart.save();

    return { items: [], total: 0 };
  }
}
