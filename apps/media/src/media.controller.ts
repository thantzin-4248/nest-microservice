import { Controller, Get } from '@nestjs/common';
import { MediaService } from './media.service.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttachToProductDto, UploadProductImageDto } from './media/media.dto.js';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('media.uploadProductImage')
  uploadProductImage(@Payload() payload : UploadProductImageDto){
    return this.mediaService.uploadProductImage(payload);
  }

  @MessagePattern('media.attachToProduct')
  attachToProduct(@Payload() payload: AttachToProductDto){
    return this.mediaService.attachToProduct(payload);
  }

  @MessagePattern('service.ping')
  ping(){
    return this.mediaService.ping();
  }
}
