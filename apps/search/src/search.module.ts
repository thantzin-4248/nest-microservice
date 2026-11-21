import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchController } from './search.controller.js';
import { SearchService } from './search.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchProduct, SearchProductSchema } from './search/search-index.schema.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI_SEARCH as string),

    MongooseModule.forFeature([{
      name: SearchProduct.name,
      schema: SearchProductSchema
    }])
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
