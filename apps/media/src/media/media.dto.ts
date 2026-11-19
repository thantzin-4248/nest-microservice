import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UploadProductImageDto {
  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;

  @IsString()
  base64: string;

  @IsString()
  @IsOptional()
  uploadByUserId?: string;
}

export class AttachToProductDto {
  @IsString()
  mediaId: string;

  @IsString()
  productId: string;

  @IsString()
  @IsOptional()
  attachedByUserId?: string;
}
