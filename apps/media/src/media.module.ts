import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './media/media.schema.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI_MEDIA as string),
    MongooseModule.forFeature([{name: Media.name, schema: MediaSchema}])
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
