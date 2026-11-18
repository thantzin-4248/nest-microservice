import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatalogController } from './catalog.controller.js';
import { CatalogService } from './catalog.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './products/product.schema.js';
import { ProductController } from './products/products.controller.js';
import { ProductService } from './products/products.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI_CATALOG as string),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [CatalogController,ProductController],
  providers: [CatalogService, ProductService],
})
export class CatalogModule {}
