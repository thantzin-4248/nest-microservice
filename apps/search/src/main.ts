import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module.js';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { applyToMicroserviceLayer } from '@app/rpc';

async function bootstrap() {
  process.title = 'search';

  const logger = new Logger('Search');
  //const port = Number(process.env.SEARCH_PORT) || 4013;
  const rmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

  const queue = process.env.SEARCH_QUEUE ?? 'search_queue';
  //miscroservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
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

  applyToMicroserviceLayer(app);

  app.enableShutdownHooks();
  await app.listen();
  logger.log(`Search RMQ listening on queue: ${queue} via ${rmqUrl}`);
}
await bootstrap();
