import { Controller } from '@nestjs/common';
import { ProductService } from './products.service.js';
import { CreateProductDto, GetProductByIdDto } from './product.dto.js';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

@MessagePattern('product.create')
  create(@Payload() payload: CreateProductDto){
    return this.productsService.createNewProduct(payload);
  }

  @MessagePattern('product.list')
  list(){
    return this.productsService.listProcucts();
  }

  @MessagePattern('product.getById')
  GetById(@Payload()  payload : GetProductByIdDto ){
    return this.productsService.getProductById(payload);
  }
}
