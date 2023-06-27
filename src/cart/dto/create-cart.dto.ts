export class CreateCartDto {
  productId: string;
  quantity: number;
  totalPrice: number;
  isFavorite: boolean;
  size?: string;
}