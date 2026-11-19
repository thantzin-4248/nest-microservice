import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module.js';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { applyToMicroserviceLayer } from '@app/rpc';


async function bootstrap() {
  process.title = 'media';

  const logger = new Logger('Media');
  //const port = Number(process.env.MEDIA_PORT) || 4012;
  const rmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

  const queue = process.env.MEDIA_QUEUE ?? 'media_queue';
  //miscroservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
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
  logger.log(`Media RMQ listening on queue: ${queue} via ${rmqUrl}`);
}
await bootstrap();
