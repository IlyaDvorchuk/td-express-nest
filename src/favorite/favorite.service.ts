import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FavoriteItem, Favorites, FavoritesDocument } from "./favorite-item.schema";
import { ProductCard } from "../productCard/productCard.schema";
import { ProductCardService } from "../productCard/productCard.service";

@Injectable()
export class FavoriteService {
    constructor(@InjectModel(Favorites.name) private favoritesRepository: Model<FavoritesDocument>,
                private productCardService: ProductCardService
                ) {
    }

    private async findFavoriteById(userId: string) {
        return this.favoritesRepository.findOne({userId});
    }

    async addToFavorite(userId: string, productId: string) {
        const favorites = await this.findFavoriteById(userId);
        console.log('favorites', favorites);
        if (favorites) {
            const existingItem = favorites.items.find((item) => item.productId === productId);
            if (existingItem) {
                throw new HttpException('Продукт уже находится в избранном', HttpStatus.BAD_REQUEST);
            } else {
                favorites.items.push({
                    productId: productId,
                } as FavoriteItem);
                await favorites.save();
            }
        } else {
            await this.favoritesRepository.create({
                userId,
                items: [
                    {
                        productId: productId,
                    },
                ],
            });
            return true
        }
    }

    async removeFromFavorite(userId: string, productId: string) {
        const favorites = await this.findFavoriteById(userId);

        if (favorites) {
            const itemIndex = favorites.items.findIndex((item) => item.productId.toString() === productId);
            if (itemIndex !== -1) {
                favorites.items.splice(itemIndex, 1);
                await favorites.save();
            } else {
                throw new HttpException('Продукт не найден в избранном', HttpStatus.NOT_FOUND);
            }
        } else {
            throw new HttpException('Избранное не найдено', HttpStatus.NOT_FOUND);
        }
    }

    async getFavoriteProducts(userId: string): Promise<FavoriteItem[]> {
        const favorites = await this.findFavoriteById(userId);

        if (!favorites) {
          return []; // Return an empty array if no favorites found
        }

        return favorites.items;
    }

    async getFavoriteProductsCards(userId: string): Promise<ProductCard[]> {
        const favorites = await this.findFavoriteById(userId);
        if (!favorites) {
            return []; // Return an empty array if no favorites found
        }

        const productIds = favorites.items.map(item => item.productId);

        return await this.productCardService.getProductCardsById(productIds);
    }
}
