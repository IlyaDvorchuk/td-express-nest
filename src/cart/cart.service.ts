import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Cart, CartDocument} from "./cart-item.schema";
import {CreateCartDto} from "./dto/create-cart.dto";

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private cartRepository: Model<CartDocument>) {
    }

    private async findCartById(userId: string) {
        return this.cartRepository.findOne({userId});
    }

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
                    },
                ],
            });
            await newCart.save();
        }
    }
}
