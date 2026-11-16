import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { GatewayModule } from './gateway.module.js';

async function bootstrap() {
  process.title = 'gateway';

  const logger = new Logger('Gateway');
  const app = await NestFactory.create(GatewayModule);
  app.enableShutdownHooks();

  const port = Number(process.env.GATEWAY_PORT) || 3000;
  await app.listen(port);

  logger.log(`Gateway is running on: ${port}`);
}
await bootstrap();
