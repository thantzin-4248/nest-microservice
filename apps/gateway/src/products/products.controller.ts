import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
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
  ) {}

  @Post('products')
  async createProduct(
    @CurrentUser() user: UserContext,
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      status?: string;
      imageUrl?: string;
    },
  ) {
    let product: Product;

    const payload = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      status: body.status,
      imageUrl: '',
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
    return product;
  }

  @Get('products')
  @Public()
  async listProducts(){
    try {
        return await firstValueFrom(this.catalogClient.send('product.list',{}))
    } catch (error) {
        mapRpcErrorToHttp(error);
    }
  }

  @Get('products/:id')
  @Public()
  async getProduct(@Param('id') id: string ){
    try {
        return await firstValueFrom(this.catalogClient.send('product.getById',{id}))
    } catch (error) {
        mapRpcErrorToHttp(error);
    }
  }
}
