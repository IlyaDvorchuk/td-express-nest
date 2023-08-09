import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cart, CartDocument } from "./cart-item.schema";
import { CreateCartDto } from "./dto/create-cart.dto";
import { ProductCardService } from "../productCard/productCard.service";

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private cartRepository: Model<CartDocument>,
                private productCardService: ProductCardService) {
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
                        isCart: true,
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
        const cart = await this.findCartById(userId);

        if (!cart) {
            return []; // Return an empty array if no favorites found
        }

        return cart.items;
    }

    async getCartProductsWithPrices(userId: string) {
        const cart = await this.findCartById(userId);
        if (!cart) {
            return []; // Return an empty array if no cart found
        }

        const cartItemsWithPrices = await Promise.all(cart.items.map(async (item) => {
            const productCard = await this.productCardService.getProductCardById(item.productId);

            if (!productCard) {
                return null; // Handle the case where productCard is not found
            }

            console.log('item', item);
            console.log('productCard.pricesAndQuantity', productCard.pricesAndQuantity);

            const answer = {
                productId: item.productId,
                quantity: item.quantity,
                name: productCard.information.name,
                price: productCard.pricesAndQuantity,
                mainPhoto: productCard.mainPhoto,
                size: undefined
            }
            if (item.size) answer.size = item.size
            return answer;
        }));

        console.log('cartItemsWithPrices', cartItemsWithPrices);

        return cartItemsWithPrices.filter(item => item !== null);
    }

}
