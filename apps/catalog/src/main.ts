import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module.js';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'catalog';

  const logger = new Logger('Catalog');
  const port = Number(process.env.CATALOG_PORT) || 4011;

  //miscroservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
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
  logger.log(`Catalog microservice (TCP)is running on: ${port}`);
}
await bootstrap();
