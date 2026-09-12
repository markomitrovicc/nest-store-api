import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  private readonly adminUserId = '6aa4ab58e2368e600b79c460';

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: Product,
  })
  @ApiBadRequestResponse({ description: 'Invalid product payload' })
  create(
    @Session() session: UserSession,
    @Body() createProductDto: CreateProductDto,
  ) {
    this.requireAdmin(session);

    return this.productsService.create(createProductDto);
  }

  @AllowAnonymous()
  @Get()
  @ApiOperation({
    summary: 'Get all products with search, filtering, and pagination',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @AllowAnonymous()
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the product' })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  @ApiBadRequestResponse({ description: 'Invalid product id' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by id' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiBadRequestResponse({
    description: 'Invalid product id or invalid update payload',
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    this.requireAdmin(session);

    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product by id' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the product' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid product id' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async remove(
    @Session() session: UserSession,
    @Param('id') id: string,
  ): Promise<void> {
    this.requireAdmin(session);

    await this.productsService.remove(id);
  }

  private requireAdmin(session: UserSession): void {
    if (session.user.id !== this.adminUserId) {
      throw new ForbiddenException('Only admin can manage products');
    }
  }
}
