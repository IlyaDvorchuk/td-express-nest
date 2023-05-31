import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartItem } from 'src/cart/cart-item.schema';
import { FavoriteItemDocument, Favorites } from 'src/favorite/favorite-item.schema';
import { CreateFavoritesDto } from 'src/favorite/dto/create-favorites.dto';
import { CreateCartDto } from 'src/cart/dto/create-cart.dto';
import { CategoryDocument } from 'src/categories/schemas/categories.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userRepository: Model<UserDocument>,
    @InjectModel(Cart.name) private cartRepository: Model<Cart>,
    @InjectModel(Favorites.name) private favoritesRepository: Model<Favorites>,
  ) {}

  async createUser(dto: CreateUserDto) {
    return await this.userRepository.create(dto);
  }

  async getAllUsers() {
    return this.userRepository.find({ isBaned: false });
  }

  async getAllBanedUsers() {
    return this.userRepository.find({ isBaned: true });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }
    // const role = await this.roleService.getRoleByValue(dto.value)
    // if (role) {
    //   user.roles.push(role.id);
    //   await user.save();
    //   return dto;
    // }
    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

  async banUserById(dto: BanUserDto) {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    user.isBaned = true;
    user.banReason = dto.banReason;
    return await user.save();
  }

  async searchUsers(query: any) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search = '', filter = {} } = query;

    const sort = 'desc';
    const skip = (page - 1) * limit;

    const filterConditions = {
      ...filter,
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { banReason: { $regex: search, $options: 'i' } },
      ],
      isDeleted: false,
    };

    const users = await this.userRepository.find(filterConditions).sort(sort).skip(skip).limit(limit);

    const totalUsers = await this.userRepository.countDocuments(filterConditions);

    return {
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      perPage: limit,
      sortBy,
      sortOrder,
      search,
      filter,
    };
  }

  async unbanUser(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    if (!user.isBaned) {
      throw new HttpException('Пользователь не забанен', HttpStatus.NOT_FOUND);
    }
    user.isBaned = false;
    user.banReason = undefined;
    return await user.save();
  }

  async addToCart(userId: string, dto: CreateCartDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const cart = await this.cartRepository.findOne({ userId });
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

  async addToFavorites(userId: string, dto: CreateFavoritesDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const favorites = await this.favoritesRepository.findOne({ userId });
    if (favorites) {
      const existingItem = favorites.items.find((item) => item.productId === dto.productId);
      if (existingItem) {
        throw new HttpException('Продукт уже находится в избранном', HttpStatus.BAD_REQUEST);
      } else {
        favorites.items.push({
          productId: dto.productId,
        });
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

  async findById(userId: string) {
    return this.userRepository.findById(userId).exec();
  }
}
