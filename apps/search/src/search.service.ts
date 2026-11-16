import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  getHello(): string {
    return 'Hello World!';
  }

  ping(){
    return{
      ok: true,
      service: 'catalog',
      now: new Date().toISOString()
    }
  }
}
