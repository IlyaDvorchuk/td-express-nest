import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Favorites, FavoritesDocument} from "./favorite-item.schema";
import {ProductCard} from "../productCard/productCard.schema";

@Injectable()
export class FavoriteService {
    constructor(@InjectModel(Favorites.name) private favoritesRepository: Model<FavoritesDocument>) {
    }

    private async findFavoriteById(userId: string) {
        return this.favoritesRepository.findOne({userId});
    }

    async addToFavorite(userId: string, good: ProductCard) {
        const favorites = await this.findFavoriteById(userId );
        if (favorites) {
            const existingItem = favorites.items.find((item) => item._id.equals(good._id));
            if (existingItem) {
                throw new HttpException('Продукт уже находится в избранном', HttpStatus.BAD_REQUEST);
            } else {
                favorites.items.push(good as ProductCard);
                await favorites.save();
            }
        } else {
            const newFavorites = new this.favoritesRepository({
                userId,
                items: [
                    good,
                ],
            });
            await newFavorites.save();
        }

        return true
    }

    async getFavoritesById(userId: string) {
        const favorite = await this.favoritesRepository.findOne({userId}).populate('items');
        return favorite.items
    }
}
