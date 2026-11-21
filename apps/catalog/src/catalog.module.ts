import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatalogController } from './catalog.controller.js';
import { CatalogService } from './catalog.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './products/product.schema.js';
import { ProductController } from './products/products.controller.js';
import { ProductService } from './products/products.service.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductEventsPublisher } from './events/product-events.publisher.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI_CATALOG as string),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),

    //catalog talks directly to search via RMQ client(not via gateway)
    ClientsModule.register([
      {
        name: 'SEARCH_EVENT_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amq://localhost:5672'],
          queue: process.env.SEARCH_QUEUE ?? 'search_queue',
          queueOptions: {durable: false}
        },
      },
    ]),
  ],
  controllers: [CatalogController, ProductController],
  providers: [CatalogService, ProductService, ProductEventsPublisher],
})
export class CatalogModule {}
