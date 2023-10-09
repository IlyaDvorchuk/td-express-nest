import { NestMiddleware } from '@nestjs/common';
import * as uuid from 'uuid'

export class ProductIdMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const productId = uuid.v4();
    req.productId = productId;
    next();
  }
}
