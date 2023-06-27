import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cart, CartDocument } from "./cart-item.schema";
import { CreateCartDto } from "./dto/create-cart.dto";

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private cartRepository: Model<CartDocument>) {
    }

    //поиск корзины определенного юзера по id
    private async findCartById(userId: string) {
        return this.cartRepository.findOne({ userId });
    }

    //добавить в корзину юзера товар
    async addToCart(userId: string, dto: CreateCartDto) {
        const cart = await this.findCartById(userId);
        if (cart) {
            const existingItem = cart.items.find((item) => item.productId === dto.productId);
            if (existingItem) {
                throw new HttpException('Продукт уже находится в корзине', HttpStatus.BAD_REQUEST);
            } else {
                cart.items.push({
                    productId: dto.productId,
                    quantity: dto.quantity,
                    totalPrice: dto.totalPrice,
                    size: dto.size
                });
                await cart.save();
            }
        } else {
            const newCart = new this.cartRepository({
                userId,
                items: [
                    {
                        productId: dto.productId,
                        quantity: dto.quantity,
                        totalPrice: dto.totalPrice,
                        isCart: true,
                        isFavorite: dto.isFavorite,
                    },
                ],
            });
            await newCart.save();
        }
    }

    // Удалить товар из корзины юзера
    async removeFromCart(userId: string, productId: string) {
        const cart = await this.findCartById(userId);
        if (!cart) {
            throw new HttpException(
                "Корзина пользователя не найдена",
                HttpStatus.NOT_FOUND
            );
        }

        const itemIndex = cart.items.findIndex(
            (item) => {
                item.productId === productId
            }
        );
        if (itemIndex === -1) {
            throw new HttpException(
                "Товар не найден в корзине",
                HttpStatus.NOT_FOUND
            );
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
    }

    async getCartProducts(userId: string) {
        const favorites = await this.findCartById(userId);
        
        if (!favorites) {
          return []; // Return an empty array if no favorites found
        }
        
        return favorites.items;
      }
}
