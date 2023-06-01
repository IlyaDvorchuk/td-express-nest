import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Cart, CartDocument} from "../cart/cart-item.schema";
import {Model} from "mongoose";
import {CreateCartDto} from "../cart/dto/create-cart.dto";
import {FavoriteItem, Favorites, FavoritesDocument} from "./favorite-item.schema";
import {CreateFavoritesDto} from "./dto/create-favorites.dto";

@Injectable()
export class FavoriteService {
    constructor(@InjectModel(Favorites.name) private favoritesRepository: Model<FavoritesDocument>) {
    }

    private async findFavoriteById(userId: string) {
        return this.favoritesRepository.findOne({userId});
    }

    async addToFavorite(userId: string, dto: CreateFavoritesDto) {
        const favorites = await this.findFavoriteById(userId );
        if (favorites) {
            const existingItem = favorites.items.find((item) => item.productId === dto.productId);
            if (existingItem) {
                throw new HttpException('Продукт уже находится в избранном', HttpStatus.BAD_REQUEST);
            } else {
                favorites.items.push({
                    productId: dto.productId,
                } as FavoriteItem);
                await favorites.save();
            }
        } else {
            const newFavorites = new this.favoritesRepository({
                userId,
                items: [
                    {
                        productId: dto.productId,
                    },
                ],
            });
            await newFavorites.save();
        }
    }
}
