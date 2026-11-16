import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module.js';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'search';

  const logger = new Logger('Search');
  const port = Number(process.env.SEARCH_PORT) || 4013;

  //miscroservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: port,
      },
    },
  );

  app.enableShutdownHooks();
  await app.listen();
  logger.log(`Search microservice (TCP)is running on: ${port}`);
}
await bootstrap();
