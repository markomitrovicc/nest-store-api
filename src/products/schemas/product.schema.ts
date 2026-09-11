import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 150 })
  name: string;

  @Prop({ required: true, trim: true, maxlength: 2000 })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: false, trim: true, validate: {
    validator: (value: string) => !value || /^https?:\/\/.+/i.test(value),
    message: 'imageUrl must be a valid URL',
  } })
  imageUrl?: string;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({ required: false, trim: true })
  brand?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });
