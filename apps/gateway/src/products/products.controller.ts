import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { mapRpcErrorToHttp } from '@app/rpc';
import type { UserContext } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/current-user-decorator.js';
import { firstValueFrom } from 'rxjs';
import { Public } from '../auth/public.decorator.js';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  status: 'DRAFT' | 'ACTIVE';
  imageUrl: string | undefined;
  createdByClerkUserId: string | undefined;
};

@Controller()
export class ProductHttpController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,

    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) {}

  @Post('products')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async createProduct(
    @CurrentUser() user: UserContext,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      status?: string;
      imageUrl?: string;
    },
  ) {
    let imageUrl: string | undefined = undefined;
    let mediaId: string | undefined = undefined;

    if (file) {
      const base64 = file.buffer.toString('base64');

      try {
        const uploadResult = await firstValueFrom(
          this.mediaClient.send('media.uploadProductImage', {
            fileName: file.originalname,
            mimeType: file.mimetype,
            base64,
            uploadByUserId: user.clerkUserId,
          }),
        );

        imageUrl = uploadResult.url;
        mediaId = uploadResult.mediaId;
      } catch (error) {
        mapRpcErrorToHttp(error);
      }
    }

    let product: Product;

    const payload = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      status: body.status,
      imageUrl,
      createdByClerkUserId: user.clerkUserId,
    };

    // RMG request and response pattern
    try {
      product = await firstValueFrom(
        this.catalogClient.send('product.create', payload),
      );
    } catch (error) {
      mapRpcErrorToHttp(error);
    }

    if (mediaId) {
      try {
        await firstValueFrom(
          this.mediaClient.send('media.attachToProduct', {
            mediaId,
            productId: String(product._id),
            attachedByUserId: user.clerkUserId,
          }),
        );
      } catch (error) {
        mapRpcErrorToHttp(error);
      }
    }
    return product;
  }

  @Get('products')
  @Public()
  async listProducts() {
    try {
      return await firstValueFrom(this.catalogClient.send('product.list', {}));
    } catch (error) {
      mapRpcErrorToHttp(error);
    }
  }

  @Get('products/:id')
  @Public()
  async getProduct(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.catalogClient.send('product.getById', { id }),
      );
    } catch (error) {
      mapRpcErrorToHttp(error);
    }
  }
}
