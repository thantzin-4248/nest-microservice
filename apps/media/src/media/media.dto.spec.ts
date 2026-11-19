import { ValidationPipe } from '@nestjs/common';
import { AttachToProductDto } from './media.dto.js';

describe('AttachToProductDto', () => {
  it('accepts the gateway attach-to-product payload', async () => {
    const payload = {
      mediaId: 'media-1',
      productId: 'product-1',
      attachedByUserId: 'user-1',
    };
    const pipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    await expect(
      pipe.transform(payload, {
        type: 'body',
        metatype: AttachToProductDto,
        data: '',
      }),
    ).resolves.toMatchObject(payload);
  });
});
