import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
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

    async removeFromFavorite(userId: string, productId: string) {
        const favorites = await this.findFavoriteById(userId);
        if (favorites) {
            const itemIndex = favorites.items.findIndex((item) => item.productId === productId);
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
}
