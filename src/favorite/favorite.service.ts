import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {FavoriteItem, Favorites, FavoritesDocument} from "./favorite-item.schema";

@Injectable()
export class FavoriteService {
    constructor(@InjectModel(Favorites.name) private favoritesRepository: Model<FavoritesDocument>) {
    }

    private async findFavoriteById(userId: string) {
        return this.favoritesRepository.findOne({userId});
    }

    async addToFavorite(userId: string, goodId: string) {
        const favorites = await this.findFavoriteById(userId );
        if (favorites) {
            const existingItem = favorites.items.find((item) => item.productId === goodId);
            if (existingItem) {
                throw new HttpException('Продукт уже находится в избранном', HttpStatus.BAD_REQUEST);
            } else {
                favorites.items.push({
                    productId: goodId,
                } as FavoriteItem);
                await favorites.save();
            }
        } else {
            const newFavorites = new this.favoritesRepository({
                userId,
                items: [
                    {
                        productId: goodId,
                    },
                ],
            });
            await newFavorites.save();
        }

        return true
    }
}
