import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SearchProduct,
  SearchProductDocument,
} from './search/search-index.schema.js';
import { Model } from 'mongoose';

const DEFAULT_QUERY_LIMIT = 20;
const MAX_QUERY_LIMIT = 100;

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(SearchProduct.name)
    private readonly model: Model<SearchProductDocument>,
  ) {}

  normalizeText(input: { name: string; description: string }) {
    return `${input.name} ${input.description}`.toLowerCase();
  }

  async upsertFromCatalogEvent(input: {
    productId: string;
    name: string;
    description: string;
    status: 'DRAFT' | 'ACTIVE';
    price: number;
  }) {
    const normalizedText = this.normalizeText({
      name: input.name,
      description: input.description,
    });

    await this.model.findOneAndUpdate({
      productId: input.productId
    },{
      $set: {
        name: input.name,
        normalizedText,
        status: input.status,
        price: input.price,
      },
      $setOnInsert: {
        productId: input.productId,
      }
    },{
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
  }

  async query(input: { q: string; limit?: number }) {
    const query = input.q.trim().toLowerCase();
    if (!query) {
      return [];
    }

    const requestedLimit = input.limit ?? DEFAULT_QUERY_LIMIT;
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(Math.floor(requestedLimit), 1), MAX_QUERY_LIMIT)
      : DEFAULT_QUERY_LIMIT;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return this.model
      .find({
        status: 'ACTIVE',
        normalizedText: { $regex: escapedQuery },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  ping() {
    return {
      ok: true,
      service: 'search',
      now: new Date().toISOString(),
    };
  }
}
