declare global {
  namespace Express {
    interface Request {
      productId?: string;
    }
  }
}




