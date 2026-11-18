import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module.js';
import { INestMicroservice, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'catalog';

  const logger = new Logger('Catalog');
  //const port = Number(process.env.CATALOG_PORT) || 4011;

  const rmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

  const queue = process.env.CATALOG_QUEUE ?? 'catalog_queue';
  //miscroservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  applyToMiscroserviceLayer(app);
  
  app.enableShutdownHooks();
  await app.listen();
  logger.log(`Catalog RMQ listening on queue: ${queue} via ${rmqUrl}`);
}
await bootstrap();
function applyToMiscroserviceLayer(app: INestMicroservice) {
  throw new Error('Function not implemented.');
}

