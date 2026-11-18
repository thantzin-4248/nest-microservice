import type { productStatus } from './product.schema.js';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  status?: productStatus;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  createdByClerkUserId: string;
}

export class GetProductByIdDto {
  @IsString()
  id: string;
}
