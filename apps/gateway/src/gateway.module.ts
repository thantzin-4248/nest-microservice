import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller.js';
import { GatewayService } from './gateway.service.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { ProductHttpController } from './products/products.controller.js';
import { SearchHttpController } from './search/search.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // connect our gateway with mongo user
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI_USER') ??
          configService.get<string>('MONGODB_URI') ??
          'mongodb://localhost:27017/nest',
      }),
    }),
    AuthModule,
    ClientsModule.register([
      {
        name: 'CATALOG_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.CATALOG_QUEUE ?? 'catalog_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'MEDIA_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.MEDIA_QUEUE ?? 'media_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'SEARCH_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.SEARCH_QUEUE ?? 'search_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [GatewayController,ProductHttpController,SearchHttpController],
  providers: [GatewayService],
})
export class GatewayModule {}
