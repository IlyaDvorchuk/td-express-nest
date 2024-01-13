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
            const existingItem = cart.items.find((item) => {
                if (item.productId.toString() === dto.productId) {
                    return item.typeId.toString() === dto.typeId;
                }
                return false;
            });
            if (existingItem) {
                throw new HttpException('Продукт уже находится в корзине', HttpStatus.BAD_REQUEST);
            } else {
                cart.items.push({
                    productId: dto.productId,
                    quantity: dto.quantity,
                    size: dto?.size,
                    typeId: dto.typeId,
                    color: dto?.color,
                    nameShelter: dto?.nameShelter
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
                        size: dto?.size,
                        typeId: dto.typeId
                    },
                ],
            });
            await newCart.save();
        }
    }

    // Удалить товар из корзины юзера
    async removeFromCart(userId: string, productIds: string[]) {
        const cart = await this.findCartById(userId);
        if (!cart) {
            throw new HttpException(
              "Корзина пользователя не найдена",
              HttpStatus.NOT_FOUND
            );
        }



        for (const productId of productIds) {
            const itemIndex = cart.items.findIndex((item) => item.typeId.toString() === productId);
            if (itemIndex !== -1) {
                cart.items.splice(itemIndex, 1);
            }
        }

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
        // console.log('cart', cart)
        if (!cart) {
            return []; // Return an empty array if no cart found
        }
        const cartItemsWithPrices = await Promise.all(cart.items.map(async (item) => {
            const productCard = await this.productCardService.getProductCardById(item.productId);

            if (!productCard) {
                return null; // Handle the case where productCard is not found
            }

            const answer = {
                typeId: item.typeId,
                productId: item.productId,
                quantity: item.quantity,
                name: productCard.information.name,
                price: productCard.pricesAndQuantity,
                mainPhoto: productCard.mainPhoto,
                size: undefined,
                color: undefined,
                nameShelter: item?.nameShelter,
                card: productCard
            }
            if (item.size) answer.size = item.size
            if (item.color) answer.color = item.color
            return answer;
        }));

        return cartItemsWithPrices.filter(item => item !== null);
    }

    async setCountCart(userId: string, typeId: string, count: number) {
        const cart = await this.findCartById(userId);
        if (!cart) {
            throw new HttpException(
              "Корзина пользователя не найдена",
              HttpStatus.NOT_FOUND
            );
        }

        const itemIndex = cart.items.findIndex((item) => item.typeId.toString() === typeId);
        if (itemIndex !== -1) {
            cart.items[itemIndex].quantity = count;
        }

        await cart.save();
    }
}
